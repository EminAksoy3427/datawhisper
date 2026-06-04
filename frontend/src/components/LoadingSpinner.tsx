type LoadingSpinnerProps = {
  message?: string
  detail?: string
  size?: 'sm' | 'md'
}

export function LoadingSpinner({
  message = 'Yükleniyor...',
  detail,
  size = 'md',
}: LoadingSpinnerProps) {
  const spinnerSize = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'

  return (
    <div className="flex gap-3 text-sm text-dw-muted" role="status">
      <span
        className={`${spinnerSize} mt-0.5 flex-none animate-spin rounded-full border-2 border-dw-border border-t-dw-primary`}
        aria-hidden
      />
      <div>
        <p className="font-medium text-dw-text">{message}</p>
        {detail && (
          <p className="mt-1 text-xs leading-relaxed text-dw-muted">{detail}</p>
        )}
      </div>
    </div>
  )
}
