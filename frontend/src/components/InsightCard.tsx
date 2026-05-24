import type { AnalysisResponse } from '@/api/types/analysis'
import {
  getChartSuggestionLabel,
  getRiskBadgeClass,
  getRiskLabel,
} from '@/lib/labels'

type InsightCardProps = {
  analysis: AnalysisResponse | null
  isLoading: boolean
}

export function InsightCard({ analysis, isLoading }: InsightCardProps) {
  return (
    <section className="rounded-[var(--radius-dw)] border border-dw-border bg-dw-card p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-dw-text">
        Yapay Zeka Yanıtı
      </h2>

      {isLoading && (
        <div className="flex items-center gap-3 text-sm text-dw-muted">
          <div
            className="h-5 w-5 animate-spin rounded-full border-2 border-dw-border border-t-dw-primary"
            aria-hidden
          />
          Yanıt hazırlanıyor...
        </div>
      )}

      {!isLoading && !analysis && (
        <p className="text-sm text-dw-muted">
          Veri yükleyip bir soru sorduğunuzda özet, içgörü ve öneriler burada
          görünecek.
        </p>
      )}

      {!isLoading && analysis && (
        <div className="space-y-4 text-sm">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-[var(--radius-dw)] border px-2.5 py-1 text-xs font-medium ${getRiskBadgeClass(analysis.risk_level)}`}
            >
              Risk: {getRiskLabel(analysis.risk_level)}
            </span>
            <span className="rounded-[var(--radius-dw)] border border-dw-border bg-dw-bg px-2.5 py-1 text-xs text-dw-muted">
              Önerilen grafik:{' '}
              {getChartSuggestionLabel(analysis.chart_suggestion)}
            </span>
          </div>

          <div>
            <h3 className="mb-1 font-medium text-dw-text">Özet</h3>
            <p className="leading-relaxed text-dw-muted">{analysis.summary}</p>
          </div>

          <div>
            <h3 className="mb-1 font-medium text-dw-text">İçgörü</h3>
            <p className="leading-relaxed text-dw-muted">{analysis.insight}</p>
          </div>

          <div>
            <h3 className="mb-1 font-medium text-dw-text">Öneri</h3>
            <p className="leading-relaxed text-dw-muted">
              {analysis.recommendation}
            </p>
          </div>
        </div>
      )}
    </section>
  )
}
