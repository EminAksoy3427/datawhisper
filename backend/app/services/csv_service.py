import io
import re
import unicodedata
from typing import Any

import pandas as pd
from fastapi import HTTPException, UploadFile, status

# Maps a canonical English column key to the Turkish/English synonyms users
# may write in their CSV or Excel headers. Synonyms are matched after the
# header is normalized (lowercased, diacritics stripped, whitespace folded).
COLUMN_SYNONYMS: dict[str, list[str]] = {
    "product_name": [
        "product_name",
        "urun",
        "urun adi",
        "product",
        "product name",
        "item",
        "stok adi",
    ],
    "category": [
        "category",
        "kategori",
        "urun grubu",
        "grup",
    ],
    "supplier": [
        "supplier",
        "tedarikci",
        "vendor",
    ],
    "date": [
        "date",
        "tarih",
        "siparis tarihi",
        "satis tarihi",
    ],
    "sales_quantity": [
        "sales_quantity",
        "adet",
        "satis adedi",
        "quantity",
        "qty",
        "miktar",
    ],
    "revenue": [
        "revenue",
        "ciro",
        "gelir",
        "satis tutari",
        "toplam satis",
        "sales",
        "total sales",
    ],
    "cost": [
        "cost",
        "maliyet",
        "gider",
        "urun maliyeti",
    ],
    "return_quantity": [
        "return_quantity",
        "iade",
        "iade adedi",
        "return",
        "returns",
        "returned quantity",
    ],
    "return_reason": [
        "return_reason",
        "iade nedeni",
        "iade sebebi",
        "return reason",
        "reason",
    ],
}

NUMERIC_CANONICAL_COLUMNS = [
    "sales_quantity",
    "revenue",
    "cost",
    "return_quantity",
]

TOP_PRODUCT_LIMIT = 5

SUPPORTED_EXTENSIONS = (".csv", ".xlsx", ".xls")

# Short Turkish explanations shown to the user when a capability cannot be
# computed because the related columns were not detected.
MISSING_CAPABILITY_MESSAGES: dict[str, str] = {
    "revenue_metrics": "Gelir sütunu bulunamadığı için gelir ve kar hesaplamaları yapılamadı.",
    "profit_metrics": "Maliyet sütunu bulunamadığı için kar ve kar marjı hesaplanamadı.",
    "return_rate": "Satış adedi veya iade adedi bulunamadığı için iade oranı hesaplanamadı.",
    "product_breakdown": "Ürün adı sütunu bulunamadığı için ürün bazlı grafikler oluşturulamadı.",
    "category_summary": "Kategori sütunu bulunamadığı için kategori özeti oluşturulamadı.",
}


def _round_value(value: float) -> float:
    return round(float(value), 2)


def _normalize_header(name: str) -> str:
    """Lower-case, strip diacritics and collapse whitespace for matching."""
    text = str(name).strip().lower()
    text = text.replace("ı", "i")
    decomposed = unicodedata.normalize("NFKD", text)
    stripped = "".join(ch for ch in decomposed if not unicodedata.combining(ch))
    return re.sub(r"\s+", " ", stripped).strip()


# Pre-compute a lookup of normalized synonym -> canonical key.
_SYNONYM_LOOKUP: dict[str, str] = {
    _normalize_header(synonym): canonical
    for canonical, synonyms in COLUMN_SYNONYMS.items()
    for synonym in synonyms
}


def _detect_columns(df: pd.DataFrame) -> dict[str, str]:
    """Return a mapping of canonical key -> original column name in the df."""
    detected: dict[str, str] = {}
    for original_column in df.columns:
        normalized = _normalize_header(original_column)
        canonical = _SYNONYM_LOOKUP.get(normalized)
        if canonical and canonical not in detected:
            detected[canonical] = str(original_column)
    return detected


def _apply_detection(df: pd.DataFrame, detected: dict[str, str]) -> pd.DataFrame:
    """Build a working frame that uses canonical names for detected columns."""
    working = pd.DataFrame()
    for canonical, original in detected.items():
        column = df[original]
        if canonical in NUMERIC_CANONICAL_COLUMNS:
            column = pd.to_numeric(column, errors="coerce").fillna(0)
        else:
            column = column.astype(str).fillna("").str.strip()
        working[canonical] = column
    return working


def _product_records(df: pd.DataFrame, sort_column: str) -> list[dict[str, Any]]:
    available_numeric = [c for c in NUMERIC_CANONICAL_COLUMNS if c in df.columns]
    if "product_name" not in df.columns or sort_column not in df.columns:
        return []

    grouped = (
        df.groupby("product_name", as_index=False)[available_numeric]
        .sum()
        .sort_values(sort_column, ascending=False)
        .head(TOP_PRODUCT_LIMIT)
    )

    records: list[dict[str, Any]] = []
    for row in grouped.to_dict(orient="records"):
        records.append(
            {
                "product_name": str(row["product_name"]),
                "revenue": _round_value(row["revenue"]) if "revenue" in row else 0.0,
                "cost": _round_value(row["cost"]) if "cost" in row else 0.0,
                "sales_quantity": _round_value(row["sales_quantity"])
                if "sales_quantity" in row
                else 0.0,
                "return_quantity": _round_value(row["return_quantity"])
                if "return_quantity" in row
                else 0.0,
            }
        )
    return records


