import type { BusinessSummary } from '@/api/types/data'
import { FormAlert } from '@/components/FormAlert'
import {
  ExampleQuestionChips,
  getExampleQuestions,
} from '@/components/QuestionTemplates'

type QuestionBoxProps = {
  summary: BusinessSummary | null
  question: string
  onQuestionChange: (value: string) => void
  onSubmit: () => void
  onExampleSelect?: (question: string) => void
  isLoading: boolean
  disabled: boolean
  errorMessage?: string | null
}

const TEXTAREA_ID = 'ai-business-question'

export function QuestionBox({
  summary,
  question,
  onQuestionChange,
  onSubmit,
  onExampleSelect,
  isLoading,
  disabled,
  errorMessage,
}: QuestionBoxProps) {
  const hasData = summary !== null
  const exampleQuestions = getExampleQuestions(summary)
  const formDisabled = disabled || isLoading || !hasData

  return (
    <section className="flex h-full min-h-[320px] flex-col rounded-[var(--radius-dw)] border border-dw-border bg-dw-card p-6 shadow-sm">
      <header>
        <h2 className="text-lg font-semibold text-dw-text">
          AI İş Analistine Sor
        </h2>
        <p className="mt-1 text-sm leading-relaxed text-dw-muted">
          Verilerinize göre satış, iade, kârlılık ve kategori performansı
          hakkında Türkçe sorular sorun.
        </p>
      </header>

      <div className="mt-4 flex flex-1 flex-col">
        {!hasData && (
          <p className="mb-4 rounded-[var(--radius-dw)] border border-dw-border bg-dw-bg px-3 py-2.5 text-sm leading-relaxed text-dw-muted">
            Önce demo veriyi yükleyin veya kendi dosyanızı seçin. Ardından AI
            analizi oluşturabilirsiniz.
          </p>
        )}

        {hasData && (
          <ExampleQuestionChips
            questions={exampleQuestions}
            onSelect={(value) => {
              onQuestionChange(value)
              onExampleSelect?.(value)
            }}
            disabled={formDisabled}
          />
        )}

        {errorMessage && (
          <div className="mt-4">
            <FormAlert message={errorMessage} />
          </div>
        )}

        <div className={`mt-4 flex flex-1 flex-col ${hasData ? '' : 'mt-0'}`}>
          <label
            htmlFor={TEXTAREA_ID}
            className="mb-1.5 text-xs font-medium text-dw-text"
          >
            Sorunuz
          </label>
          <textarea
            id={TEXTAREA_ID}
            rows={4}
            value={question}
            onChange={(event) => onQuestionChange(event.target.value)}
            placeholder="Örn: En çok iade edilen ürün hangisi ve ne yapmalıyım?"
            disabled={formDisabled}
            className="w-full flex-1 resize-none rounded-[var(--radius-dw)] border border-dw-border px-3 py-2 text-sm outline-none focus:border-dw-primary focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-dw-bg disabled:opacity-60"
          />
          <button
            type="button"
            onClick={onSubmit}
            disabled={formDisabled || question.trim().length < 3}
            className="mt-3 w-full rounded-[var(--radius-dw)] bg-dw-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            {isLoading ? 'Analiz hazırlanıyor...' : 'AI Analizi Oluştur'}
          </button>
        </div>
      </div>
    </section>
  )
}
