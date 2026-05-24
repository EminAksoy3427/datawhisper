type EmptyStateProps = {
  title?: string
  description: string
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="rounded-[var(--radius-dw)] border border-dashed border-dw-border bg-dw-bg px-6 py-8 text-center">
      {title && (
        <p className="mb-1 text-sm font-medium text-dw-text">{title}</p>
      )}
      <p className="text-sm leading-relaxed text-dw-muted">{description}</p>
    </div>
  )
}
