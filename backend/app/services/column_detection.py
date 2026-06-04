"""Flexible column detection: normalization, aliases, and fuzzy matching."""

from __future__ import annotations

import re
import unicodedata
from dataclasses import dataclass, field
from typing import Any

from rapidfuzz import fuzz

CONFIDENCE_EXACT = 100
CONFIDENCE_ACCEPT = 85
CONFIDENCE_POSSIBLE_MIN = 70

DIMENSION_FIELDS = frozenset(
    {"region", "country", "sales_channel", "order_priority", "order_id"}
)

# Canonical fields used for metrics / breakdowns (not dimensions).
_TURKISH_MAP = str.maketrans(
    {
        "ü": "u",
        "Ü": "u",
        "ğ": "g",
        "Ğ": "g",
        "ş": "s",
        "Ş": "s",
        "ı": "i",
        "İ": "i",
        "ö": "o",
        "Ö": "o",
        "ç": "c",
        "Ç": "c",
    }
)

COLUMN_ALIASES: dict[str, list[str]] = {
    "date": [
        "date",
        "order date",
        "ship date",
        "transaction date",
        "sale date",
        "sales date",
        "tarih",
        "sipariş tarihi",
        "siparis tarihi",
        "sevk tarihi",
        "satış tarihi",
        "satis tarihi",
    ],
    "product_name": [
        "product",
        "product name",
        "product_name",
        "item",
        "item name",
        "sku",
        "stock name",
        "stock code",
        "ürün",
        "urun",
        "ürün adı",
        "urun adi",
        "stok adı",
        "stok adi",
        "malzeme",
        "malzeme adı",
        "malzeme adi",
    ],
    "category": [
        "category",
        "item type",
        "product type",
        "product category",
        "segment",
        "group",
        "kategori",
        "ürün grubu",
        "urun grubu",
        "ürün tipi",
        "urun tipi",
        "grup",
    ],
    "sales_quantity": [
        "quantity",
        "qty",
        "units",
        "units sold",
        "quantity sold",
        "sales quantity",
        "sold quantity",
        "sales_quantity",
        "adet",
        "miktar",
        "satış adedi",
        "satis adedi",
        "satılan adet",
        "satilan adet",
    ],
    "unit_price": [
        "unit price",
        "price",
        "sales price",
        "item price",
        "unit_price",
        "birim fiyat",
        "satış fiyatı",
        "satis fiyati",
    ],
    "unit_cost": [
        "unit cost",
        "cost per unit",
        "item cost",
        "unit_cost",
        "birim maliyet",
        "ürün maliyeti",
        "urun maliyeti",
    ],
    "revenue": [
        "revenue",
        "total revenue",
        "sales",
        "total sales",
        "sales amount",
        "sales value",
        "turnover",
        "gross sales",
        "gelir",
        "ciro",
        "toplam gelir",
        "toplam satış",
        "toplam satis",
        "satış tutarı",
        "satis tutari",
    ],
    "cost": [
        "cost",
        "total cost",
        "total expense",
        "expense",
        "total expenses",
        "maliyet",
        "toplam maliyet",
        "gider",
        "toplam gider",
    ],
    "profit": [
        "profit",
        "total profit",
        "gross profit",
        "net profit",
        "margin amount",
        "kar",
        "kâr",
        "toplam kar",
        "toplam kâr",
    ],
    "return_quantity": [
        "return",
        "returns",
        "returned",
        "returned quantity",
        "return quantity",
        "refund quantity",
        "return_quantity",
        "iade",
        "iadeler",
        "iade adedi",
        "iade miktarı",
        "iade miktari",
    ],
    "return_reason": [
        "return reason",
        "reason",
        "refund reason",
        "complaint reason",
        "return_reason",
        "iade nedeni",
        "iade sebebi",
        "sebep",
        "şikayet nedeni",
        "sikayet nedeni",
    ],
    "region": [
        "region",
        "area",
        "territory",
        "zone",
        "bölge",
        "bolge",
        "alan",
    ],
    "country": [
        "country",
        "market",
        "location",
        "ülke",
        "ulke",
        "pazar",
        "lokasyon",
    ],
    "sales_channel": [
        "sales channel",
        "channel",
        "order channel",
        "platform",
        "satış kanalı",
        "satis kanali",
        "kanal",
    ],
    "order_priority": [
        "order priority",
        "priority",
        "sipariş önceliği",
        "siparis onceligi",
        "öncelik",
        "oncelik",
    ],
    "order_id": [
        "order id",
        "order number",
        "invoice number",
        "transaction id",
        "order_id",
        "sipariş no",
        "siparis no",
        "sipariş numarası",
        "siparis numarasi",
        "fatura no",
    ],
    "supplier": [
        "supplier",
        "vendor",
        "tedarikci",
        "tedarikçi",
    ],
}

