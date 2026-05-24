export type BusinessMetrics = {
  total_revenue: number
  total_cost: number
  estimated_profit: number
  profit_margin: number
  total_sales_quantity: number
  total_return_quantity: number
  return_rate: number
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
}
