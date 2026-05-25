export type BusinessMetrics = {
  total_revenue: number | null
  total_cost: number | null
  estimated_profit: number | null
  profit_margin: number | null
  total_sales_quantity: number | null
  total_return_quantity: number | null
  return_rate: number | null
}

export type ProductMetric = {
  product_name: string
  revenue: number
  cost: number
  sales_quantity: number
  return_quantity: number
}

export type CategoryMetric = {
  category: string
  revenue: number
  cost: number
  estimated_profit: number
  sales_quantity: number
  return_quantity: number
}

export type BusinessSummary = {
  metrics: BusinessMetrics
  top_revenue_products: ProductMetric[]
  top_returned_products: ProductMetric[]
  category_summary: CategoryMetric[]
  row_count: number
  detected_columns?: Record<string, string>
  missing_capabilities?: string[]
}
