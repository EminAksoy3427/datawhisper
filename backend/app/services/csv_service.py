import io
from typing import Any

import pandas as pd
from fastapi import HTTPException, UploadFile, status

REQUIRED_COLUMNS = [
    "date",
    "product_name",
    "category",
    "supplier",
    "sales_quantity",
    "revenue",
    "cost",
    "return_quantity",
    "return_reason",
]

NUMERIC_COLUMNS = [
    "sales_quantity",
    "revenue",
    "cost",
    "return_quantity",
]

TOP_PRODUCT_LIMIT = 5


def _round_value(value: float) -> float:
    return round(float(value), 2)


def _normalize_columns(df: pd.DataFrame) -> pd.DataFrame:
    normalized = df.copy()
    normalized.columns = (
        normalized.columns.astype(str).str.strip().str.lower().str.replace(" ", "_")
    )
    return normalized


def _validate_required_columns(df: pd.DataFrame) -> None:
    missing_columns = [column for column in REQUIRED_COLUMNS if column not in df.columns]
    if not missing_columns:
        return

    missing_list = ", ".join(missing_columns)
    raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail=f"CSV dosyasında eksik sütunlar var: {missing_list}",
    )


def _validate_numeric_columns(df: pd.DataFrame) -> pd.DataFrame:
    validated = df.copy()
    for column in NUMERIC_COLUMNS:
        validated[column] = pd.to_numeric(validated[column], errors="coerce")

    if validated[NUMERIC_COLUMNS].isna().any().any():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="CSV dosyasında sayısal alanlar geçersiz. sales_quantity, revenue, cost ve return_quantity sayı olmalıdır.",
        )

    return validated


def _product_records(df: pd.DataFrame, sort_column: str) -> list[dict[str, Any]]:
    grouped = (
        df.groupby("product_name", as_index=False)[
            ["revenue", "cost", "sales_quantity", "return_quantity"]
        ]
        .sum()
        .sort_values(sort_column, ascending=False)
        .head(TOP_PRODUCT_LIMIT)
    )

    records: list[dict[str, Any]] = []
    for row in grouped.to_dict(orient="records"):
        records.append(
            {
                "product_name": str(row["product_name"]),
                "revenue": _round_value(row["revenue"]),
                "cost": _round_value(row["cost"]),
                "sales_quantity": _round_value(row["sales_quantity"]),
                "return_quantity": _round_value(row["return_quantity"]),
            }
        )
    return records


def _category_records(df: pd.DataFrame) -> list[dict[str, Any]]:
    grouped = (
        df.groupby("category", as_index=False)[
            ["revenue", "cost", "sales_quantity", "return_quantity"]
        ]
        .sum()
        .sort_values("revenue", ascending=False)
    )

    records: list[dict[str, Any]] = []
    for row in grouped.to_dict(orient="records"):
        revenue = float(row["revenue"])
        cost = float(row["cost"])
        records.append(
            {
                "category": str(row["category"]),
                "revenue": _round_value(revenue),
                "cost": _round_value(cost),
                "estimated_profit": _round_value(revenue - cost),
                "sales_quantity": _round_value(row["sales_quantity"]),
                "return_quantity": _round_value(row["return_quantity"]),
            }
        )
    return records


def build_business_summary(df: pd.DataFrame) -> dict[str, Any]:
    if df.empty:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="CSV dosyası boş veya analiz edilecek satır içermiyor.",
        )

    total_revenue = float(df["revenue"].sum())
    total_cost = float(df["cost"].sum())
    estimated_profit = total_revenue - total_cost
    total_sales_quantity = float(df["sales_quantity"].sum())
    total_return_quantity = float(df["return_quantity"].sum())

    profit_margin = (
        (estimated_profit / total_revenue) * 100 if total_revenue > 0 else 0.0
    )
    return_rate = (
        (total_return_quantity / total_sales_quantity) * 100
        if total_sales_quantity > 0
        else 0.0
    )

    return {
        "metrics": {
            "total_revenue": _round_value(total_revenue),
            "total_cost": _round_value(total_cost),
            "estimated_profit": _round_value(estimated_profit),
            "profit_margin": _round_value(profit_margin),
            "total_sales_quantity": _round_value(total_sales_quantity),
            "total_return_quantity": _round_value(total_return_quantity),
            "return_rate": _round_value(return_rate),
        },
        "top_revenue_products": _product_records(df, "revenue"),
        "top_returned_products": _product_records(df, "return_quantity"),
        "category_summary": _category_records(df),
        "row_count": int(len(df)),
    }


async def parse_uploaded_csv(file: UploadFile) -> pd.DataFrame:
    if not file.filename or not file.filename.lower().endswith(".csv"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Lütfen geçerli bir CSV dosyası yükleyin.",
        )

    raw_bytes = await file.read()
    if not raw_bytes:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="CSV dosyası boş.",
        )

    try:
        df = pd.read_csv(io.BytesIO(raw_bytes))
    except pd.errors.EmptyDataError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="CSV dosyası boş veya okunamıyor.",
        ) from exc
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="CSV dosyası okunamadı. Lütfen geçerli bir CSV formatı kullanın.",
        ) from exc

    df = _normalize_columns(df)
    _validate_required_columns(df)
    return _validate_numeric_columns(df)


async def analyze_uploaded_csv(file: UploadFile) -> dict[str, Any]:
    df = await parse_uploaded_csv(file)
    return build_business_summary(df)
