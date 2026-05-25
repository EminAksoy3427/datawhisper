type QuestionTemplatesProps = {
  onSelect: (question: string) => void
  disabled?: boolean
}

const TEMPLATES: string[] = [
  'En riskli kategori hangisi?',
  'En çok iade edilen ürünler hangileri?',
  'İade oranı neden yükseliyor?',
  'Hangi ürünlere odaklanmalıyım?',
  'Bana 3 aksiyon öner',
]

export function QuestionTemplates({
  onSelect,
  disabled = false,
}: QuestionTemplatesProps) {
  return (
    <section className="rounded-[var(--radius-dw)] border border-dw-border bg-dw-card p-4 shadow-sm">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-sm font-medium text-dw-text">Hazır sorular</p>
        <p className="text-xs text-dw-muted">
          Tıklayın, soru kutusuna eklensin
        </p>
      </div>
      <ul className="mt-3 flex flex-wrap gap-2">
        {TEMPLATES.map((question) => (
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
    </section>
  )
}
