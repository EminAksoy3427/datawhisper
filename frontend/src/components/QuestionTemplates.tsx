import type { BusinessSummary } from '@/api/types/data'

type QuestionTemplate = {
  text: string
  needsReturn?: boolean
  needsCategory?: boolean
  needsProfitMargin?: boolean
}

const QUESTION_TEMPLATES: QuestionTemplate[] = [
  { text: 'En riskli kategori hangisi?', needsCategory: true },
  { text: 'En çok iade edilen ürünler hangileri?', needsReturn: true },
  { text: 'Hangi ürünlere odaklanmalıyım?' },
  { text: 'Kâr marjını nasıl artırabilirim?', needsProfitMargin: true },
  { text: 'Bana 3 aksiyon öner' },
]

export function getExampleQuestions(
  summary: BusinessSummary | null,
): string[] {
  if (!summary) {
    return []
  }

  const { metrics, category_summary } = summary
  const hasReturn = metrics.return_rate !== null
  const hasCategory = category_summary.length > 0
  const hasProfitMargin = metrics.profit_margin !== null

  return QUESTION_TEMPLATES.filter((template) => {
    if (template.needsReturn && !hasReturn) {
      return false
    }
    if (template.needsCategory && !hasCategory) {
      return false
    }
    if (template.needsProfitMargin && !hasProfitMargin) {
      return false
    }
    return true
  }).map((template) => template.text)
}

type ExampleQuestionChipsProps = {
  questions: string[]
  onSelect: (question: string) => void
  disabled?: boolean
}

export function ExampleQuestionChips({
  questions,
  onSelect,
  disabled = false,
}: ExampleQuestionChipsProps) {
  if (questions.length === 0) {
    return null
  }

  return (
    <div>
      <p className="text-xs font-medium text-dw-muted">Örnek sorular</p>
      <ul className="mt-2 flex flex-wrap gap-2">
        {questions.map((question) => (
          <li key={question}>
            <button
              type="button"
              onClick={() => onSelect(question)}
              disabled={disabled}
              className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-dw-primary transition hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {question}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
