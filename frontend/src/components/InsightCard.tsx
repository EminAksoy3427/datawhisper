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

const EMPTY_PREVIEW_ITEMS = [
  'Ana bulgu',
  'Neden önemli?',
  'Önerilen aksiyonlar',
] as const

export function InsightCard({
  analysis,
  isLoading,
  onFollowUpClick,
}: InsightCardProps) {
  return (
    <section className="flex h-full min-h-[320px] flex-col rounded-[var(--radius-dw)] border border-dw-border bg-dw-card p-6 shadow-sm">
      <header className="mb-4">
        <h2 className="text-lg font-semibold text-dw-text">
          DataWhisper AI Analizi
        </h2>
        <p className="mt-1 text-sm leading-relaxed text-dw-muted">
          İş analisti yaklaşımıyla hazırlanmış, verilerinize özel bir özet.
          Karar vermeden önce kendi iş bilginizle birlikte değerlendirin.
        </p>
      </header>

      <div className="flex flex-1 flex-col">
        {isLoading && (
          <div className="flex flex-1 items-center rounded-[var(--radius-dw)] border border-dw-border bg-dw-bg px-4 py-6">
            <LoadingSpinner
              message="DataWhisper verinizi inceliyor..."
              detail="Metrikler, riskler ve aksiyon önerileri hazırlanıyor."
            />
          </div>
        )}

        {!isLoading && !analysis && (
          <div className="flex flex-1 flex-col justify-center rounded-[var(--radius-dw)] border border-dashed border-dw-border bg-dw-bg px-5 py-6">
            <h3 className="text-sm font-semibold text-dw-text">
              Henüz AI analizi yok
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-dw-muted">
              Bir soru sorduğunuzda DataWhisper ana bulgu, neden önemli olduğu
              ve önerilen aksiyonları burada gösterecek.
            </p>
            <p className="mt-4 text-[11px] font-medium uppercase tracking-wide text-dw-muted">
              Raporda yer alacak bölümler
            </p>
            <ul className="mt-2 space-y-1.5">
              {EMPTY_PREVIEW_ITEMS.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-xs text-dw-muted"
                >
                  <span
                    className="h-1 w-1 rounded-full bg-dw-border"
                    aria-hidden
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
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
              <h3 className={SECTION_HEADING_CLASS}>
                5. Kontrol Edilecek Veriler
              </h3>
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
                {analysis.follow_up_questions.map((followUp, index) => {
                  if (onFollowUpClick) {
                    return (
                      <li key={`${index}-${followUp}`}>
                        <button
                          type="button"
                          onClick={() => onFollowUpClick(followUp)}
                          className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-dw-primary transition hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        >
                          {followUp}
                        </button>
                      </li>
                    )
                  }
                  return (
                    <li
                      key={`${index}-${followUp}`}
                      className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs text-dw-primary"
                    >
                      {followUp}
                    </li>
                  )
                })}
              </ul>
            </section>
          </div>
        )}
      </div>
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