def _category_records(df: pd.DataFrame) -> list[dict[str, Any]]:
    if "category" not in df.columns:
        return []

    available_numeric = [c for c in NUMERIC_CANONICAL_COLUMNS if c in df.columns]
    if not available_numeric:
        return []

    sort_column = "revenue" if "revenue" in df.columns else available_numeric[0]
    grouped = (
        df.groupby("category", as_index=False)[available_numeric]
        .sum()
        .sort_values(sort_column, ascending=False)
    )

    records: list[dict[str, Any]] = []
    for row in grouped.to_dict(orient="records"):
        revenue = float(row["revenue"]) if "revenue" in row else 0.0
        cost = float(row["cost"]) if "cost" in row else 0.0
        estimated_profit = (
            revenue - cost if "revenue" in row and "cost" in row else 0.0
        )
        records.append(
            {
                "category": str(row["category"]),
                "revenue": _round_value(revenue),
                "cost": _round_value(cost),
                "estimated_profit": _round_value(estimated_profit),
                "sales_quantity": _round_value(row["sales_quantity"])
                if "sales_quantity" in row
                else 0.0,
                "return_quantity": _round_value(row["return_quantity"])
                if "return_quantity" in row
                else 0.0,
            }
        )
    return records


def _collect_missing_capabilities(detected: dict[str, str]) -> list[str]:
    missing: list[str] = []
    if "revenue" not in detected:
        missing.append(MISSING_CAPABILITY_MESSAGES["revenue_metrics"])
    if "cost" not in detected:
        missing.append(MISSING_CAPABILITY_MESSAGES["profit_metrics"])
    if "sales_quantity" not in detected or "return_quantity" not in detected:
        missing.append(MISSING_CAPABILITY_MESSAGES["return_rate"])
    if "product_name" not in detected:
        missing.append(MISSING_CAPABILITY_MESSAGES["product_breakdown"])
    if "category" not in detected:
        missing.append(MISSING_CAPABILITY_MESSAGES["category_summary"])
    return missing


def build_business_summary(df: pd.DataFrame) -> dict[str, Any]:
    if df.empty:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Dosya boş veya analiz edilecek satır içermiyor.",
        )

    detected = _detect_columns(df)
    working = _apply_detection(df, detected)

    has_revenue = "revenue" in working.columns
    has_cost = "cost" in working.columns
    has_sales = "sales_quantity" in working.columns
    has_returns = "return_quantity" in working.columns

    total_revenue = float(working["revenue"].sum()) if has_revenue else None
    total_cost = float(working["cost"].sum()) if has_cost else None
    total_sales_quantity = float(working["sales_quantity"].sum()) if has_sales else None
    total_return_quantity = (
        float(working["return_quantity"].sum()) if has_returns else None
    )

    estimated_profit: float | None = None
    profit_margin: float | None = None
    if total_revenue is not None and total_cost is not None:
        estimated_profit = total_revenue - total_cost
        profit_margin = (
            (estimated_profit / total_revenue) * 100.0 if total_revenue > 0 else 0.0
        )

    return_rate: float | None = None
    if total_sales_quantity is not None and total_return_quantity is not None:
        return_rate = (
            (total_return_quantity / total_sales_quantity) * 100.0
            if total_sales_quantity > 0
            else 0.0
        )

    revenue_sort = "revenue" if has_revenue else None
    return_sort = "return_quantity" if has_returns else None

    top_revenue_products = (
        _product_records(working, revenue_sort) if revenue_sort else []
    )
    top_returned_products = (
        _product_records(working, return_sort) if return_sort else []
    )
    category_summary = _category_records(working)

    metrics = {
        "total_revenue": _round_value(total_revenue) if total_revenue is not None else None,
        "total_cost": _round_value(total_cost) if total_cost is not None else None,
        "estimated_profit": _round_value(estimated_profit)
        if estimated_profit is not None
        else None,
        "profit_margin": _round_value(profit_margin)
        if profit_margin is not None
        else None,
        "total_sales_quantity": _round_value(total_sales_quantity)
        if total_sales_quantity is not None
        else None,
        "total_return_quantity": _round_value(total_return_quantity)
        if total_return_quantity is not None
        else None,
        "return_rate": _round_value(return_rate) if return_rate is not None else None,
    }

    return {
        "metrics": metrics,
        "top_revenue_products": top_revenue_products,
        "top_returned_products": top_returned_products,
        "category_summary": category_summary,
        "row_count": int(len(df)),
        "detected_columns": detected,
        "missing_capabilities": _collect_missing_capabilities(detected),
    }


def _detect_extension(filename: str) -> str:
    lowered = filename.lower()
    for extension in SUPPORTED_EXTENSIONS:
        if lowered.endswith(extension):
            return extension
    raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Lütfen .csv, .xlsx veya .xls uzantılı bir dosya yükleyin.",
    )


def _read_dataframe(raw_bytes: bytes, extension: str) -> pd.DataFrame:
    buffer = io.BytesIO(raw_bytes)
    try:
        if extension == ".csv":
            return pd.read_csv(buffer)
        if extension == ".xlsx":
            return pd.read_excel(buffer, engine="openpyxl")
        if extension == ".xls":
            return pd.read_excel(buffer, engine="xlrd")
    except pd.errors.EmptyDataError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Dosya boş veya okunamıyor.",
        ) from exc
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Dosya okunamadı. Lütfen geçerli bir CSV veya Excel dosyası yükleyin.",
        ) from exc

    raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Desteklenmeyen dosya uzantısı.",
    )


async def parse_uploaded_file(file: UploadFile) -> pd.DataFrame:
    if not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Lütfen geçerli bir CSV veya Excel dosyası yükleyin.",
        )

    extension = _detect_extension(file.filename)
    raw_bytes = await file.read()
    if not raw_bytes:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Dosya boş.",
        )

    return _read_dataframe(raw_bytes, extension)


async def analyze_uploaded_csv(file: UploadFile) -> dict[str, Any]:
    df = await parse_uploaded_file(file)
    return build_business_summary(df)
