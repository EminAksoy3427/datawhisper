import { useState } from 'react'
import type { BusinessSummary, PossibleColumnMatch } from '@/api/types/data'
import { buildGuidanceSuggestions } from '@/lib/dataUnderstandingGuidance'
import { getColumnLabel, getDimensionLabel } from '@/lib/labels'

type DataUnderstandingCardProps = {
  summary: BusinessSummary
}

const CHIP_DISPLAY_ORDER = [
  'revenue',
  'cost',
  'profit',
  'sales_quantity',
  'product_name',
  'category',
  'date',
  'return_quantity',
  'return_reason',
  'sales_channel',
  'region',
  'country',
  'order_priority',
  'order_id',
  'unit_price',
  'unit_cost',
  'supplier',
] as const

function normalizePossibleMatches(
  raw: BusinessSummary['possible_matches'],
): PossibleColumnMatch[] {
  if (!raw || !Array.isArray(raw)) {
    return []
  }
  const matches: PossibleColumnMatch[] = []
  for (const item of raw) {
    if (
      typeof item === 'object' &&
      item !== null &&
      'canonical' in item &&
      'column' in item &&
      typeof item.canonical === 'string' &&
      typeof item.column === 'string'
    ) {
      const matchConfidence =
        'confidence' in item && typeof item.confidence === 'number'
          ? item.confidence
          : 0
      matches.push({
        canonical: item.canonical,
        column: item.column,
        confidence: matchConfidence,
      })
    }
  }
  return matches
}

function shouldRenderCard(summary: BusinessSummary): boolean {
  const columns = summary.detected_columns ?? {}
  const dimensions = summary.detected_dimensions ?? {}
  const missing = summary.missing_capabilities ?? []
  return (
    Object.keys(columns).length > 0 ||
    Object.keys(dimensions).length > 0 ||
    missing.length > 0
  )
}

function getDetectedFieldChips(summary: BusinessSummary): string[] {
  const columns = summary.detected_columns ?? {}
  const dimensions = summary.detected_dimensions ?? {}
  const canonicals = new Set([
    ...Object.keys(columns),
    ...Object.keys(dimensions),
  ])

  const ordered: string[] = []
  for (const key of CHIP_DISPLAY_ORDER) {
    if (canonicals.has(key)) {
      ordered.push(
        key in dimensions ? getDimensionLabel(key) : getColumnLabel(key),
      )
    }
  }

  for (const key of canonicals) {
    const label =
      key in dimensions ? getDimensionLabel(key) : getColumnLabel(key)
    if (!ordered.includes(label)) {
      ordered.push(label)
    }
  }

  return ordered
}

function hasTechnicalDetails(summary: BusinessSummary): boolean {
  const columns = summary.detected_columns ?? {}
  const dimensions = summary.detected_dimensions ?? {}
  const possible = normalizePossibleMatches(summary.possible_matches)
  return (
    Object.keys(columns).length > 0 ||
    Object.keys(dimensions).length > 0 ||
    possible.length > 0
  )
}

type TechnicalRowProps = {
  label: string
  original: string
  confidence?: number
}

function TechnicalRow({ label, original, confidence }: TechnicalRowProps) {
  return (
    <li className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
      <span className="font-medium text-dw-text">{label}</span>
      <span className="text-dw-muted">→</span>
      <span className="text-dw-muted">{original}</span>
      {confidence !== undefined && (
        <span className="rounded-full border border-dw-border bg-dw-bg px-1.5 py-0.5 text-[10px] text-dw-muted">
          %{Math.round(confidence)}
        </span>
      )}
    </li>
  )
}

