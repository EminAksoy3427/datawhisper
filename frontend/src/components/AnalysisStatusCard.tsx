import type { BusinessSummary } from '@/api/types/data'
import { formatCurrency, formatNumber, formatPercent } from '@/lib/format'

type AnalysisStatusCardProps = {
  summary: BusinessSummary
}

function buildStatusSentence(summary: BusinessSummary): string {
  const { metrics, row_count } = summary
  const rowLabel = `${formatNumber(row_count)} satır`

  const hasAnyMetric =
    metrics.total_revenue !== null ||
    metrics.return_rate !== null ||
    metrics.profit_margin !== null

  if (!hasAnyMetric) {
    return `${rowLabel} işlendi. İş metrikleri için gelir, maliyet veya iade sütunlarına ihtiyacımız var.`
  }

  const parts: string[] = []
  if (metrics.profit_margin !== null) {
    parts.push(`kar marjı ${formatPercent(metrics.profit_margin)}`)
  }
  if (metrics.return_rate !== null) {
    parts.push(`iade oranı ${formatPercent(metrics.return_rate)}`)
  }

  if (parts.length === 0) {
    return `${rowLabel} başarıyla işlendi.`
  }
  return `${rowLabel} başarıyla işlendi. Şu anda ${parts.join(' ve ')}.`
}

type StatPillProps = {
  label: string
  value: string
}

function StatPill({ label, value }: StatPillProps) {
  return (
    <div className="rounded-[var(--radius-dw)] border border-dw-border bg-dw-bg px-3 py-2">
      <p className="text-[11px] font-medium uppercase tracking-wide text-dw-muted">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-dw-text">{value}</p>
    </div>
  )
}

export function AnalysisStatusCard({ summary }: AnalysisStatusCardProps) {
  const { metrics, row_count } = summary

  return (
    <section className="rounded-[var(--radius-dw)] border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
      <header className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span
            aria-hidden
            className="flex h-7 w-7 items-center justify-center rounded-full bg-dw-secondary text-sm font-semibold text-white"
          >
            ✓
          </span>
          <h2 className="text-base font-semibold text-dw-text">Analiz hazır</h2>
        </div>
        <span className="rounded-full border border-emerald-200 bg-white px-2.5 py-0.5 text-xs font-medium text-dw-secondary">
          Canlı veri
        </span>
      </header>

      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <StatPill label="Satır sayısı" value={formatNumber(row_count)} />
        <StatPill
          label="Toplam gelir"
          value={formatCurrency(metrics.total_revenue)}
        />
        <StatPill
          label="İade oranı"
          value={formatPercent(metrics.return_rate)}
        />
        <StatPill
          label="Kar marjı"
          value={formatPercent(metrics.profit_margin)}
        />
      </div>

      <p className="mt-4 text-sm leading-relaxed text-dw-text">
        {buildStatusSentence(summary)}
      </p>
    </section>
  )
}
