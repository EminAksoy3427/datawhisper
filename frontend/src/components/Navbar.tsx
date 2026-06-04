import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

function navLinkClass(isActive: boolean) {
  return isActive
    ? 'font-medium text-dw-primary'
    : 'text-dw-muted transition-colors hover:text-dw-text'
}

export function Navbar() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated, user, logout } = useAuth()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <header className="border-b border-dw-border bg-dw-card">
      <nav
        className="mx-auto flex w-full min-w-0 max-w-[1200px] flex-wrap items-center justify-between gap-3 px-4 py-3 sm:gap-4 sm:py-4"
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
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className={navLinkClass(pathname === '/dashboard')}
              >
                Panel
              </Link>
              <span className="hidden text-dw-muted sm:inline">
                Merhaba, {user?.name}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-[var(--radius-dw)] border border-dw-border px-4 py-2 font-medium text-dw-text transition-colors hover:bg-dw-bg"
              >
                Çıkış Yap
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={navLinkClass(pathname === '/login')}>
                Giriş Yap
              </Link>
              <Link
                to="/register"
                className="rounded-[var(--radius-dw)] bg-dw-primary px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700"
              >
                Kayıt Ol
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
