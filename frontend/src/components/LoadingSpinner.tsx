type LoadingSpinnerProps = {
  message?: string
  size?: 'sm' | 'md'
}

export function LoadingSpinner({
  message = 'Yükleniyor...',
  size = 'md',
}: LoadingSpinnerProps) {
  const spinnerSize = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'

  return (
    <div className="flex items-center gap-2 text-sm text-dw-muted" role="status">
      <span
        className={`${spinnerSize} animate-spin rounded-full border-2 border-dw-border border-t-dw-primary`}
        aria-hidden
      />
      <span>{message}</span>
    </div>
  )
}
