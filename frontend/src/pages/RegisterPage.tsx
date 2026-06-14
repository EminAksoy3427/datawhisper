import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { AuthLayout } from '@/components/AuthLayout'
import { FormAlert } from '@/components/FormAlert'
import { AuthLoadingScreen } from '@/components/AuthLoadingScreen'
import { PasswordInput } from '@/components/PasswordInput'
import { useAuth } from '@/context/AuthContext'
import {
  validatePasswordMinLength,
  validatePasswordsMatch,
  validateRequiredEmail,
  validateRequiredName,
  validateRequiredPassword,
} from '@/lib/authValidation'

const inputClassName =
  'w-full rounded-[var(--radius-dw)] border border-dw-border px-3 py-2 text-sm outline-none focus:border-dw-primary focus:ring-2 focus:ring-blue-100 disabled:opacity-60'

export function RegisterPage() {
  const navigate = useNavigate()
  const { register, isAuthenticated, isLoading } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
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

    const nameError = validateRequiredName(name)
    if (nameError) {
      setError(nameError)
      return
    }

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

    const minLengthError = validatePasswordMinLength(password)
    if (minLengthError) {
      setError(minLengthError)
      return
    }

    const matchError = validatePasswordsMatch(password, confirmPassword)
    if (matchError) {
      setError(matchError)
      return
    }

    setIsSubmitting(true)

    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        password,
      })
      navigate('/dashboard', { replace: true })
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Kayıt oluşturulamadı. Lütfen tekrar deneyin.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout>
      <h2 className="text-2xl font-bold text-dw-text">DataWhisper&apos;a başlayın</h2>
      <p className="mt-2 text-sm leading-relaxed text-dw-muted">
        Ücretsiz hesap oluşturun ve ilk işletme analizini birkaç dakika içinde
        deneyin.
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
            htmlFor="name"
            className="mb-1 block text-sm font-medium text-dw-text"
          >
            Ad Soyad
          </label>
          <input
            id="name"
            type="text"
            required
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Adınız Soyadınız"
            disabled={isSubmitting}
            className={inputClassName}
          />
        </div>
        <div>
          <label
            htmlFor="register-email"
            className="mb-1 block text-sm font-medium text-dw-text"
          >
            E-posta
          </label>
          <input
            id="register-email"
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
          id="register-password"
          label="Şifre"
          value={password}
          onChange={setPassword}
          placeholder="En az 8 karakter"
          autoComplete="new-password"
          disabled={isSubmitting}
          minLength={8}
        />

        <PasswordInput
          id="register-confirm-password"
          label="Şifre Tekrar"
          value={confirmPassword}
          onChange={setConfirmPassword}
          placeholder="Şifrenizi tekrar girin"
          autoComplete="new-password"
          disabled={isSubmitting}
          minLength={8}
        />

        <p className="text-xs leading-relaxed text-dw-muted">
          E-posta doğrulama altyapısı hazırdır; canlı doğrulama özel domain
          yapılandırması sonrası aktif edilir.
        </p>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-[var(--radius-dw)] bg-dw-primary py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Hesap oluşturuluyor...' : 'Hesap Oluştur'}
        </button>
        <p className="text-center text-xs leading-relaxed text-dw-muted">
          Kredi kartı gerekmez. Demo veriyle hemen deneyebilirsiniz.
        </p>
      </form>

      <p className="mt-6 text-center text-sm text-dw-muted">
        Zaten hesabınız var mı?{' '}
        <Link to="/login" className="font-medium text-dw-primary">
          Giriş yapın
        </Link>
      </p>
    </AuthLayout>
  )
}
