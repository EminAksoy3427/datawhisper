import { Link, useLocation } from 'react-router-dom'

function navLinkClass(isActive: boolean) {
  return isActive
    ? 'font-medium text-dw-primary'
    : 'text-dw-muted transition-colors hover:text-dw-text'
}

export function Navbar() {
  const { pathname } = useLocation()

  return (
    <header className="border-b border-dw-border bg-dw-card">
      <nav
        className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-4 px-4 py-4"
        aria-label="Ana menü"
      >
        <Link to="/" className="flex items-center gap-2">
          <span
            className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-dw)] bg-dw-primary text-sm font-bold text-white"
            aria-hidden
          >
            DW
          </span>
          <span className="text-lg font-semibold text-dw-text">DataWhisper</span>
        </Link>

        <div className="flex flex-wrap items-center gap-5 text-sm">
          <Link
            to="/dashboard"
            className={navLinkClass(pathname === '/dashboard')}
          >
            Panel
          </Link>
          <Link to="/login" className={navLinkClass(pathname === '/login')}>
            Giriş Yap
          </Link>
          <Link
            to="/register"
            className="rounded-[var(--radius-dw)] bg-dw-primary px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700"
          >
            Kayıt Ol
          </Link>
        </div>
      </nav>
    </header>
  )
}
