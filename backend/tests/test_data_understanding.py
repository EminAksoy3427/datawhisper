"""Tests for flexible column detection and business summary calculations."""

import pandas as pd
import pytest

from app.services.column_detection import (
    CONFIDENCE_ACCEPT,
    detect_columns,
    normalize_header,
)
from app.services.csv_service import build_business_summary
from app.services.demo_data_service import get_demo_business_summary


def test_normalize_header_turkish_and_separators():
    assert normalize_header("Ürün Adı") == "urun adi"
    assert normalize_header("  Satış-Adedi  ") == "satis adedi"
    assert normalize_header("order_date") == "order date"
    assert normalize_header("Total.Revenue") == "total revenue"


def test_turkish_column_detection():
    df = pd.DataFrame(
        {
            "Ürün Adı": ["A"],
            "Kategori": ["Giyim"],
            "Satış Adedi": [10],
            "Ciro": [1000],
            "Maliyet": [600],
            "İade Adedi": [1],
        }
    )
    summary = build_business_summary(df)
    assert summary["metrics"]["total_revenue"] == 1000.0
    assert summary["metrics"]["total_cost"] == 600.0
    assert summary["metrics"]["estimated_profit"] == 400.0
    assert summary["metrics"]["total_sales_quantity"] == 10.0
    assert summary["metrics"]["return_rate"] == 10.0
    assert summary["detected_columns"]["product_name"] == "Ürün Adı"
    assert summary["detected_column_confidence"]["revenue"] >= CONFIDENCE_ACCEPT


def test_english_sales_columns():
    df = pd.DataFrame(
        {
            "Region": ["EMEA"],
            "Country": ["TR"],
            "Item Type": ["Apparel"],
            "Sales Channel": ["Web"],
            "Order Priority": ["High"],
            "Order Date": ["2026-01-01"],
            "Order ID": ["ORD-1"],
            "Ship Date": ["2026-01-02"],
            "Units Sold": [5],
            "Unit Price": [100],
            "Unit Cost": [40],
            "Total Revenue": [500],
            "Total Cost": [200],
            "Total Profit": [300],
        }
    )
    summary = build_business_summary(df)
    assert summary["metrics"]["total_revenue"] == 500.0
    assert summary["metrics"]["total_cost"] == 200.0
    assert summary["metrics"]["estimated_profit"] == 300.0
    assert summary["metrics"]["profit_margin"] == 60.0
    assert summary["detected_dimensions"]["region"] == "Region"
    assert summary["detected_dimensions"]["country"] == "Country"
    assert summary["detected_dimensions"]["sales_channel"] == "Sales Channel"


def test_medium_confidence_not_used_for_metrics():
    detection = detect_columns(["revn"])
    assert "revenue" not in detection.reliable
    assert any(m["canonical"] == "revenue" for m in detection.possible_matches)

    df = pd.DataFrame({"revn": [100], "Units Sold": [2], "Unit Price": [50]})
    summary = build_business_summary(df)
    assert summary["metrics"]["total_revenue"] == 100.0


def test_demo_data_still_works():
    from app.services.demo_data_service import DEMO_ROW_COUNT

    summary = get_demo_business_summary()
    assert summary["row_count"] == DEMO_ROW_COUNT
    assert summary["metrics"]["total_revenue"] is not None
    assert summary["metrics"]["total_revenue"] > 0
    assert summary["metrics"]["total_cost"] is not None
    assert summary["metrics"]["estimated_profit"] is not None
    assert summary["metrics"]["return_rate"] is not None
    assert len(summary["top_revenue_products"]) > 0
    assert len(summary["top_returned_products"]) > 0
    assert len(summary["category_summary"]) >= 5


def test_demo_data_detection_metadata():
    from app.services.demo_data_service import DEMO_ROW_COUNT

    summary = get_demo_business_summary()
    assert summary["row_count"] == DEMO_ROW_COUNT
    assert "revenue" in summary["detected_columns"]
    assert "return_quantity" in summary["detected_columns"]
    assert "return_reason" in summary["detected_columns"]
    assert "profit" in summary["detected_columns"]
    assert summary["detected_dimensions"]["sales_channel"] == "sales_channel"
    assert summary["detected_dimensions"]["region"] == "region"
    assert summary["detected_dimensions"]["country"] == "country"
    assert summary["detected_dimensions"]["order_priority"] == "order_priority"
    assert summary["detected_column_confidence"]["revenue"] >= CONFIDENCE_ACCEPT
    assert summary["missing_capabilities"] == []


def test_unit_price_derived_revenue():
    df = pd.DataFrame(
        {
            "Product Name": ["Widget"],
            "Units Sold": [4],
            "Unit Price": [25],
            "Unit Cost": [10],
        }
    )
    summary = build_business_summary(df)
    assert summary["metrics"]["total_revenue"] == 100.0
    assert summary["metrics"]["total_cost"] == 40.0
    assert summary["metrics"]["estimated_profit"] == 60.0
