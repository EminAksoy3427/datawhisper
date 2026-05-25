import type { AnalysisResponse } from '@/api/types/analysis'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import {
  getPriorityBadgeClass,
  getRiskBadgeClass,
  getRiskLabel,
} from '@/lib/labels'

type InsightCardProps = {
  analysis: AnalysisResponse | null
  isLoading: boolean
  onFollowUpClick?: (question: string) => void
}

const SECTION_HEADING_CLASS =
  'text-[11px] font-semibold uppercase tracking-[0.08em] text-dw-muted'

export function InsightCard({
  analysis,
  isLoading,
  onFollowUpClick,
}: InsightCardProps) {
  return (
    <section className="rounded-[var(--radius-dw)] border border-dw-border bg-dw-card p-6 shadow-sm">
      <header className="mb-4 flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold text-dw-text">
            DataWhisper AI Analizi
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-dw-muted">
            İş analisti yaklaşımıyla hazırlanmış, verilerinize özel bir özet.
            Karar vermeden önce kendi iş bilginizle birlikte değerlendirin.
          </p>
        </div>
      </header>

      {isLoading && <LoadingSpinner message="Analiz hazırlanıyor..." />}

      {!isLoading && !analysis && (
        <p className="rounded-[var(--radius-dw)] border border-dashed border-dw-border bg-dw-bg px-4 py-6 text-center text-sm text-dw-muted">
          Veri yükleyip bir soru gönderdiğinizde DataWhisper'ın iş analisti
          tarzındaki yapay zeka raporu burada görünür.
        </p>
      )}

      {!isLoading && analysis && (
        <div className="space-y-6 text-sm">
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              label="Risk Seviyesi"
              value={getRiskLabel(analysis.risk_level)}
              className={getRiskBadgeClass(analysis.risk_level)}
            />
            <Badge
              label="Odak Alanı"
              value={analysis.focus_area}
              className="border-dw-border bg-dw-bg text-dw-text"
            />
            <Badge
              label="Öncelik"
              value={analysis.priority}
              className={getPriorityBadgeClass(analysis.priority)}
            />
          </div>

          <p className="text-base font-semibold leading-snug text-dw-text">
            {analysis.headline}
          </p>

          <section>
            <h3 className={SECTION_HEADING_CLASS}>1. Ana Bulgu</h3>
            <p className="mt-2 leading-relaxed text-dw-text">
              {analysis.main_finding}
            </p>
          </section>

          <section>
            <h3 className={SECTION_HEADING_CLASS}>2. Neden Önemli?</h3>
            <p className="mt-2 leading-relaxed text-dw-text">
              {analysis.why_it_matters}
            </p>
          </section>

          <section>
            <h3 className={SECTION_HEADING_CLASS}>3. Önerilen Aksiyonlar</h3>
            <ul className="mt-2 space-y-2">
              {analysis.recommended_actions.map((action, index) => (
                <li
                  key={`${index}-${action}`}
                  className="flex items-start gap-2 leading-relaxed text-dw-text"
                >
                  <span
                    aria-hidden
                    className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-md border border-dw-border bg-dw-bg text-[11px] font-semibold text-dw-primary"
                  >
                    ✓
                  </span>
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className={SECTION_HEADING_CLASS}>4. Olası Etki</h3>
            <p className="mt-2 leading-relaxed text-dw-text">
              {analysis.expected_impact}
            </p>
          </section>

          <section>
            <h3 className={SECTION_HEADING_CLASS}>5. Kontrol Edilecek Veriler</h3>
            <ul className="mt-2 flex flex-wrap gap-2">
              {analysis.data_to_check.map((item, index) => (
                <li
                  key={`${index}-${item}`}
                  className="rounded-full border border-dw-border bg-dw-bg px-3 py-1 text-xs text-dw-text"
                >
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className={SECTION_HEADING_CLASS}>6. Sonraki Sorular</h3>
            <ul className="mt-2 flex flex-wrap gap-2">
              {analysis.follow_up_questions.map((question, index) => {
                if (onFollowUpClick) {
                  return (
                    <li key={`${index}-${question}`}>
                      <button
                        type="button"
                        onClick={() => onFollowUpClick(question)}
                        className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-dw-primary transition hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      >
                        {question}
                      </button>
                    </li>
                  )
                }
                return (
                  <li
                    key={`${index}-${question}`}
                    className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs text-dw-primary"
                  >
                    {question}
                  </li>
                )
              })}
            </ul>
          </section>
        </div>
      )}
    </section>
  )
}

type BadgeProps = {
  label: string
  value: string
  className: string
}

function Badge({ label, value, className }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-[var(--radius-dw)] border px-2.5 py-1 text-xs font-medium ${className}`}
    >
      <span className="font-normal opacity-70">{label}:</span>
      <span>{value}</span>
    </span>
  )
}
