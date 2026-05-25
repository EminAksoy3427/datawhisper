import json
import unicodedata
from typing import Any

from fastapi import HTTPException, status
from openai import APIError, APITimeoutError, AsyncOpenAI, AuthenticationError, OpenAIError

from app.core.config import get_settings
from app.schemas.analysis import AnalysisResponse, ChartSuggestion, Priority, RiskLevel

ALLOWED_RISK_LEVELS: set[RiskLevel] = {"low", "medium", "high"}
ALLOWED_CHART_SUGGESTIONS: set[ChartSuggestion] = {
    "bar",
    "line",
    "pie",
    "table",
}
ALLOWED_PRIORITIES: set[Priority] = {
    "Bugün kontrol edilmeli",
    "Bu hafta kontrol edilmeli",
    "Takipte kalmalı",
}

DEFAULT_PRIORITY: Priority = "Takipte kalmalı"
DEFAULT_FOCUS_AREA = "Genel Performans"

HEADLINE_MAX_LENGTH = 120
RECOMMENDED_ACTIONS_COUNT = 3
FOLLOW_UP_QUESTIONS_COUNT = 3
DATA_TO_CHECK_MIN = 3
DATA_TO_CHECK_MAX = 5

SYSTEM_PROMPT = """Sen DataWhisper'sın: küçük ve orta ölçekli işletmeler (KOBİ) için pratik, deneyimli bir iş analistisin.
Görevin, kullanıcının Türkçe sorusunu YALNIZCA verilen "business_summary" verilerine dayanarak,
deneyimli bir iş analistinin tonuyla yanıtlamak.

Davranış kuralları:
- Tüm metin alanlarını Türkçe yaz; sade, profesyonel ve karar odaklı bir dil kullan.
- Genel/jenerik tavsiyelerden kesinlikle kaçın. Mümkün olan her yerde business_summary içindeki
  SOMUT verileri (ürün adları, kategori adları, gelir, kar, kar marjı, iade oranı, satış adedi gibi)
  cümlelerin içine yerleştir.
- top_revenue_products, top_returned_products veya category_summary boş ise ya da bir metrik null ise,
  bunu açıkça belirt. Örn: "İade verisi olmadığı için iade oranı yorumlanamadı."
- Veride olmayan rakamları uydurma; sadece veriden çıkarılabilecekleri söyle.
- Pazarlama dili, klişe ifadeler veya boş övgüler kullanma. Bir KOBİ sahibinin uygulayabileceği
  somut, ölçülebilir aksiyonlar öner.
- Yanıtı SADECE geçerli JSON olarak döndür; JSON dışında hiçbir metin ekleme.

Yanıt JSON şeması (tüm alanlar zorunludur):
{
  "headline": string,                  // En fazla 120 karakter, tek cümlelik ana bulgu başlığı.
  "risk_level": "low" | "medium" | "high",
  "focus_area": string,                // Örn: "İade Riski", "Kârlılık", "Kategori Performansı", "Gelir Yoğunlaşması", "Stok Verimliliği".
  "priority": "Bugün kontrol edilmeli" | "Bu hafta kontrol edilmeli" | "Takipte kalmalı",
  "main_finding": string,              // Veriden gelen somut bulgu; mümkünse rakam içersin.
  "why_it_matters": string,            // İşletme için neden önemli; sade ve net.
  "recommended_actions": [string, string, string],   // TAM 3 uygulanabilir aksiyon. Her aksiyon kısa bir emir cümlesi olsun.
  "expected_impact": string,           // Aksiyonların olası iş etkisi (örn. "iade oranını 2-3 puan düşürebilir").
  "data_to_check": [string, ...],      // 3 ile 5 arasında, kullanıcının izleyebileceği veri/metrik adımları.
  "follow_up_questions": [string, string, string],   // TAM 3 Türkçe takip sorusu, hepsi soru işareti ile bitsin.
  "chart_suggestion": "bar" | "line" | "pie" | "table"
}

Kurallar:
- recommended_actions her zaman tam 3 madde olmalı.
- follow_up_questions her zaman tam 3 madde olmalı ve "?" ile bitmeli.
- data_to_check 3 ile 5 madde arasında olmalı.
- headline 120 karakteri aşmamalı.
- Veri çok sınırlıysa risk_level "low" verme; "medium" ver ve eksik veriyi açıkça belirt.
"""


