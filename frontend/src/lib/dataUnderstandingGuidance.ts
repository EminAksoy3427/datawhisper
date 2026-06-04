import type { BusinessSummary } from '@/api/types/data'

const RETURN_GUIDANCE =
  'İade verisi bulunmadığı için iade oranı hesaplanmadı. Daha doğru analiz için dosyanıza «İade Adedi» ve «İade Nedeni» alanlarını ekleyebilirsiniz.'

const PROFIT_GUIDANCE =
  'Kâr analizi için dosyanıza maliyet veya kâr bilgisi ekleyebilirsiniz.'

const PRODUCT_GUIDANCE =
  'Ürün veya kategori bazlı analiz için dosyanıza ürün adı ya da kategori alanı ekleyebilirsiniz.'

const REVENUE_GUIDANCE =
  'Gelir analizi için dosyanıza ciro, satış tutarı veya birim fiyat × adet bilgisi ekleyebilirsiniz.'

const MAX_SUGGESTIONS = 3

function matchesAny(text: string, patterns: RegExp[]): boolean {
  return patterns.some((pattern) => pattern.test(text))
}

function classifyMessage(message: string): string | null {
  const lower = message.toLowerCase()

  if (matchesAny(lower, [/iade/, /return/])) {
    return RETURN_GUIDANCE
  }
  if (
    matchesAny(lower, [
      /maliyet/,
      /kâr/,
      /kar marj/,
      /tahmini kâr/,
      /tahmini kar/,
      /gider/,
    ])
  ) {
    return PROFIT_GUIDANCE
  }
  if (
    matchesAny(lower, [
      /ürün/,
      /urun/,
      /kategori/,
      /category/,
      /grafik/,
      /özeti/,
    ])
  ) {
    return PRODUCT_GUIDANCE
  }
  if (matchesAny(lower, [/gelir/, /ciro/, /satış tutar/, /satis tutar/])) {
    return REVENUE_GUIDANCE
  }
  return null
}

function shortenFallback(message: string): string {
  const trimmed = message.trim()
  if (trimmed.length <= 120) {
    return trimmed
  }
  return `${trimmed.slice(0, 117)}…`
}

export function buildGuidanceSuggestions(summary: BusinessSummary): string[] {
  const messages = summary.missing_capabilities ?? []
  const suggestions: string[] = []
  const seen = new Set<string>()

  for (const message of messages) {
    if (suggestions.length >= MAX_SUGGESTIONS) {
      break
    }
    const friendly = classifyMessage(message) ?? shortenFallback(message)
    if (!seen.has(friendly)) {
      seen.add(friendly)
      suggestions.push(friendly)
    }
  }

  return suggestions
}
