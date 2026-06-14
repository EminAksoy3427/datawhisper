import { useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { resetPassword } from '@/api/auth'
import { AuthLayout } from '@/components/AuthLayout'
import { FormAlert } from '@/components/FormAlert'
import { PasswordInput } from '@/components/PasswordInput'
import {
  validatePasswordMinLength,
  validatePasswordsMatch,
  validateRequiredPassword,
} from '@/lib/authValidation'
import { getApiErrorMessage } from '@/lib/apiError'

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? ''

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setSuccessMessage(null)

    if (!token) {
      setError('Geçersiz veya eksik sıfırlama bağlantısı.')
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
      const response = await resetPassword({ token, password })
      setSuccessMessage(response.message)
    } catch (submitError) {
      setError(getApiErrorMessage(submitError))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout>
      <h2 className="text-2xl font-bold text-dw-text">Yeni şifre belirleyin</h2>
      <p className="mt-2 text-sm leading-relaxed text-dw-muted">
        Hesabınız için yeni bir şifre oluşturun.
      </p>

      {!token && (
        <div className="mt-6">
          <FormAlert message="Geçersiz veya eksik sıfırlama bağlantısı." />
        </div>
      )}

      {error && (
        <div className="mt-6">
          <FormAlert message={error} />
        </div>
      )}

      {successMessage && (
        <div className="mt-6">
          <FormAlert message={successMessage} variant="success" />
        </div>
      )}

      {!successMessage && token && (
        <form
          className={`space-y-4 ${error ? 'mt-4' : 'mt-6'}`}
          onSubmit={handleSubmit}
        >
          <PasswordInput
            id="reset-password"
            label="Yeni Şifre"
            value={password}
            onChange={setPassword}
            placeholder="En az 8 karakter"
            autoComplete="new-password"
            disabled={isSubmitting}
            minLength={8}
          />

          <PasswordInput
            id="reset-confirm-password"
            label="Yeni Şifre Tekrar"
            value={confirmPassword}
            onChange={setConfirmPassword}
            placeholder="Şifrenizi tekrar girin"
            autoComplete="new-password"
            disabled={isSubmitting}
            minLength={8}
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-[var(--radius-dw)] bg-dw-primary py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Kaydediliyor...' : 'Şifreyi Güncelle'}
          </button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-dw-muted">
        <Link to="/login" className="font-medium text-dw-primary">
          Giriş sayfasına dön
        </Link>
      </p>
    </AuthLayout>
  )
}
