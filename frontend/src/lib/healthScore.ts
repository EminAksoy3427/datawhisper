import type { BusinessSummary } from '@/api/types/data'

export type HealthTier = 'strong' | 'stable' | 'attention' | 'risky'

export type HealthScoreResult = {
  score: number
  label: string
  tier: HealthTier
  explanation: string
}

export function calculateHealthScore(summary: BusinessSummary): number {
  const { metrics, row_count } = summary
  let score = 100

  if (metrics.return_rate > 15) {
    score -= 25
  }
  if (metrics.return_rate > 10) {
    score -= 15
  }
  if (metrics.profit_margin < 20) {
    score -= 25
  }
  if (metrics.profit_margin < 35) {
    score -= 10
  }
  if (metrics.estimated_profit <= 0) {
    score -= 30
  }
  if (row_count < 5) {
    score -= 10
  }

  return Math.max(0, Math.min(100, score))
}

function getHealthTier(score: number): HealthTier {
  if (score >= 80) {
    return 'strong'
  }
  if (score >= 60) {
    return 'stable'
  }
  if (score >= 40) {
    return 'attention'
  }
  return 'risky'
}

function getHealthLabel(tier: HealthTier): string {
  const labels: Record<HealthTier, string> = {
    strong: 'Güçlü',
    stable: 'Stabil',
    attention: 'Dikkat Gerekli',
    risky: 'Riskli',
  }
  return labels[tier]
}

function buildExplanation(summary: BusinessSummary, tier: HealthTier): string {
  const { metrics, row_count } = summary
  const issues: string[] = []

  if (metrics.estimated_profit <= 0) {
    issues.push('kar negatif veya sıfır')
  }
  if (metrics.return_rate > 15) {
    issues.push('iade oranı çok yüksek')
  } else if (metrics.return_rate > 10) {
    issues.push('iade oranı yükselmiş')
  }
  if (metrics.profit_margin < 20) {
    issues.push('kar marjı düşük')
  } else if (metrics.profit_margin < 35) {
    issues.push('kar marjı orta seviyede')
  }
  if (row_count < 5) {
    issues.push('az sayıda veri satırı')
  }

  if (tier === 'strong') {
    return 'Gelir, kar ve iade göstergeleri genel olarak sağlıklı görünüyor.'
  }
  if (tier === 'stable') {
    return issues.length > 0
      ? `İşletme dengeli; dikkat edilmesi gereken alanlar: ${issues.join(', ')}.`
      : 'İşletme genel olarak dengeli; birkaç alanda iyileştirme yapılabilir.'
  }
  if (tier === 'attention') {
    return issues.length > 0
      ? `Bazı riskler var: ${issues.join(', ')}. Önlem almanız faydalı olur.`
      : 'Bazı metrikler orta seviyede; maliyet ve iadeleri takip edin.'
  }
  return issues.length > 0
    ? `Ciddi risk sinyalleri: ${issues.join(', ')}. Acil aksiyon önerilir.`
    : 'Genel iş sağlığı zayıf; gelir ve maliyetleri gözden geçirin.'
}

export function getHealthScoreResult(
  summary: BusinessSummary,
): HealthScoreResult {
  const score = calculateHealthScore(summary)
  const tier = getHealthTier(score)

  return {
    score,
    label: getHealthLabel(tier),
    tier,
    explanation: buildExplanation(summary, tier),
  }
}