export function DataUnderstandingCard({ summary }: DataUnderstandingCardProps) {
  const [showTechnical, setShowTechnical] = useState(false)

  if (!shouldRenderCard(summary)) {
    return null
  }

  const detectedColumns = summary.detected_columns ?? {}
  const detectedDimensions = summary.detected_dimensions ?? {}
  const confidence = summary.detected_column_confidence ?? {}
  const possibleMatches = normalizePossibleMatches(summary.possible_matches)
  const fieldChips = getDetectedFieldChips(summary)
  const guidance = buildGuidanceSuggestions(summary)
  const technicalAvailable = hasTechnicalDetails(summary)

  const columnEntries = Object.entries(detectedColumns).sort(([a], [b]) =>
    getColumnLabel(a).localeCompare(getColumnLabel(b), 'tr'),
  )
  const dimensionEntries = Object.entries(detectedDimensions).sort(([a], [b]) =>
    getDimensionLabel(a).localeCompare(getDimensionLabel(b), 'tr'),
  )

  return (
    <section className="min-w-0 rounded-[var(--radius-dw)] border border-dw-border bg-dw-card px-4 py-4 shadow-sm sm:px-5">
      <h2 className="text-base font-semibold text-dw-text">Dosya Durumu</h2>

      {fieldChips.length > 0 && (
        <div className="mt-2 space-y-1">
          <p className="text-sm font-medium text-dw-text">
            Dosyanız başarıyla analiz edildi.
          </p>
          <p className="text-sm leading-relaxed text-dw-muted">
            DataWhisper güvenli algıladığı alanlarla metrikleri ve grafikleri
            oluşturdu.
          </p>
        </div>
      )}

      {fieldChips.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {fieldChips.map((label) => (
            <span
              key={label}
              className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-dw-secondary"
            >
              {label}
            </span>
          ))}
        </div>
      )}

      {guidance.length > 0 && (
        <ul
          className={`space-y-2 ${fieldChips.length > 0 ? 'mt-3' : 'mt-2'}`}
          aria-label="İyileştirme önerileri"
        >
          {guidance.map((suggestion) => (
            <li
              key={suggestion}
              className="rounded-[var(--radius-dw)] border border-amber-200/70 bg-amber-50/60 px-3 py-2 text-sm leading-relaxed text-amber-950"
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}

      {technicalAvailable && (
        <div className="mt-3 border-t border-dw-border pt-3">
          <button
            type="button"
            onClick={() => setShowTechnical((open) => !open)}
            className="text-xs font-medium text-dw-primary hover:underline"
            aria-expanded={showTechnical}
          >
            {showTechnical
              ? 'Teknik eşleşmeleri gizle'
              : 'Teknik eşleşmeleri göster'}
          </button>

          {showTechnical && (
            <div className="mt-3 space-y-3 rounded-[var(--radius-dw)] border border-dashed border-dw-border bg-dw-bg px-3 py-3">
              {columnEntries.length > 0 && (
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-dw-muted">
                    İş alanları
                  </p>
                  <ul className="mt-1.5 space-y-1">
                    {columnEntries.map(([canonical, original]) => (
                      <TechnicalRow
                        key={canonical}
                        label={getColumnLabel(canonical)}
                        original={original}
                        confidence={confidence[canonical]}
                      />
                    ))}
                  </ul>
                </div>
              )}

              {dimensionEntries.length > 0 && (
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-dw-muted">
                    Ek boyutlar
                  </p>
                  <ul className="mt-1.5 space-y-1">
                    {dimensionEntries.map(([canonical, original]) => (
                      <TechnicalRow
                        key={canonical}
                        label={getDimensionLabel(canonical)}
                        original={original}
                        confidence={confidence[canonical]}
                      />
                    ))}
                  </ul>
                </div>
              )}

              {possibleMatches.length > 0 && (
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-dw-muted">
                    Düşük güvenli eşleşmeler
                  </p>
                  <ul className="mt-1.5 space-y-1">
                    {possibleMatches.map((match) => (
                      <TechnicalRow
                        key={`${match.canonical}-${match.column}`}
                        label={getColumnLabel(match.canonical)}
                        original={match.column}
                        confidence={match.confidence}
                      />
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  )
}
