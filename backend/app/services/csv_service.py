import io
from typing import Any

import pandas as pd
from fastapi import HTTPException, UploadFile, status

from app.services.column_detection import (
    NUMERIC_CANONICAL_COLUMNS,
    ColumnDetectionResult,
    detect_columns,
)

TOP_PRODUCT_LIMIT = 5

SUPPORTED_EXTENSIONS = (".csv", ".xlsx", ".xls")


def _round_value(value: float) -> float:
    return round(float(value), 2)


def _apply_detection(df: pd.DataFrame, reliable: dict[str, str]) -> pd.DataFrame:
    """Build a working frame with canonical names for reliable (>=85) columns only."""
    working = pd.DataFrame()
    for canonical, original in reliable.items():
        column = df[original]
        if canonical in NUMERIC_CANONICAL_COLUMNS:
            column = pd.to_numeric(column, errors="coerce").fillna(0)
        else:
            column = column.astype(str).fillna("").str.strip()
        working[canonical] = column
    return working


def _series_total_revenue(working: pd.DataFrame, detection: ColumnDetectionResult) -> float | None:
    if detection.has_reliable("revenue"):
        return float(working["revenue"].sum())
    if detection.has_reliable("unit_price") and detection.has_reliable("sales_quantity"):
        return float((working["unit_price"] * working["sales_quantity"]).sum())
    return None


def _series_total_cost(working: pd.DataFrame, detection: ColumnDetectionResult) -> float | None:
    if detection.has_reliable("cost"):
        return float(working["cost"].sum())
    if detection.has_reliable("unit_cost") and detection.has_reliable("sales_quantity"):
        return float((working["unit_cost"] * working["sales_quantity"]).sum())
    return None


def _estimated_profit(
    working: pd.DataFrame,
    detection: ColumnDetectionResult,
    total_revenue: float | None,
    total_cost: float | None,
) -> float | None:
    if detection.has_reliable("profit"):
        return float(working["profit"].sum())
    if total_revenue is not None and total_cost is not None:
        return total_revenue - total_cost
    return None


def _profit_margin(
    working: pd.DataFrame,
    detection: ColumnDetectionResult,
    total_revenue: float | None,
) -> float | None:
    if not detection.has_reliable("profit") or total_revenue is None or total_revenue <= 0:
        return None
    total_profit = float(working["profit"].sum())
    return (total_profit / total_revenue) * 100.0


def _grouping_field(working: pd.DataFrame) -> str | None:
    if "product_name" in working.columns:
        return "product_name"
    if "category" in working.columns:
        return "category"
    return None


