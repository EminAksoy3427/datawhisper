import type { BusinessSummary, CategoryMetric } from '@/api/types/data'
import { formatCurrency, formatPercent } from '@/lib/format'

type ExecutiveSummaryCardProps = {
  summary: BusinessSummary
}

type InsightTone = 'positive' | 'neutral' | 'warning' | 'danger'

type InsightItem = {
  title: string
  message: string
  tone: InsightTone
}

const TONE_STYLES: Record<InsightTone, { dot: string; chip: string }> = {
  positive: {
    dot: 'bg-dw-secondary',
    chip: 'bg-emerald-50 text-dw-secondary border-emerald-200',
  },
  neutral: {
    dot: 'bg-dw-primary',
    chip: 'bg-blue-50 text-dw-primary border-blue-200',
  },
  warning: {
    dot: 'bg-dw-warning',
    chip: 'bg-amber-50 text-dw-warning border-amber-200',
  },
  danger: {
    dot: 'bg-dw-danger',
    chip: 'bg-red-50 text-dw-danger border-red-200',
  },
}

const TONE_LABELS: Record<InsightTone, string> = {
  positive: 'Olumlu',
  neutral: 'Bilgi',
  warning: 'Dikkat',
  danger: 'Uyarı',
}

function pickStrongestCategory(
  categories: CategoryMetric[],
): CategoryMetric | null {
  if (categories.length === 0) {
    return null
  }
  return categories.reduce((best, current) =>
    current.revenue > best.revenue ? current : best,
  )
}

function buildCategoryInsight(summary: BusinessSummary): InsightItem | null {
  const categories = summary.category_summary
  if (!categories || categories.length === 0) {
    return null
  }
  const strongest = pickStrongestCategory(categories)
  if (!strongest || strongest.revenue <= 0) {
    return null
  }

  const totalRevenue = categories.reduce(
    (sum, category) => sum + (category.revenue ?? 0),
    0,
  )
  const sharePart =
    totalRevenue > 0
      ? ` (toplam gelirin yaklaşık ${formatPercent((strongest.revenue / totalRevenue) * 100)}'i)`
      : ''

  return {
    title: 'En güçlü kategori',
    message: `Gelirin en güçlü kategorisi "${strongest.category}" — ${formatCurrency(strongest.revenue)}${sharePart}.`,
    tone: 'positive',
  }
}

function buildReturnRateInsight(summary: BusinessSummary): InsightItem | null {
  const rate = summary.metrics.return_rate
  if (rate === null) {
    return null
  }

  const formatted = formatPercent(rate)

  if (rate >= 15) {
    return {
      title: 'İade oranı',
      message: `İade oranınız çok yüksek (${formatted}). En çok iade edilen ürünleri inceleyip acil aksiyon almanız önerilir.`,
      tone: 'danger',
    }
  }
  if (rate >= 10) {
    return {
      title: 'İade oranı',
      message: `İade oranınız yüksek (${formatted}). Sebepleri analiz edip iade nedenlerini azaltmak öncelikli olmalı.`,
      tone: 'warning',
    }
  }
  if (rate >= 5) {
    return {
      title: 'İade oranı',
      message: `İade oranınız orta seviyede (${formatted}). Kategoriler arasındaki farkı takip etmenizde fayda var.`,
      tone: 'neutral',
    }
  }
  return {
    title: 'İade oranı',
    message: `İade oranınız sağlıklı (${formatted}). Müşteri memnuniyetiniz iyi seviyede görünüyor.`,
    tone: 'positive',
  }
}

function buildProfitMarginInsight(
  summary: BusinessSummary,
): InsightItem | null {
  const margin = summary.metrics.profit_margin
  if (margin === null) {
    return null
  }

  const formatted = formatPercent(margin)

  if (margin <= 0) {
    return {
      title: 'Kar marjı',
      message: `Kar marjınız ${formatted} ile negatif/sıfır. Maliyetleri ve fiyatlandırmayı acilen gözden geçirin.`,
      tone: 'danger',
    }
  }
  if (margin < 20) {
    return {
      title: 'Kar marjı',
      message: `Kar marjınız düşük (${formatted}). Maliyet kontrolüne ve daha karlı ürünlere odaklanmanız önerilir.`,
      tone: 'warning',
    }
  }
  if (margin < 35) {
    return {
      title: 'Kar marjı',
      message: `Kar marjınız makul seviyede (${formatted}). Maliyetleri optimize ederek bu oranı artırabilirsiniz.`,
      tone: 'neutral',
    }
  }
  return {
    title: 'Kar marjı',
    message: `Kar marjınız güçlü (${formatted}). Mevcut fiyatlama ve maliyet dengeniz iyi çalışıyor.`,
    tone: 'positive',
  }
}

function buildInsights(summary: BusinessSummary): InsightItem[] {
  const candidates = [
    buildCategoryInsight(summary),
    buildReturnRateInsight(summary),
    buildProfitMarginInsight(summary),
  ]
  return candidates.filter((item): item is InsightItem => item !== null)
}

export function ExecutiveSummaryCard({ summary }: ExecutiveSummaryCardProps) {
  const insights = buildInsights(summary)

  return (
    <section className="min-w-0 rounded-[var(--radius-dw)] border border-dw-border bg-dw-card p-4 shadow-sm sm:p-5">
      <header>
        <h2 className="text-base font-semibold text-dw-text">
          Yönetici Özeti
        </h2>
        <p className="mt-1 text-sm leading-relaxed text-dw-muted">
          Verinizden otomatik çıkarılan, yapay zeka beklemeden hazır 3 hızlı
          içgörü.
        </p>
      </header>

      {insights.length === 0 ? (
        <p className="mt-4 rounded-[var(--radius-dw)] border border-dashed border-dw-border bg-dw-bg px-4 py-6 text-center text-sm text-dw-muted">
          Bu veri setinde yönetici özeti için yeterli metrik yok. Daha kapsamlı
          bir analiz için gelir, maliyet veya kategori bilgisi gereklidir.
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {insights.map((insight) => {
            const tone = TONE_STYLES[insight.tone]
            return (
              <li
                key={insight.title}
                className="flex items-start gap-3 rounded-[var(--radius-dw)] border border-dw-border bg-dw-bg p-3"
              >
                <span
                  aria-hidden
                  className={`mt-1 h-2.5 w-2.5 flex-none rounded-full ${tone.dot}`}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-dw-text">
                      {insight.title}
                    </p>
                    <span
                      className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${tone.chip}`}
                    >
                      {TONE_LABELS[insight.tone]}
                    </span>
                  </div>
                  <p className="mt-1 break-words text-sm leading-relaxed text-dw-text">
                    {insight.message}
                  </p>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
