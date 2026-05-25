import type {
  ChartSuggestion,
  Priority,
  RiskLevel,
} from '@/api/types/analysis'

const RISK_LABELS: Record<RiskLevel, string> = {
  low: 'Düşük',
  medium: 'Orta',
  high: 'Yüksek',
}

const CHART_LABELS: Record<ChartSuggestion, string> = {
  bar: 'Sütun grafik',
  line: 'Çizgi grafik',
  pie: 'Pasta grafik',
  table: 'Tablo',
}

const RISK_STYLES: Record<RiskLevel, string> = {
  low: 'bg-emerald-50 text-dw-secondary border-emerald-200',
  medium: 'bg-amber-50 text-dw-warning border-amber-200',
  high: 'bg-red-50 text-dw-danger border-red-200',
}

const PRIORITY_STYLES: Record<Priority, string> = {
  'Bugün kontrol edilmeli': 'bg-red-50 text-dw-danger border-red-200',
  'Bu hafta kontrol edilmeli': 'bg-amber-50 text-dw-warning border-amber-200',
  'Takipte kalmalı': 'bg-blue-50 text-dw-primary border-blue-200',
}

export function getRiskLabel(level: RiskLevel): string {
  return RISK_LABELS[level]
}

export function getChartSuggestionLabel(suggestion: ChartSuggestion): string {
  return CHART_LABELS[suggestion]
}

export function getRiskBadgeClass(level: RiskLevel): string {
  return RISK_STYLES[level]
}

export function getPriorityBadgeClass(priority: Priority): string {
  return PRIORITY_STYLES[priority] ?? PRIORITY_STYLES['Takipte kalmalı']
}

const COLUMN_LABELS: Record<string, string> = {
  product_name: 'Ürün adı',
  category: 'Kategori',
  supplier: 'Tedarikçi',
  date: 'Tarih',
  sales_quantity: 'Satış adedi',
  revenue: 'Gelir',
  cost: 'Maliyet',
  return_quantity: 'İade adedi',
  return_reason: 'İade nedeni',
}

export function getColumnLabel(canonical: string): string {
  return COLUMN_LABELS[canonical] ?? canonical
}
