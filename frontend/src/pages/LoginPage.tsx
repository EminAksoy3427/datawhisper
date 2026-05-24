import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { FormAlert } from '@/components/FormAlert'
import { Navbar } from '@/components/Navbar'
import { AuthLoadingScreen } from '@/components/AuthLoadingScreen'
import { useAuth } from '@/context/AuthContext'

export function LoginPage() {
  const navigate = useNavigate()
  const { login, isAuthenticated, isLoading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (isLoading) {
    return <AuthLoadingScreen />
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      await login({ email: email.trim(), password })
      navigate('/dashboard', { replace: true })
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Giriş yapılamadı. Lütfen tekrar deneyin.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="mx-auto flex w-full max-w-[1200px] flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-[var(--radius-dw)] border border-dw-border bg-dw-card p-8 shadow-sm">
          <h1 className="mb-2 text-2xl font-bold text-dw-text">Giriş Yap</h1>
          <p className="mb-6 text-sm text-dw-muted">
            Hesabınıza giriş yapın ve panele erişin.
          </p>

          {error && (
            <div className="mb-4">
              <FormAlert message={error} />
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="mb-1 block text-sm font-medium text-dw-text"
              >
                E-posta
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="ornek@isletme.com"
                disabled={isSubmitting}
                className="w-full rounded-[var(--radius-dw)] border border-dw-border px-3 py-2 text-sm outline-none focus:border-dw-primary focus:ring-2 focus:ring-blue-100 disabled:opacity-60"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="mb-1 block text-sm font-medium text-dw-text"
              >
                Şifre
              </label>
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                disabled={isSubmitting}
                className="w-full rounded-[var(--radius-dw)] border border-dw-border px-3 py-2 text-sm outline-none focus:border-dw-primary focus:ring-2 focus:ring-blue-100 disabled:opacity-60"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-[var(--radius-dw)] bg-dw-primary py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-dw-muted">
            Hesabınız yok mu?{' '}
            <Link to="/register" className="font-medium text-dw-primary">
              Kayıt olun
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}
