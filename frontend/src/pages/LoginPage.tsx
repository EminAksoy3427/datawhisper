import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { AuthLayout } from '@/components/AuthLayout'
import { FormAlert } from '@/components/FormAlert'
import { AuthLoadingScreen } from '@/components/AuthLoadingScreen'
import { PasswordInput } from '@/components/PasswordInput'
import { useAuth } from '@/context/AuthContext'
import {
  validateRequiredEmail,
  validateRequiredPassword,
} from '@/lib/authValidation'

const inputClassName =
  'w-full rounded-[var(--radius-dw)] border border-dw-border px-3 py-2 text-sm outline-none focus:border-dw-primary focus:ring-2 focus:ring-blue-100 disabled:opacity-60'

const GENERIC_LOGIN_ERROR =
  'E-posta veya şifre hatalı. Bilgilerinizi kontrol edip tekrar deneyin.'

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

    const emailError = validateRequiredEmail(email)
    if (emailError) {
      setError(emailError)
      return
    }

    const passwordError = validateRequiredPassword(password)
    if (passwordError) {
      setError(passwordError)
      return
    }

    setIsSubmitting(true)

    try {
      await login({ email: email.trim(), password })
      navigate('/dashboard', { replace: true })
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : GENERIC_LOGIN_ERROR,
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout>
      <h2 className="text-2xl font-bold text-dw-text">Tekrar hoş geldiniz</h2>
      <p className="mt-2 text-sm leading-relaxed text-dw-muted">
        Panelinize giriş yapın ve işletme analizlerinize kaldığınız yerden
        devam edin.
      </p>

      {error && (
        <div className="mt-6">
          <FormAlert message={error} />
        </div>
      )}

      <form
        className={`space-y-4 ${error ? 'mt-4' : 'mt-6'}`}
        onSubmit={handleSubmit}
      >
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
            className={inputClassName}
          />
        </div>

        <PasswordInput
          id="password"
          label="Şifre"
          value={password}
          onChange={setPassword}
          autoComplete="current-password"
          disabled={isSubmitting}
        />

        <div className="flex justify-end">
          <Link
            to="/forgot-password"
            className="text-sm font-medium text-dw-primary"
          >
            Şifremi unuttum?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-[var(--radius-dw)] bg-dw-primary py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Giriş yapılıyor...' : 'Giriş Yap'}
        </button>
        <p className="text-center text-xs leading-relaxed text-dw-muted">
          Giriş yaptıktan sonra demo veriyle veya kendi dosyanızla analiz
          başlatabilirsiniz.
        </p>
      </form>

      <p className="mt-6 text-center text-sm text-dw-muted">
        Hesabınız yok mu?{' '}
        <Link to="/register" className="font-medium text-dw-primary">
          Kayıt olun
        </Link>
      </p>
    </AuthLayout>
  )
}
