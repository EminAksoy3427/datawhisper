import json
from typing import Any

from fastapi import HTTPException, status
from openai import APIError, APITimeoutError, AsyncOpenAI, AuthenticationError, OpenAIError

from app.core.config import get_settings
from app.schemas.analysis import AnalysisResponse, ChartSuggestion, RiskLevel

ALLOWED_RISK_LEVELS: set[RiskLevel] = {"low", "medium", "high"}
ALLOWED_CHART_SUGGESTIONS: set[ChartSuggestion] = {
    "bar",
    "line",
    "pie",
    "table",
}

SYSTEM_PROMPT = """Sen DataWhisper adında küçük işletmeler için bir iş zekası asistanısın.
Kullanıcının sorusunu yalnızca verilen iş özeti verilerine dayanarak yanıtla.
Tüm metin alanlarını Türkçe yaz.
Yanıtı yalnızca geçerli JSON olarak döndür.
JSON anahtarları:
- summary: kısa durum özeti
- insight: ana iş içgörüsü
- recommendation: uygulanabilir öneri
- risk_level: "low", "medium" veya "high"
- chart_suggestion: "bar", "line", "pie" veya "table"
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
        f"İş özeti verisi (JSON):\n{summary_json}"
    )


def _normalize_risk_level(value: str) -> RiskLevel:
    normalized = value.strip().lower()
    if normalized in ALLOWED_RISK_LEVELS:
        return normalized  # type: ignore[return-value]
    return "medium"


def _normalize_chart_suggestion(value: str) -> ChartSuggestion:
    normalized = value.strip().lower()
    if normalized in ALLOWED_CHART_SUGGESTIONS:
        return normalized  # type: ignore[return-value]
    return "bar"


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

    required_fields = [
        "summary",
        "insight",
        "recommendation",
        "risk_level",
        "chart_suggestion",
    ]
    missing_fields = [field for field in required_fields if field not in payload]
    if missing_fields:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="AI yanıtında eksik alanlar var.",
        )

    return AnalysisResponse(
        summary=str(payload["summary"]).strip(),
        insight=str(payload["insight"]).strip(),
        recommendation=str(payload["recommendation"]).strip(),
        risk_level=_normalize_risk_level(str(payload["risk_level"])),
        chart_suggestion=_normalize_chart_suggestion(str(payload["chart_suggestion"])),
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
