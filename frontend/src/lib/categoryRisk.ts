import type { CategoryMetric } from '@/api/types/data'

export type CategoryRiskLevel = 'low' | 'medium' | 'high' | 'unknown'

export type CategoryRisk = {
  level: CategoryRiskLevel
  label: string
  rate: number | null
}

const LEVEL_LABELS: Record<CategoryRiskLevel, string> = {
  low: 'Düşük',
  medium: 'Orta',
  high: 'Yüksek',
  unknown: 'Veri yok',
}

const LEVEL_BADGE_CLASSES: Record<CategoryRiskLevel, string> = {
  low: 'bg-emerald-50 text-dw-secondary border-emerald-200',
  medium: 'bg-amber-50 text-dw-warning border-amber-200',
  high: 'bg-red-50 text-dw-danger border-red-200',
  unknown: 'bg-slate-50 text-dw-muted border-dw-border',
}

export function getCategoryRisk(category: CategoryMetric): CategoryRisk {
  const sales = category.sales_quantity
  const returns = category.return_quantity

  if (
    typeof sales !== 'number' ||
    typeof returns !== 'number' ||
    sales <= 0
  ) {
    return { level: 'unknown', label: LEVEL_LABELS.unknown, rate: null }
  }

  const rate = (returns / sales) * 100

  let level: CategoryRiskLevel
  if (rate < 5) {
    level = 'low'
  } else if (rate < 12) {
    level = 'medium'
  } else {
    level = 'high'
  }

  return { level, label: LEVEL_LABELS[level], rate }
}

export function getCategoryRiskBadgeClass(level: CategoryRiskLevel): string {
  return LEVEL_BADGE_CLASSES[level]
}
