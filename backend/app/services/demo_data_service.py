"""Synthetic KOBİ e-commerce demo dataset for GET /demo-data."""

from __future__ import annotations

import pandas as pd

from app.services.csv_service import build_business_summary

# (product_name, category, supplier, unit_price, unit_cost, return_rate_hint)
_PRODUCT_CATALOG: list[tuple[str, str, str, int, int, float]] = [
    # Giyim — yüksek iade, beden/renk sorunları
    ("Pamuk Oversize Tişört", "Giyim", "ModaTedarik", 450, 315, 0.20),
    ("Keten Yazlık Elbise", "Giyim", "ModaTedarik", 820, 574, 0.22),
    ("Yün Triko Kazak", "Giyim", "ModaTedarik", 780, 546, 0.18),
    ("Pamuklu Pijama Takımı", "Giyim", "ModaTedarik", 620, 434, 0.20),
    ("Polar Mont", "Giyim", "ModaTedarik", 1100, 770, 0.17),
    ("Slim Fit Gömlek", "Giyim", "ModaTedarik", 520, 364, 0.21),
    ("Eşofman Takımı", "Giyim", "ModaTedarik", 680, 476, 0.18),
    ("Denim Ceket", "Giyim", "ModaTedarik", 950, 665, 0.19),
    ("Basic Hoodie", "Giyim", "ModaTedarik", 590, 413, 0.22),
    ("Şort ve Atlet Seti", "Giyim", "ModaTedarik", 380, 266, 0.20),
    # Elektronik Aksesuar — yüksek ciro, orta marj, orta iade
    ("Bluetooth Kulaklık", "Elektronik Aksesuar", "TeknoKaynak", 920, 680, 0.13),
    ("Taşınabilir Şarj Cihazı", "Elektronik Aksesuar", "TeknoKaynak", 560, 414, 0.12),
    ("USB-C Hub Adaptör", "Elektronik Aksesuar", "TeknoKaynak", 430, 318, 0.11),
    ("Kablosuz Mouse", "Elektronik Aksesuar", "TeknoKaynak", 490, 363, 0.12),
    ("Akıllı Saat Kordonu", "Elektronik Aksesuar", "TeknoKaynak", 310, 229, 0.11),
    ("Tablet Standı", "Elektronik Aksesuar", "TeknoKaynak", 270, 200, 0.10),
    ("Kulaklık Kılıfı", "Elektronik Aksesuar", "TeknoKaynak", 130, 96, 0.12),
    ("Telefon Tutucu Araç", "Elektronik Aksesuar", "TeknoKaynak", 240, 178, 0.11),
    # Ev Yaşam — stabil marj, düşük iade
    ("Seramik Kahve Kupası Seti", "Ev Yaşam", "EvKonfor", 360, 216, 0.04),
    ("Aromaterapi Mum Seti", "Ev Yaşam", "EvKonfor", 310, 186, 0.05),
    ("Paslanmaz Termos", "Ev Yaşam", "EvKonfor", 520, 312, 0.04),
    ("Bambu Kesme Tahtası", "Ev Yaşam", "EvKonfor", 290, 174, 0.03),
    ("Silikon Mutfak Gereç Seti", "Ev Yaşam", "EvKonfor", 330, 198, 0.05),
    ("Çay Demleme Seti", "Ev Yaşam", "EvKonfor", 420, 252, 0.04),
    ("Pamuklu Nevresim Takımı", "Ev Yaşam", "EvKonfor", 780, 468, 0.03),
    ("Cam Saklama Kapları", "Ev Yaşam", "EvKonfor", 410, 246, 0.04),
    # Kişisel Bakım — iyi marj, düşük iade
    ("Nemlendirici Yüz Kremi", "Kişisel Bakım", "GüzellikPro", 430, 258, 0.03),
    ("Doğal Şampuan Seti", "Kişisel Bakım", "GüzellikPro", 390, 234, 0.04),
    ("Ruj ve Allık Paleti", "Kişisel Bakım", "GüzellikPro", 540, 324, 0.03),
    ("Vitamin C Serum", "Kişisel Bakım", "GüzellikPro", 660, 396, 0.02),
    ("Günlük Cilt Bakım Seti", "Kişisel Bakım", "GüzellikPro", 740, 444, 0.03),
    ("El ve Vücut Losyonu", "Kişisel Bakım", "GüzellikPro", 320, 192, 0.04),
    ("Diş Beyazlatma Seti", "Kişisel Bakım", "GüzellikPro", 480, 288, 0.03),
    ("Saç Bakım Yağı", "Kişisel Bakım", "GüzellikPro", 360, 216, 0.03),
    # Gıda — düşük marj, operasyonel baskı
    ("Granola Karışımı 500g", "Gıda", "LezzetDepo", 290, 232, 0.10),
    ("Muesli ve Yulaf Paketi", "Gıda", "LezzetDepo", 320, 256, 0.11),
    ("Protein Bar Kutusu", "Gıda", "LezzetDepo", 260, 208, 0.07),
    ("Filtre Kahve 1kg", "Gıda", "LezzetDepo", 480, 384, 0.06),
    ("Organik Zeytinyağı 750ml", "Gıda", "LezzetDepo", 620, 496, 0.05),
    ("Glutensiz Kraker Paketi", "Gıda", "LezzetDepo", 210, 168, 0.12),
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

_RETURN_REASONS_BY_CATEGORY: dict[str, list[str]] = {
    "Giyim": ["Beden uyumsuz", "Renk farkı", "Kalite beklentisi", "Müşteri vazgeçti"],
    "Elektronik Aksesuar": [
        "Bağlantı sorunu",
        "Kırık parça",
        "Yanlış model",
        "Hasarlı ürün",
    ],
    "Ev Yaşam": ["Hasarlı ürün", "Geç teslimat", "Eksik parça"],
    "Kişisel Bakım": ["Koku beklentisi", "Alerjik reaksiyon", "Müşteri vazgeçti"],
    "Gıda": ["Geç teslimat", "Hasarlı ürün", "Son kullanma yakın", "Sızdırma"],
}

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

_SALES_QUANTITIES = [
    44, 36, 32, 41, 28, 39, 34, 37, 42, 30,
    38, 33, 29, 31, 26, 24, 35, 27,
    40, 32, 36, 28, 34, 30, 42, 38,
    36, 33, 31, 29, 37, 35, 34, 32,
    45, 40, 38, 42, 36, 48,
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


def _return_reason(category: str, index: int) -> str:
    reasons = _RETURN_REASONS_BY_CATEGORY.get(category, ["Müşteri vazgeçti"])
    return reasons[index % len(reasons)]


def _build_demo_rows() -> list[dict[str, object]]:
    rows: list[dict[str, object]] = []
    for index, product in enumerate(_PRODUCT_CATALOG):
        name, category, supplier, unit_price, unit_cost, return_rate = product
        sales_quantity = _SALES_QUANTITIES[index]
        revenue = sales_quantity * unit_price
        cost = sales_quantity * unit_cost
        profit = revenue - cost
        returns = _return_quantity(sales_quantity, return_rate, index)
        reason = _return_reason(category, index) if returns > 0 else ""

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
