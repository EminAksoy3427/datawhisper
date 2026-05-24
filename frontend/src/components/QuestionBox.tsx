import { FormAlert } from '@/components/FormAlert'

type QuestionBoxProps = {
  question: string
  onQuestionChange: (value: string) => void
  onSubmit: () => void
  isLoading: boolean
  disabled: boolean
  warningMessage?: string | null
  errorMessage?: string | null
}

export function QuestionBox({
  question,
  onQuestionChange,
  onSubmit,
  isLoading,
  disabled,
  warningMessage,
  errorMessage,
}: QuestionBoxProps) {
  return (
    <section className="rounded-[var(--radius-dw)] border border-dw-border bg-dw-card p-6 shadow-sm">
      <h2 className="mb-2 text-lg font-semibold text-dw-text">Soru Sorun</h2>
      <p className="mb-4 text-sm leading-relaxed text-dw-muted">
        Yüklediğiniz verilere dayanarak Türkçe iş soruları sorabilirsiniz. Örneğin:
        hangi ürün en çok gelir getiriyor, iade oranı neden yükseliyor veya hangi
        kategoriye odaklanmalısınız.
      </p>

      {warningMessage && (
        <div className="mb-4">
          <FormAlert message={warningMessage} variant="info" />
        </div>
      )}

      {errorMessage && (
        <div className="mb-4">
          <FormAlert message={errorMessage} />
        </div>
      )}

      <textarea
        rows={3}
        value={question}
        onChange={(event) => onQuestionChange(event.target.value)}
        placeholder="Örn: En çok iade edilen ürün hangisi ve ne yapmalıyım?"
        disabled={disabled || isLoading}
        className="mb-3 w-full resize-none rounded-[var(--radius-dw)] border border-dw-border px-3 py-2 text-sm outline-none focus:border-dw-primary focus:ring-2 focus:ring-blue-100 disabled:opacity-60"
      />
      <button
        type="button"
        onClick={onSubmit}
        disabled={disabled || isLoading || question.trim().length < 3}
        className="rounded-[var(--radius-dw)] bg-dw-primary px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? 'Analiz ediliyor...' : 'Soru Gönder'}
      </button>
    </section>
  )
}