def _product_records(
    working: pd.DataFrame,
    sort_column: str,
    *,
    label_field: str,
) -> list[dict[str, Any]]:
    available_numeric = [c for c in NUMERIC_CANONICAL_COLUMNS if c in working.columns]
    if label_field not in working.columns or sort_column not in working.columns:
        return []

    grouped = (
        working.groupby(label_field, as_index=False)[available_numeric]
        .sum()
        .sort_values(sort_column, ascending=False)
        .head(TOP_PRODUCT_LIMIT)
    )

    records: list[dict[str, Any]] = []
    for row in grouped.to_dict(orient="records"):
        records.append(
            {
                "product_name": str(row[label_field]),
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


def _category_records(
    working: pd.DataFrame,
    detection: ColumnDetectionResult,
    total_revenue: float | None,
    total_cost: float | None,
) -> list[dict[str, Any]]:
    if detection.has_reliable("category"):
        group_field = "category"
    elif detection.has_reliable("product_name"):
        group_field = "product_name"
        label_key = "category"
    else:
        return []

    available_numeric = [c for c in NUMERIC_CANONICAL_COLUMNS if c in working.columns]
    if not available_numeric:
        return []

    sort_column = "revenue" if "revenue" in working.columns else available_numeric[0]
    grouped = (
        working.groupby(group_field, as_index=False)[available_numeric]
        .sum()
        .sort_values(sort_column, ascending=False)
    )

    records: list[dict[str, Any]] = []
    for row in grouped.to_dict(orient="records"):
        revenue = float(row["revenue"]) if "revenue" in row else 0.0
        cost = float(row["cost"]) if "cost" in row else 0.0
        row_profit: float | None = None
        if detection.has_reliable("profit") and "profit" in row:
            row_profit = float(row["profit"])
        elif "revenue" in row and "cost" in row:
            row_profit = revenue - cost
        estimated_profit = row_profit if row_profit is not None else 0.0

        records.append(
            {
                "category": str(row[group_field]),
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


def _collect_missing_capabilities(
    detection: ColumnDetectionResult,
    metrics: dict[str, Any],
    top_revenue_products: list[dict[str, Any]],
    top_returned_products: list[dict[str, Any]],
    category_summary: list[dict[str, Any]],
) -> list[str]:
    missing: list[str] = []

    if metrics["total_revenue"] is None:
        missing.append(
            "Gelir veya satış tutarı sütunu güvenle algılanamadığı için "
            "toplam gelir hesaplanamadı."
        )
    if metrics["total_cost"] is None:
        missing.append(
            "Maliyet verisi bulunamadığı için maliyet ve kâr hesaplamaları "
            "kısmen yapılamadı."
        )
    if metrics["estimated_profit"] is None and metrics["total_revenue"] is not None:
        missing.append(
            "Maliyet veya kâr verisi bulunamadığı için tahmini kâr hesaplanamadı."
        )
    if metrics["profit_margin"] is None and detection.has_reliable("revenue"):
        missing.append(
            "Kâr sütunu güvenle algılanamadığı için kâr marjı hesaplanamadı."
        )
    if metrics["return_rate"] is None:
        missing.append(
            "İade verisi bulunamadığı için iade oranı hesaplanamadı."
        )
    if not top_revenue_products:
        missing.append(
            "Ürün veya kategori alanı güvenle algılanamadığı için "
            "ürün bazlı gelir grafiği oluşturulamadı."
        )
    if detection.has_reliable("return_quantity") and not top_returned_products:
        missing.append(
            "Ürün veya kategori alanı güvenle algılanamadığı için "
            "iade edilen ürün grafiği oluşturulamadı."
        )
    if not category_summary:
        missing.append(
            "Kategori veya ürün alanı güvenle algılanamadığı için "
            "kategori özeti oluşturulamadı."
        )

    seen: set[str] = set()
    unique: list[str] = []
    for message in missing:
        if message not in seen:
            seen.add(message)
            unique.append(message)
    return unique


def build_business_summary(df: pd.DataFrame) -> dict[str, Any]:
    if df.empty:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Dosya boş veya analiz edilecek satır içermiyor.",
        )

    detection = detect_columns([str(c) for c in df.columns])
    working = _apply_detection(df, detection.reliable)

    total_revenue = _series_total_revenue(working, detection)
    total_cost = _series_total_cost(working, detection)
    estimated_profit = _estimated_profit(
        working, detection, total_revenue, total_cost
    )
    profit_margin = _profit_margin(working, detection, total_revenue)

    total_sales_quantity: float | None = None
    if detection.has_reliable("sales_quantity"):
        total_sales_quantity = float(working["sales_quantity"].sum())

    total_return_quantity: float | None = None
    if detection.has_reliable("return_quantity"):
        total_return_quantity = float(working["return_quantity"].sum())

    return_rate: float | None = None
    if (
        total_sales_quantity is not None
        and total_return_quantity is not None
        and total_sales_quantity > 0
    ):
        return_rate = (total_return_quantity / total_sales_quantity) * 100.0

    group_field = _grouping_field(working)
    top_revenue_products: list[dict[str, Any]] = []
    if group_field:
        chart_working = working
        revenue_sort: str | None = None
        if "revenue" in working.columns:
            revenue_sort = "revenue"
        elif detection.has_reliable("unit_price") and detection.has_reliable(
            "sales_quantity"
        ):
            chart_working = working.copy()
            chart_working["revenue"] = (
                chart_working["unit_price"] * chart_working["sales_quantity"]
            )
            revenue_sort = "revenue"
        if revenue_sort:
            top_revenue_products = _product_records(
                chart_working, revenue_sort, label_field=group_field
            )

    top_returned_products: list[dict[str, Any]] = []
    if group_field and detection.has_reliable("return_quantity"):
        return_sort = "return_quantity"
        top_returned_products = _product_records(
            working, return_sort, label_field=group_field
        )

    category_summary = _category_records(
        working, detection, total_revenue, total_cost
    )

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
        "detected_columns": detection.detected_columns,
        "detected_column_confidence": detection.detected_column_confidence,
        "detected_dimensions": detection.detected_dimensions,
        "possible_matches": detection.possible_matches,
        "missing_capabilities": _collect_missing_capabilities(
            detection,
            metrics,
            top_revenue_products,
            top_returned_products,
            category_summary,
        ),
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
