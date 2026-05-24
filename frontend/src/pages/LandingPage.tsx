import { Link } from 'react-router-dom'
import { Navbar } from '@/components/Navbar'

const features = [
  {
    title: 'CSV veya demo veri',
    description:
      'Kendi satış dosyanızı yükleyin veya hazır KOBİ örnek verisiyle hemen başlayın.',
  },
  {
    title: 'Türkçe soru sorun',
    description:
      '“Hangi ürün en çok gelir getiriyor?” gibi günlük dilde iş soruları sorun.',
  },
  {
    title: 'Özet, grafik ve skor',
    description:
      'Metrikler, grafikler, yapay zekâ önerileri ve işletme sağlık skoru tek panelde.',
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
            CSV verinizi yükleyin, Türkçe sorun, içgörü alın
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-base leading-relaxed text-dw-muted">
            DataWhisper; e-ticaret satıcıları, butik üreticiler ve küçük
            perakendeciler için tasarlandı. Excel/CSV dosyanızdan özet metrikler,
            grafikler ve yapay zekâ destekli öneriler alın — teknik bilgi gerekmez.
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
        © {new Date().getFullYear()} DataWhisper — Bootcamp MVP
      </footer>
    </div>
  )
}
