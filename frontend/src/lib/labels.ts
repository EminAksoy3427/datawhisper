import type { ChartSuggestion, RiskLevel } from '@/api/types/analysis'

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

export function getRiskLabel(level: RiskLevel): string {
  return RISK_LABELS[level]
}

export function getChartSuggestionLabel(suggestion: ChartSuggestion): string {
  return CHART_LABELS[suggestion]
}

export function getRiskBadgeClass(level: RiskLevel): string {
  return RISK_STYLES[level]
}
