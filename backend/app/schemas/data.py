from pydantic import BaseModel, Field


class BusinessMetrics(BaseModel):
    total_revenue: float | None = None
    total_cost: float | None = None
    estimated_profit: float | None = None
    profit_margin: float | None = None
    total_sales_quantity: float | None = None
    total_return_quantity: float | None = None
    return_rate: float | None = None


class ProductMetric(BaseModel):
    product_name: str
    revenue: float
    cost: float
    sales_quantity: float
    return_quantity: float


class CategoryMetric(BaseModel):
    category: str
    revenue: float
    cost: float
    estimated_profit: float
    sales_quantity: float
    return_quantity: float


class PossibleColumnMatch(BaseModel):
    canonical: str
    column: str
    confidence: int


class BusinessSummaryResponse(BaseModel):
    metrics: BusinessMetrics
    top_revenue_products: list[ProductMetric] = Field(default_factory=list)
    top_returned_products: list[ProductMetric] = Field(default_factory=list)
    category_summary: list[CategoryMetric] = Field(default_factory=list)
    row_count: int = Field(description="Number of data rows analyzed")
    detected_columns: dict[str, str] = Field(
        default_factory=dict,
        description="Mapping of canonical column key -> original column name (confidence >= 85).",
    )
    detected_column_confidence: dict[str, int] = Field(
        default_factory=dict,
        description="Confidence score 0-100 for each accepted column mapping.",
    )
    detected_dimensions: dict[str, str] = Field(
        default_factory=dict,
        description="Optional dimension columns (region, country, channel, etc.).",
    )
    possible_matches: list[PossibleColumnMatch] = Field(
        default_factory=list,
        description="Column matches with confidence 70-84, not used in calculations.",
    )
    missing_capabilities: list[str] = Field(
        default_factory=list,
        description="Short Turkish explanations of analyses that could not be performed.",
    )
