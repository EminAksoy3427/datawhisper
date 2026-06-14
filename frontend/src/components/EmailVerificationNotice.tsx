import { useState } from 'react'
import { resendVerification } from '@/api/auth'
import { FormAlert } from '@/components/FormAlert'
import { useAuth } from '@/context/AuthContext'
import { getApiErrorMessage } from '@/lib/apiError'

export function EmailVerificationNotice() {
  const { user, refreshUser } = useAuth()
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!user || user.email_verified) {
    return null
  }

  async function handleResend() {
    setMessage(null)
    setError(null)
    setIsSubmitting(true)

    try {
      const response = await resendVerification()
      setMessage(response.message)
      await refreshUser()
    } catch (submitError) {
      setError(getApiErrorMessage(submitError))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mb-6 rounded-[var(--radius-dw)] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
      <p>
        E-posta adresiniz henüz doğrulanmadı. Gelen kutunuzu kontrol edin veya
        doğrulama bağlantısını tekrar gönderin.
      </p>
      {message && (
        <div className="mt-3">
          <FormAlert message={message} variant="success" />
        </div>
      )}
      {error && (
        <div className="mt-3">
          <FormAlert message={error} />
        </div>
      )}
      <div className="mt-3">
        <button
          type="button"
          onClick={() => void handleResend()}
          disabled={isSubmitting}
          className="rounded-[var(--radius-dw)] border border-amber-300 bg-white px-3 py-1.5 text-sm font-medium text-amber-900 hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Gönderiliyor...' : 'Tekrar gönder'}
        </button>
      </div>
    </div>
  )
}
