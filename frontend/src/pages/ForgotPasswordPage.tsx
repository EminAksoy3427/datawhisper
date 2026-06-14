import { Link } from 'react-router-dom'
import { AuthLayout } from '@/components/AuthLayout'
import { FormAlert } from '@/components/FormAlert'

const MVP_NOTICE =
  'Şifre sıfırlama altyapısı hazırdır. Canlı e-posta gönderimi özel domain doğrulaması tamamlandıktan sonra aktif edilecektir.'

export function ForgotPasswordPage() {
  return (
    <AuthLayout>
      <h2 className="text-2xl font-bold text-dw-text">Şifremi unuttum</h2>
      <p className="mt-2 text-sm leading-relaxed text-dw-muted">
        Şifrenizi sıfırlamak için e-posta gönderimi henüz canlı ortamda
        etkin değildir.
      </p>

      <div className="mt-6">
        <FormAlert message={MVP_NOTICE} variant="info" />
      </div>

      <p className="mt-6 text-center text-sm text-dw-muted">
        <Link to="/login" className="font-medium text-dw-primary">
          Giriş sayfasına dön
        </Link>
      </p>
    </AuthLayout>
  )
}
