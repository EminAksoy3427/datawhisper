type FormAlertProps = {
  message: string
  variant?: 'error' | 'info'
}

export function FormAlert({ message, variant = 'error' }: FormAlertProps) {
  const styles =
    variant === 'error'
      ? 'border-red-200 bg-red-50 text-dw-danger'
      : 'border-dw-border bg-dw-bg text-dw-muted'

  return (
    <p
      className={`rounded-[var(--radius-dw)] border px-3 py-2 text-sm ${styles}`}
      role="alert"
    >
      {message}
    </p>
  )
}
