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


class BusinessSummaryResponse(BaseModel):
    metrics: BusinessMetrics
    top_revenue_products: list[ProductMetric] = Field(default_factory=list)
    top_returned_products: list[ProductMetric] = Field(default_factory=list)
    category_summary: list[CategoryMetric] = Field(default_factory=list)
    row_count: int = Field(description="Number of data rows analyzed")
    detected_columns: dict[str, str] = Field(
        default_factory=dict,
        description="Mapping of canonical column key -> original column name in the uploaded file.",
    )
    missing_capabilities: list[str] = Field(
        default_factory=list,
        description="Short Turkish explanations of analyses that could not be performed.",
    )
