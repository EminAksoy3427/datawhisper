import { Link } from 'react-router-dom'
import { Navbar } from '@/components/Navbar'

export function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="mx-auto flex w-full max-w-[1200px] flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-[var(--radius-dw)] border border-dw-border bg-dw-card p-8 shadow-sm">
          <h1 className="mb-2 text-2xl font-bold text-dw-text">Kayıt Ol</h1>
          <p className="mb-6 text-sm text-dw-muted">
            Yeni hesap oluşturun. (Bağlantı yakında eklenecek.)
          </p>

          <form
            className="space-y-4"
            onSubmit={(event) => event.preventDefault()}
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
                placeholder="Adınız Soyadınız"
                className="w-full rounded-[var(--radius-dw)] border border-dw-border px-3 py-2 text-sm outline-none focus:border-dw-primary focus:ring-2 focus:ring-blue-100"
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
                placeholder="ornek@isletme.com"
                className="w-full rounded-[var(--radius-dw)] border border-dw-border px-3 py-2 text-sm outline-none focus:border-dw-primary focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div>
              <label
                htmlFor="register-password"
                className="mb-1 block text-sm font-medium text-dw-text"
              >
                Şifre
              </label>
              <input
                id="register-password"
                type="password"
                placeholder="En az 8 karakter"
                className="w-full rounded-[var(--radius-dw)] border border-dw-border px-3 py-2 text-sm outline-none focus:border-dw-primary focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-[var(--radius-dw)] bg-dw-primary py-2.5 text-sm font-medium text-white hover:bg-blue-700"
            >
              Hesap Oluştur
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-dw-muted">
            Zaten hesabınız var mı?{' '}
            <Link to="/login" className="font-medium text-dw-primary">
              Giriş yapın
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}
