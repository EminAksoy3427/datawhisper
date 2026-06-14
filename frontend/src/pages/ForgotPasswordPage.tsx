import { Link } from 'react-router-dom'
import { AuthLayout } from '@/components/AuthLayout'

export function ForgotPasswordPage() {
  return (
    <AuthLayout>
      <h2 className="text-2xl font-bold text-dw-text">Şifremi unuttum</h2>
      <p className="mt-6 text-sm leading-relaxed text-dw-muted">
        Şifre sıfırlama özelliği yakında aktif edilecektir. Şimdilik hesabınıza
        giriş yaparak demo verilerle ürünü deneyebilirsiniz.
      </p>

      <p className="mt-6 text-center text-sm text-dw-muted">
        <Link to="/login" className="font-medium text-dw-primary">
          Giriş sayfasına dön
        </Link>
      </p>
    </AuthLayout>
  )
}
