type MetricCardProps = {
  label: string
  value: string
  tone?: 'default' | 'success' | 'warning' | 'primary'
}

const toneClasses = {
  default: 'text-dw-text',
  success: 'text-dw-secondary',
  warning: 'text-dw-warning',
  primary: 'text-dw-primary',
}

export function MetricCard({
  label,
  value,
  tone = 'default',
}: MetricCardProps) {
  return (
    <article className="rounded-[var(--radius-dw)] border border-dw-border bg-dw-card p-5 shadow-sm">
      <p className="text-sm text-dw-muted">{label}</p>
      <p className={`mt-2 text-xl font-semibold ${toneClasses[tone]}`}>
        {value}
      </p>
    </article>
  )
}
