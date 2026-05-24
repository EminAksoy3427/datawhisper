import { Link } from 'react-router-dom'
import { Navbar } from '@/components/Navbar'

const features = [
  {
    title: 'CSV Yükle',
    description:
      'Excel veya CSV dosyanızı yükleyin; satış ve stok verileriniz hazır olsun.',
  },
  {
    title: 'Türkçe Soru Sor',
    description:
      '“Bu ay en çok satan ürün hangisi?” gibi soruları doğal dilde sorun.',
  },
  {
    title: 'Grafik ve Öneri',
    description:
      'Yapay zeka özetleri, grafikler ve işletme sağlık skoru alın.',
  },
]

export function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-12 md:py-16">
        <section className="rounded-[var(--radius-dw)] border border-dw-border bg-dw-card p-8 text-center shadow-sm md:p-12">
          <p className="mb-3 text-sm font-medium uppercase tracking-wide text-dw-primary">
            Küçük işletmeler için yapay zeka asistanı
          </p>
          <h1 className="mb-4 text-3xl font-bold tracking-tight text-dw-text md:text-[32px]">
            Verinizi yükleyin, Türkçe sorun, içgörü alın
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-base text-dw-muted">
            DataWhisper; e-ticaret satıcıları ve küçük perakendeciler için
            CSV verilerinden özet, grafik ve öneriler sunar. Teknik bilgi
            gerekmez.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/register"
              className="rounded-[var(--radius-dw)] bg-dw-primary px-6 py-3 font-medium text-white hover:bg-blue-700"
            >
              Ücretsiz Başla
            </Link>
            <Link
              to="/login"
              className="rounded-[var(--radius-dw)] border border-dw-border bg-dw-bg px-6 py-3 font-medium text-dw-text hover:bg-white"
            >
              Giriş Yap
            </Link>
          </div>
        </section>

        <section className="mt-12 grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="rounded-[var(--radius-dw)] border border-dw-border bg-dw-card p-6 shadow-sm"
            >
              <h2 className="mb-2 text-lg font-semibold text-dw-text">
                {feature.title}
              </h2>
              <p className="text-sm leading-relaxed text-dw-muted">
                {feature.description}
              </p>
            </article>
          ))}
        </section>
      </main>

      <footer className="border-t border-dw-border py-6 text-center text-sm text-dw-muted">
        © {new Date().getFullYear()} DataWhisper
      </footer>
    </div>
  )
}