def _get_openai_client() -> AsyncOpenAI:
    settings = get_settings()
    if not settings.openai_api_key:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="OPENAI_API_KEY is not configured. Add it to your backend .env file.",
        )
    return AsyncOpenAI(api_key=settings.openai_api_key)


def _build_user_prompt(question: str, business_summary: dict[str, Any]) -> str:
    summary_json = json.dumps(business_summary, ensure_ascii=False)
    return (
        f"Kullanıcı sorusu: {question.strip()}\n\n"
        f"İş özeti verisi (JSON):\n{summary_json}\n\n"
        "Yukarıdaki veriye dayanarak bir KOBİ iş analisti gibi yanıt ver. "
        "Cümlelerinde mümkün olan her yerde gerçek ürün/kategori adlarını ve sayısal "
        "değerleri kullan; veride olmayan bir şey hakkında varsayım yapma."
    )


def _normalize_risk_level(value: Any) -> RiskLevel:
    if not isinstance(value, str):
        return "medium"
    normalized = value.strip().lower()
    if normalized in ALLOWED_RISK_LEVELS:
        return normalized  # type: ignore[return-value]
    return "medium"


def _normalize_chart_suggestion(value: Any) -> ChartSuggestion:
    if not isinstance(value, str):
        return "bar"
    normalized = value.strip().lower()
    if normalized in ALLOWED_CHART_SUGGESTIONS:
        return normalized  # type: ignore[return-value]
    return "bar"


def _ascii_fold(text: str) -> str:
    """Lower-case + strip diacritics for tolerant fuzzy comparisons."""
    folded = text.strip().lower().replace("ı", "i")
    decomposed = unicodedata.normalize("NFKD", folded)
    return "".join(ch for ch in decomposed if not unicodedata.combining(ch))


def _normalize_priority(value: Any) -> Priority:
    if not isinstance(value, str):
        return DEFAULT_PRIORITY
    normalized = value.strip()
    if normalized in ALLOWED_PRIORITIES:
        return normalized  # type: ignore[return-value]
    folded = _ascii_fold(normalized)
    if "bugun" in folded:
        return "Bugün kontrol edilmeli"
    if "hafta" in folded:
        return "Bu hafta kontrol edilmeli"
    if "takip" in folded:
        return "Takipte kalmalı"
    return DEFAULT_PRIORITY


def _clean_string(value: Any, fallback: str = "") -> str:
    if value is None:
        return fallback
    text = str(value).strip()
    return text if text else fallback


def _clamp_headline(value: str) -> str:
    if len(value) <= HEADLINE_MAX_LENGTH:
        return value
    return value[: HEADLINE_MAX_LENGTH - 1].rstrip() + "…"


def _coerce_string_list(value: Any) -> list[str]:
    if not isinstance(value, list):
        return []
    cleaned: list[str] = []
    for item in value:
        text = _clean_string(item)
        if text:
            cleaned.append(text)
    return cleaned


def _ensure_exact_length(
    items: list[str],
    target: int,
    fallback_filler: str,
) -> list[str]:
    if len(items) >= target:
        return items[:target]
    result = list(items)
    while len(result) < target:
        result.append(fallback_filler)
    return result


def _ensure_question_suffix(text: str) -> str:
    return text if text.endswith("?") else f"{text}?"


def _join_actions_as_recommendation(actions: list[str]) -> str:
    cleaned = [action.rstrip(". ").strip() for action in actions if action]
    if not cleaned:
        return ""
    return ". ".join(cleaned) + "."


