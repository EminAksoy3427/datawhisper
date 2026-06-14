import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { verifyEmail } from '@/api/auth'
import { AuthLayout } from '@/components/AuthLayout'
import { FormAlert } from '@/components/FormAlert'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { getApiErrorMessage } from '@/lib/apiError'

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? ''

  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function runVerification() {
      if (!token) {
        if (!cancelled) {
          setError('Geçersiz veya eksik doğrulama bağlantısı.')
          setIsLoading(false)
        }
        return
      }

      try {
        const response = await verifyEmail(token)
        if (!cancelled) {
          setMessage(response.message)
        }
      } catch (submitError) {
        if (!cancelled) {
          setError(getApiErrorMessage(submitError))
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    void runVerification()

    return () => {
      cancelled = true
    }
  }, [token])

  return (
    <AuthLayout>
      <h2 className="text-2xl font-bold text-dw-text">E-posta doğrulama</h2>
      <p className="mt-2 text-sm leading-relaxed text-dw-muted">
        E-posta adresiniz doğrulanıyor. Lütfen bekleyin.
      </p>

      {isLoading && (
        <div className="mt-6">
          <LoadingSpinner message="Doğrulama yapılıyor..." />
        </div>
      )}

      {!isLoading && message && (
        <div className="mt-6">
          <FormAlert message={message} variant="success" />
        </div>
      )}

      {!isLoading && error && (
        <div className="mt-6">
          <FormAlert message={error} />
        </div>
      )}

      {!isLoading && (
        <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-dw-muted">
          <Link to="/login" className="font-medium text-dw-primary">
            Giriş yap
          </Link>
          <Link to="/dashboard" className="font-medium text-dw-primary">
            Panele git
          </Link>
        </div>
      )}
    </AuthLayout>
  )
}
