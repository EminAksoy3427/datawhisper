from pydantic import BaseModel, Field


class BusinessMetrics(BaseModel):
    total_revenue: float
    total_cost: float
    estimated_profit: float
    profit_margin: float
    total_sales_quantity: float
    total_return_quantity: float
    return_rate: float


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
    top_revenue_products: list[ProductMetric]
    top_returned_products: list[ProductMetric]
    category_summary: list[CategoryMetric]
    row_count: int = Field(description="Number of data rows analyzed")