NUMERIC_CANONICAL_COLUMNS = [
    "sales_quantity",
    "unit_price",
    "unit_cost",
    "revenue",
    "cost",
    "profit",
    "return_quantity",
]


def normalize_header(name: str) -> str:
    """Normalize a header for matching (case, Turkish chars, punctuation, spacing)."""
    text = str(name).strip().translate(_TURKISH_MAP)
    text = text.lower()
    text = re.sub(r"[_\-\./]+", " ", text)
    decomposed = unicodedata.normalize("NFKD", text)
    ascii_folded = "".join(
        ch for ch in decomposed if not unicodedata.combining(ch)
    )
    ascii_folded = re.sub(r"[^\w\s]", " ", ascii_folded)
    ascii_folded = re.sub(r"\s+", " ", ascii_folded).strip()
    return ascii_folded


_NORMALIZED_ALIASES: dict[str, list[tuple[str, str]]] = {
    canonical: [(alias, normalize_header(alias)) for alias in aliases]
    for canonical, aliases in COLUMN_ALIASES.items()
}

_EXACT_LOOKUP: dict[str, str] = {}
for canonical, alias_pairs in _NORMALIZED_ALIASES.items():
    for _raw, normalized in alias_pairs:
        if normalized not in _EXACT_LOOKUP:
            _EXACT_LOOKUP[normalized] = canonical


@dataclass
class ColumnMatch:
    canonical: str
    original_column: str
    confidence: int


@dataclass
class ColumnDetectionResult:
    """Outcome of column detection for one dataframe."""

    detected_columns: dict[str, str] = field(default_factory=dict)
    detected_dimensions: dict[str, str] = field(default_factory=dict)
    detected_column_confidence: dict[str, int] = field(default_factory=dict)
    possible_matches: list[dict[str, Any]] = field(default_factory=list)
    reliable: dict[str, str] = field(default_factory=dict)

    def has_reliable(self, canonical: str) -> bool:
        return canonical in self.reliable


def _fuzzy_score(normalized_header: str, normalized_alias: str) -> int:
    return int(
        fuzz.WRatio(normalized_header, normalized_alias, score_cutoff=0)
    )


def _best_match_for_column(normalized_header: str) -> ColumnMatch | None:
    exact_canonical = _EXACT_LOOKUP.get(normalized_header)
    if exact_canonical:
        return ColumnMatch(
            canonical=exact_canonical,
            original_column="",
            confidence=CONFIDENCE_EXACT,
        )

    best_canonical: str | None = None
    best_score = 0
    for canonical, alias_pairs in _NORMALIZED_ALIASES.items():
        for _raw, normalized_alias in alias_pairs:
            score = _fuzzy_score(normalized_header, normalized_alias)
            if score > best_score:
                best_score = score
                best_canonical = canonical

    if best_canonical is None or best_score < CONFIDENCE_POSSIBLE_MIN:
        return None
    return ColumnMatch(
        canonical=best_canonical,
        original_column="",
        confidence=best_score,
    )


def detect_columns(df_columns: list[str]) -> ColumnDetectionResult:
    """
    Detect canonical columns from dataframe headers.

    Exact normalized alias matches run first (confidence 100).
    Fuzzy matching is used only when no exact match applies for that column.
    """
    per_canonical: dict[str, ColumnMatch] = {}

    for original in df_columns:
        normalized = normalize_header(original)
        if not normalized:
            continue

        exact = _EXACT_LOOKUP.get(normalized)
        if exact:
            candidate = ColumnMatch(exact, str(original), CONFIDENCE_EXACT)
        else:
            fuzzy = _best_match_for_column(normalized)
            if fuzzy is None:
                continue
            candidate = ColumnMatch(
                fuzzy.canonical, str(original), fuzzy.confidence
            )

        existing = per_canonical.get(candidate.canonical)
        if existing is None or candidate.confidence > existing.confidence:
            per_canonical[candidate.canonical] = candidate
        elif (
            existing.confidence == candidate.confidence
            and len(candidate.original_column) < len(existing.original_column)
        ):
            per_canonical[candidate.canonical] = candidate

    result = ColumnDetectionResult()
    possible: list[dict[str, Any]] = []

    for canonical, match in sorted(per_canonical.items()):
        if match.confidence >= CONFIDENCE_ACCEPT:
            result.reliable[canonical] = match.original_column
            result.detected_column_confidence[canonical] = match.confidence
            if canonical in DIMENSION_FIELDS:
                result.detected_dimensions[canonical] = match.original_column
            else:
                result.detected_columns[canonical] = match.original_column
        elif match.confidence >= CONFIDENCE_POSSIBLE_MIN:
            possible.append(
                {
                    "canonical": canonical,
                    "column": match.original_column,
                    "confidence": match.confidence,
                }
            )

    result.possible_matches = possible
    return result

