"""Synthetic KOBİ e-commerce demo dataset for GET /demo-data."""

from __future__ import annotations

import pandas as pd

from app.services.csv_service import build_business_summary

# (product_name, category, supplier, unit_price, unit_cost, return_rate_hint)
_PRODUCT_CATALOG: list[tuple[str, str, str, int, int, float]] = [
    ("Pamuk Oversize Tişört", "Giyim", "ModaTedarik", 450, 270, 0.11),
    ("Keten Yazlık Elbise", "Giyim", "ModaTedarik", 800, 520, 0.14),
    ("Yün Triko Kazak", "Giyim", "ModaTedarik", 800, 520, 0.10),
    ("Spor Tayt", "Spor", "AktifLine", 500, 300, 0.08),
    ("Koşu Ayakkabısı", "Spor", "AktifLine", 1200, 720, 0.07),
    ("Yoga Matı", "Spor", "AktifLine", 350, 175, 0.04),
    ("Bluetooth Kulaklık", "Elektronik", "TeknoKaynak", 900, 630, 0.13),
    ("Akıllı Saat Kordonu", "Elektronik", "TeknoKaynak", 300, 150, 0.05),
    ("Taşınabilir Şarj Cihazı", "Elektronik", "TeknoKaynak", 550, 385, 0.09),
    ("USB-C Hub Adaptör", "Elektronik", "TeknoKaynak", 420, 252, 0.06),
    ("Deri Çapraz Çanta", "Aksesuar", "AksesuarPlus", 1500, 900, 0.06),
    ("Minimalist Sırt Çantası", "Aksesuar", "AksesuarPlus", 680, 408, 0.05),
    ("Seramik Kahve Kupası Seti", "Ev Yaşam", "EvKonfor", 350, 210, 0.07),
    ("Aromaterapi Mum Seti", "Ev Yaşam", "EvKonfor", 300, 165, 0.08),
    ("Paslanmaz Termos", "Ev Yaşam", "EvKonfor", 500, 300, 0.05),
    ("Bambu Kesme Tahtası", "Ev Yaşam", "EvKonfor", 280, 154, 0.04),
    ("Organik Bebek Body", "Bebek", "MiniDunya", 300, 180, 0.09),
    ("Çocuk Oyuncak Seti", "Bebek", "MiniDunya", 400, 240, 0.10),
    ("Bebek Battaniyesi", "Bebek", "MiniDunya", 450, 270, 0.06),
    ("Nemlendirici Yüz Kremi", "Kozmetik", "GüzellikPro", 420, 210, 0.03),
    ("Doğal Şampuan Seti", "Kozmetik", "GüzellikPro", 380, 190, 0.04),
    ("Ruj ve Allık Paleti", "Kozmetik", "GüzellikPro", 520, 260, 0.05),
    ("Defter ve Kalem Seti", "Kırtasiye", "OfisDünyası", 180, 90, 0.02),
    ("Planlayıcı Ajanda", "Kırtasiye", "OfisDünyası", 220, 110, 0.03),
    ("Masa Lambası", "Kırtasiye", "OfisDünyası", 390, 234, 0.04),
    ("Kablosuz Mouse", "Elektronik", "TeknoKaynak", 480, 336, 0.08),
    ("Pamuklu Pijama Takımı", "Giyim", "ModaTedarik", 620, 372, 0.12),
    ("Polar Mont", "Giyim", "ModaTedarik", 1100, 715, 0.09),
    ("Dumbbell Seti 5kg", "Spor", "AktifLine", 750, 450, 0.05),
    ("Silikon Mutfak Gereç Seti", "Ev Yaşam", "EvKonfor", 320, 192, 0.06),
    ("Bebek Bezi Paketi", "Bebek", "MiniDunya", 550, 385, 0.07),
    ("El Çantası", "Aksesuar", "AksesuarPlus", 890, 534, 0.05),
    ("Vitamin C Serum", "Kozmetik", "GüzellikPro", 650, 325, 0.04),
    ("Sticker ve Etiket Paketi", "Kırtasiye", "OfisDünyası", 95, 48, 0.02),
    ("Kulaklık Kılıfı", "Aksesuar", "AksesuarPlus", 120, 72, 0.03),
    ("Çay Demleme Seti", "Ev Yaşam", "EvKonfor", 410, 246, 0.05),
    ("Eşofman Takımı", "Spor", "AktifLine", 680, 408, 0.07),
    ("Tablet Standı", "Elektronik", "TeknoKaynak", 260, 156, 0.04),
    ("Bebek Tulum", "Bebek", "MiniDunya", 380, 228, 0.08),
    ("Günlük Cilt Bakım Seti", "Kozmetik", "GüzellikPro", 720, 360, 0.03),
]

