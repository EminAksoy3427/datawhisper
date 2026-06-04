import type { BusinessSummary } from '@/api/types/data'
import { getHealthScoreResult } from '@/lib/healthScore'
import type { HealthTier } from '@/lib/healthScore'

type HealthScoreCardProps = {
  summary: BusinessSummary
}

const tierStyles: Record<
  HealthTier,
  { border: string; bg: string; score: string; badge: string }
> = {
  strong: {
    border: 'border-emerald-200',
    bg: 'bg-emerald-50',
    score: 'text-dw-secondary',
    badge: 'bg-emerald-100 text-emerald-800',
  },
  stable: {
    border: 'border-blue-200',
    bg: 'bg-blue-50',
    score: 'text-dw-primary',
    badge: 'bg-blue-100 text-blue-800',
  },
  attention: {
    border: 'border-amber-200',
    bg: 'bg-amber-50',
    score: 'text-dw-warning',
    badge: 'bg-amber-100 text-amber-800',
  },
  risky: {
    border: 'border-red-200',
    bg: 'bg-red-50',
    score: 'text-dw-danger',
    badge: 'bg-red-100 text-red-800',
  },
  unknown: {
    border: 'border-dw-border',
    bg: 'bg-dw-bg',
    score: 'text-dw-muted',
    badge: 'bg-slate-100 text-slate-700',
  },
}

export function HealthScoreCard({ summary }: HealthScoreCardProps) {
  const health = getHealthScoreResult(summary)
  const styles = tierStyles[health.tier]
  const isUnknown = health.score === null

  return (
    <section
      className={`min-w-0 rounded-[var(--radius-dw)] border p-4 shadow-sm sm:p-6 ${styles.border} ${styles.bg}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-dw-text">
            İşletme Sağlık Skoru
          </h2>
          <p className="mt-1 text-sm text-dw-muted">
            Gelir, kar, iade oranı ve veri miktarına göre 0–100 arası hesaplanır
            (yalnızca ön bilgi amaçlıdır).
          </p>
        </div>
        <span
          className={`rounded-[var(--radius-dw)] px-3 py-1 text-sm font-medium ${styles.badge}`}
        >
          {health.label}
        </span>
      </div>

      {!isUnknown && (
        <p className={`mt-6 text-5xl font-bold tracking-tight ${styles.score}`}>
          {health.score}
          <span className="ml-1 text-2xl font-semibold text-dw-muted">
            / 100
          </span>
        </p>
      )}

      <p className="mt-4 max-w-2xl break-words text-sm leading-relaxed text-dw-text">
        {health.explanation}
      </p>
    </section>
  )
}
