import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { forgotPassword } from '@/api/auth'
import { AuthLayout } from '@/components/AuthLayout'
import { FormAlert } from '@/components/FormAlert'
import { validateRequiredEmail } from '@/lib/authValidation'
import { getApiErrorMessage } from '@/lib/apiError'

const inputClassName =
  'w-full rounded-[var(--radius-dw)] border border-dw-border px-3 py-2 text-sm outline-none focus:border-dw-primary focus:ring-2 focus:ring-blue-100 disabled:opacity-60'

const SUCCESS_MESSAGE =
  'Eğer bu e-posta ile kayıtlı bir hesap varsa, şifre sıfırlama bağlantısı gönderildi.'

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setSuccessMessage(null)

    const emailError = validateRequiredEmail(email)
    if (emailError) {
      setError(emailError)
      return
    }

    setIsSubmitting(true)

    try {
      await forgotPassword({ email: email.trim() })
      setSuccessMessage(SUCCESS_MESSAGE)
    } catch (submitError) {
      setError(getApiErrorMessage(submitError))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout>
      <h2 className="text-2xl font-bold text-dw-text">Şifremi unuttum</h2>
      <p className="mt-2 text-sm leading-relaxed text-dw-muted">
        Kayıtlı e-posta adresinizi girin. Şifre sıfırlama bağlantısı gönderilecektir.
      </p>

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

      <form
        className={`space-y-4 ${error || successMessage ? 'mt-4' : 'mt-6'}`}
        onSubmit={handleSubmit}
      >
        <div>
          <label
            htmlFor="forgot-email"
            className="mb-1 block text-sm font-medium text-dw-text"
          >
            E-posta
          </label>
          <input
            id="forgot-email"
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

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-[var(--radius-dw)] bg-dw-primary py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Gönderiliyor...' : 'Sıfırlama Bağlantısı Gönder'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-dw-muted">
        <Link to="/login" className="font-medium text-dw-primary">
          Giriş sayfasına dön
        </Link>
      </p>
    </AuthLayout>
  )
}