_SALES_CHANNELS = [
    "Online Pazaryeri",
    "Web Sitesi",
    "Mağaza",
    "Sosyal Medya",
]

_REGIONS = [
    "Marmara",
    "Ege",
    "İç Anadolu",
    "Akdeniz",
    "Karadeniz",
    "Güneydoğu Anadolu",
]

_ORDER_PRIORITIES = ["Düşük", "Orta", "Yüksek"]

_RETURN_REASONS = [
    "Beden uyumsuz",
    "Renk farkı",
    "Hasarlı ürün",
    "Kırık parça",
    "Bağlantı sorunu",
    "Yanlış model",
    "Kalite beklentisi",
    "Eksik parça",
    "Koku beklentisi",
    "Sızdırma",
    "Geç teslimat",
    "Müşteri vazgeçti",
]

_DATES = [
    "2026-01-05",
    "2026-01-08",
    "2026-01-11",
    "2026-01-14",
    "2026-01-17",
    "2026-01-20",
    "2026-01-23",
    "2026-01-26",
    "2026-01-29",
    "2026-02-01",
    "2026-02-04",
    "2026-02-07",
    "2026-02-10",
    "2026-02-13",
    "2026-02-16",
    "2026-02-19",
    "2026-02-22",
    "2026-02-25",
    "2026-02-28",
    "2026-03-03",
    "2026-03-06",
    "2026-03-09",
    "2026-03-12",
    "2026-03-15",
    "2026-03-18",
    "2026-03-21",
    "2026-03-24",
    "2026-03-27",
    "2026-03-30",
    "2026-04-02",
    "2026-04-05",
    "2026-04-08",
    "2026-04-11",
    "2026-04-14",
    "2026-04-17",
    "2026-04-20",
    "2026-04-23",
    "2026-04-26",
    "2026-04-29",
    "2026-05-02",
]

# Quantities vary by row to keep totals realistic.
_SALES_QUANTITIES = [
    42, 28, 24, 33, 19, 31, 26, 37, 22, 35,
    48, 29, 41, 18, 27, 36, 44, 21, 39, 32,
    25, 46, 30, 38, 20, 43, 34, 23, 40, 17,
    45, 16, 47, 14, 49, 13, 50, 15, 12, 11,
]


def _return_quantity(sales_quantity: int, return_rate: float, index: int) -> int:
    raw = round(sales_quantity * return_rate)
    if raw == 0 and return_rate >= 0.08 and sales_quantity >= 20 and index % 3 == 0:
        return 1
    return max(0, min(raw, sales_quantity // 2))


def _order_priority(revenue: int, index: int) -> str:
    if revenue >= 35000:
        return "Yüksek"
    if revenue >= 15000:
        return "Orta"
    return "Düşük"


def _build_demo_rows() -> list[dict[str, object]]:
    rows: list[dict[str, object]] = []
    for index, product in enumerate(_PRODUCT_CATALOG):
        name, category, supplier, unit_price, unit_cost, return_rate = product
        sales_quantity = _SALES_QUANTITIES[index]
        revenue = sales_quantity * unit_price
        cost = sales_quantity * unit_cost
        profit = revenue - cost
        returns = _return_quantity(sales_quantity, return_rate, index)
        reason = (
            _RETURN_REASONS[index % len(_RETURN_REASONS)] if returns > 0 else ""
        )

        rows.append(
            {
                "date": _DATES[index],
                "product_name": name,
                "category": category,
                "supplier": supplier,
                "sales_channel": _SALES_CHANNELS[index % len(_SALES_CHANNELS)],
                "region": _REGIONS[index % len(_REGIONS)],
                "country": "Türkiye",
                "order_priority": _order_priority(revenue, index),
                "sales_quantity": sales_quantity,
                "unit_price": unit_price,
                "unit_cost": unit_cost,
                "revenue": revenue,
                "cost": cost,
                "profit": profit,
                "return_quantity": returns,
                "return_reason": reason,
            }
        )
    return rows


DEMO_ROWS = _build_demo_rows()
DEMO_ROW_COUNT = len(DEMO_ROWS)


def get_demo_business_summary() -> dict:
    df = pd.DataFrame(DEMO_ROWS)
    return build_business_summary(df)
