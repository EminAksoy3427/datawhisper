import type { BusinessSummary } from '@/api/types/data'

function hasDetectedField(
  summary: BusinessSummary,
  canonical: string,
): boolean {
  return Boolean(summary.detected_columns?.[canonical])
}

export function getRevenueChartEmptyMessage(summary: BusinessSummary | null): string {
  if (!summary) {
    return 'Grafik için önce veri yükleyin.'
  }
  if (summary.top_revenue_products.length > 0) {
    return 'Henüz gösterilecek veri yok.'
  }
  if (!hasDetectedField(summary, 'product_name') && !hasDetectedField(summary, 'category')) {
    return 'Ürün veya kategori alanı algılanamadığı için gelir grafiği oluşturulamadı.'
  }
  if (summary.metrics.total_revenue === null) {
    return 'Gelir verisi olmadığı için gelir grafiği oluşturulamadı.'
  }
  return 'Bu dosyada ürün bazlı gelir grafiği oluşturulamadı.'
}

export function getReturnChartEmptyMessage(summary: BusinessSummary | null): string {
  if (!summary) {
    return 'Grafik için önce veri yükleyin.'
  }
  if (summary.top_returned_products.length > 0) {
    return 'Henüz gösterilecek veri yok.'
  }
  if (!hasDetectedField(summary, 'return_quantity')) {
    return 'Bu dosyada iade verisi bulunmadığı için iade grafiği oluşturulamadı.'
  }
  if (!hasDetectedField(summary, 'product_name') && !hasDetectedField(summary, 'category')) {
    return 'Ürün veya kategori alanı algılanamadığı için iade grafiği oluşturulamadı.'
  }
  return 'Bu dosyada iade grafiği oluşturulamadı.'
}