def _parse_analysis_payload(raw_content: str) -> AnalysisResponse:
    try:
        payload = json.loads(raw_content)
    except json.JSONDecodeError as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="AI yanıtı işlenemedi. Lütfen tekrar deneyin.",
        ) from exc

    if not isinstance(payload, dict):
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="AI yanıtı beklenen formatta değil.",
        )

    # New structured fields, with graceful fallbacks to the legacy keys when
    # the model occasionally omits a new one.
    main_finding = _clean_string(
        payload.get("main_finding"),
        fallback=_clean_string(payload.get("summary")),
    )
    why_it_matters = _clean_string(
        payload.get("why_it_matters"),
        fallback=_clean_string(payload.get("insight")),
    )

    recommended_actions = _coerce_string_list(payload.get("recommended_actions"))
    if not recommended_actions:
        legacy_recommendation = _clean_string(payload.get("recommendation"))
        if legacy_recommendation:
            recommended_actions = [legacy_recommendation]
    recommended_actions = _ensure_exact_length(
        recommended_actions,
        RECOMMENDED_ACTIONS_COUNT,
        fallback_filler="Önerilen ek bir aksiyon belirlenemedi.",
    )

    data_to_check = _coerce_string_list(payload.get("data_to_check"))
    if len(data_to_check) > DATA_TO_CHECK_MAX:
        data_to_check = data_to_check[:DATA_TO_CHECK_MAX]
    if len(data_to_check) < DATA_TO_CHECK_MIN:
        data_to_check = _ensure_exact_length(
            data_to_check,
            DATA_TO_CHECK_MIN,
            fallback_filler="Önümüzdeki haftaya ait satış ve iade verisini takip edin.",
        )

    follow_up_questions = _coerce_string_list(payload.get("follow_up_questions"))
    follow_up_questions = [
        _ensure_question_suffix(item) for item in follow_up_questions
    ]
    follow_up_questions = _ensure_exact_length(
        follow_up_questions,
        FOLLOW_UP_QUESTIONS_COUNT,
        fallback_filler="Bu konuyu hangi metrikle daha derin inceleyebilirim?",
    )

    headline = _clamp_headline(
        _clean_string(
            payload.get("headline"),
            fallback=main_finding or "İş verisi için DataWhisper analizi.",
        )
    )

    focus_area = _clean_string(payload.get("focus_area"), fallback=DEFAULT_FOCUS_AREA)
    expected_impact = _clean_string(
        payload.get("expected_impact"),
        fallback="Aksiyonların etkisi veri takip edildikçe netleşecek.",
    )

    risk_level = _normalize_risk_level(payload.get("risk_level"))
    chart_suggestion = _normalize_chart_suggestion(payload.get("chart_suggestion"))
    priority = _normalize_priority(payload.get("priority"))

    # Derive legacy fields so older clients keep working.
    summary = _clean_string(payload.get("summary"), fallback=main_finding)
    insight = _clean_string(payload.get("insight"), fallback=why_it_matters)
    recommendation = _clean_string(
        payload.get("recommendation"),
        fallback=_join_actions_as_recommendation(recommended_actions),
    )

    if not (main_finding and why_it_matters):
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="AI yanıtında ana bulgu veya gerekçe alanı eksik.",
        )

    return AnalysisResponse(
        summary=summary or main_finding,
        insight=insight or why_it_matters,
        recommendation=recommendation
        or _join_actions_as_recommendation(recommended_actions),
        risk_level=risk_level,
        chart_suggestion=chart_suggestion,
        headline=headline,
        focus_area=focus_area,
        priority=priority,
        main_finding=main_finding,
        why_it_matters=why_it_matters,
        recommended_actions=recommended_actions,
        expected_impact=expected_impact,
        data_to_check=data_to_check,
        follow_up_questions=follow_up_questions,
    )


async def analyze_business_question(
    question: str,
    business_summary: dict[str, Any],
) -> AnalysisResponse:
    settings = get_settings()
    client = _get_openai_client()

    try:
        completion = await client.chat.completions.create(
            model=settings.openai_model,
            temperature=0.4,
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {
                    "role": "user",
                    "content": _build_user_prompt(question, business_summary),
                },
            ],
        )
    except AuthenticationError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="OpenAI API anahtarı geçersiz. OPENAI_API_KEY değerini kontrol edin.",
        ) from exc
    except (APITimeoutError, APIError, OpenAIError) as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="AI analizi şu anda tamamlanamadı. Lütfen daha sonra tekrar deneyin.",
        ) from exc

    raw_content = completion.choices[0].message.content
    if not raw_content:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="AI boş bir yanıt döndürdü.",
        )

    return _parse_analysis_payload(raw_content)
