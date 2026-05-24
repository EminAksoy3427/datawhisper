export function AuthLoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-dw-bg">
      <div className="text-center">
        <div
          className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-dw-border border-t-dw-primary"
          aria-hidden
        />
        <p className="text-sm text-dw-muted">Yükleniyor...</p>
      </div>
    </div>
  )
}
