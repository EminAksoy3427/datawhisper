import { Link } from 'react-router-dom'
import { Navbar } from '@/components/Navbar'

const TRUST_BADGES = [
  'CSV & Excel desteği',
  'Türkçe soru-cevap',
  'Kod veya BI bilgisi gerekmez',
]

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Dosyanızı yükleyin',
    description:
      '.csv, .xlsx veya .xls dosyanızı sürükleyip bırakın. Sütun adlarını DataWhisper otomatik tanır.',
  },
  {
    step: '02',
    title: 'Türkçe sorun',
    description:
      '“İade oranı neden yükseliyor?” gibi günlük dilde sorular sorun, kod yazmanıza gerek yok.',
  },
  {
    step: '03',
    title: 'Aksiyon alın',
    description:
      'İş analisti tarzında özet, riskler ve önerilen aksiyonlarla işletmenizi yönetin.',
  },
]

const TARGET_USERS = [
  {
    title: 'E-ticaret satıcıları',
    description:
      'Trendyol, Hepsiburada veya kendi siteniz için satış ve iade verilerinizi anlamlandırın.',
  },
  {
    title: 'Butik üreticiler',
    description:
      'Üretim ve satış kayıtlarınızı tek bir özet panelde görüp karlılığa odaklanın.',
  },
  {
    title: 'Küçük perakendeciler',
    description:
      'Mağazanızın günlük Excel/CSV kayıtlarını dakikalar içinde içgörüye dönüştürün.',
  },
]

const BENEFITS = [
  {
    title: 'Excel karmaşasını azaltır',
    description:
      'Dağınık tablolar yerine net metrikler, grafikler ve kategori bazlı risk skorları.',
  },
  {
    title: 'İade ve kârlılık risklerini görünür yapar',
    description:
      'Hangi kategori veya ürünün marjı baskı altında? DataWhisper sayılarla gösterir.',
  },
  {
    title: 'Teknik bilgi gerektirmeden içgörü üretir',
    description:
      'BI tool öğrenmeden, formül yazmadan, Türkçe sorularla yapay zekâ desteği alın.',
  },
]

function PreviewBadge({
  label,
  className,
}: {
  label: string
  className: string
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${className}`}
    >
      {label}
    </span>
  )
}

function ProductPreview() {
  return (
    <div className="relative min-w-0">
      <div
        aria-hidden
        className="absolute inset-x-6 -bottom-3 h-6 rounded-full bg-blue-100/60 blur-2xl"
      />
      <div className="relative rounded-[var(--radius-dw)] border border-dw-border bg-dw-card p-5 shadow-lg">
        <div className="flex min-w-0 items-center justify-between gap-2 text-xs text-dw-muted">
          <div className="flex min-w-0 items-center gap-2">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[var(--radius-dw)] bg-dw-primary text-[11px] font-bold text-white">
              DW
            </span>
            <span className="truncate font-medium text-dw-text">
              DataWhisper · Panel
            </span>
          </div>
          <PreviewBadge
            label="Canlı önizleme"
            className="border-emerald-200 bg-emerald-50 text-dw-secondary"
          />
        </div>

        <div className="mt-5 rounded-[var(--radius-dw)] border border-emerald-200 bg-emerald-50 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-dw-muted">
                İşletme Sağlık Skoru
              </p>
              <p className="mt-1 text-3xl font-bold text-dw-secondary">
                85<span className="ml-1 text-base text-dw-muted">/ 100</span>
              </p>
            </div>
            <PreviewBadge
              label="Stabil"
              className="border-emerald-200 bg-white text-dw-secondary"
            />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-[var(--radius-dw)] border border-dw-border bg-dw-bg p-3">
            <p className="text-[11px] font-medium uppercase tracking-wide text-dw-muted">
              Toplam Gelir
            </p>
            <p className="mt-1 text-lg font-semibold text-dw-text">
              ₺202.250
            </p>
          </div>
          <div className="rounded-[var(--radius-dw)] border border-amber-200 bg-amber-50 p-3">
            <p className="text-[11px] font-medium uppercase tracking-wide text-dw-muted">
              İade Oranı
            </p>
            <p className="mt-1 text-lg font-semibold text-dw-warning">%11,8</p>
          </div>
        </div>

        <div className="mt-4 rounded-[var(--radius-dw)] border border-blue-200 bg-blue-50 p-4">
          <div className="flex items-center gap-2">
            <PreviewBadge
              label="AI Bulgu"
              className="border-blue-200 bg-white text-dw-primary"
            />
            <PreviewBadge
              label="Risk: Orta"
              className="border-amber-200 bg-white text-dw-warning"
            />
          </div>
          <p className="mt-2 text-sm leading-relaxed text-dw-text">
            İade riski <span className="font-semibold">Giyim</span>{' '}
            kategorisinde yoğunlaşıyor.
          </p>
        </div>
      </div>
    </div>
  )
}

function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description: string
}) {
  return (
    <div className="mb-8 max-w-2xl">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-dw-primary">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-2xl font-bold text-dw-text md:text-[28px]">
        {title}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-dw-muted">{description}</p>
    </div>
  )
}

export function LandingPage() {
  return (
    <div className="flex min-h-screen min-w-0 flex-col overflow-x-hidden">
      <Navbar />

      <main className="flex-1">
        <section className="border-b border-dw-border bg-gradient-to-b from-white via-dw-bg to-dw-bg">
          <div className="mx-auto grid w-full min-w-0 max-w-[1200px] gap-10 px-4 py-10 sm:py-12 md:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="min-w-0">
              <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-dw-primary">
                <span
                  aria-hidden
                  className="h-1.5 w-1.5 rounded-full bg-dw-primary"
                />
                Yapay zekâ destekli iş analizi
              </span>

              <h1 className="mt-4 text-[1.65rem] font-bold leading-tight tracking-tight text-dw-text sm:text-3xl md:text-[44px] md:leading-[1.1]">
                Küçük işletmeniz için Türkçe AI iş analisti
              </h1>

              <p className="mt-5 max-w-xl text-base leading-relaxed text-dw-muted md:text-lg">
                CSV veya Excel dosyanızı yükleyin. DataWhisper satış, iade ve
                kârlılık verilerinizi özetler; riskleri ve aksiyon önerilerini
                Türkçe açıklar.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link
                  to="/register"
                  className="rounded-[var(--radius-dw)] bg-dw-primary px-6 py-3 font-medium text-white shadow-sm transition hover:bg-blue-700"
                >
                  Ücretsiz Başla
                </Link>
                <Link
                  to="/login"
                  className="rounded-[var(--radius-dw)] border border-dw-border bg-dw-card px-6 py-3 font-medium text-dw-text transition hover:bg-white"
                >
                  Giriş Yap
                </Link>
              </div>

              <ul className="mt-6 flex flex-wrap gap-2">
                {TRUST_BADGES.map((badge) => (
                  <li
                    key={badge}
                    className="inline-flex items-center gap-1.5 rounded-full border border-dw-border bg-dw-card px-3 py-1 text-xs text-dw-muted"
                  >
                    <span
                      aria-hidden
                      className="text-dw-secondary"
                    >
                      ✓
                    </span>
                    {badge}
                  </li>
                ))}
              </ul>
            </div>

            <ProductPreview />
          </div>
        </section>

        <section className="border-b border-dw-border bg-white">
          <div className="mx-auto w-full max-w-[1200px] px-4 py-16">
            <SectionHeader
              eyebrow="Nasıl çalışır?"
              title="Üç adımda işletme analizinize başlayın"
              description="Karmaşık kurulum yok. Dosyanızı yükledikten birkaç saniye sonra ilk içgörünüzü alırsınız."
            />
            <ol className="grid gap-4 md:grid-cols-3">
              {HOW_IT_WORKS.map((item) => (
                <li
                  key={item.step}
                  className="rounded-[var(--radius-dw)] border border-dw-border bg-dw-card p-6 shadow-sm"
                >
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-[var(--radius-dw)] bg-blue-50 text-sm font-semibold text-dw-primary">
                    {item.step}
                  </span>
                  <h3 className="mt-4 text-base font-semibold text-dw-text">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-dw-muted">
                    {item.description}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="border-b border-dw-border bg-dw-bg">
          <div className="mx-auto w-full max-w-[1200px] px-4 py-16">
            <SectionHeader
              eyebrow="Kimler için?"
              title="Excel ve CSV kullanan KOBİ’ler için tasarlandı"
              description="DataWhisper, teknik ekibi olmayan küçük işletmelerin günlük kararlarını veriyle desteklemesi için yapıldı."
            />
            <div className="grid gap-4 md:grid-cols-3">
              {TARGET_USERS.map((user) => (
                <article
                  key={user.title}
                  className="rounded-[var(--radius-dw)] border border-dw-border bg-dw-card p-6 shadow-sm"
                >
                  <h3 className="text-base font-semibold text-dw-text">
                    {user.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-dw-muted">
                    {user.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-dw-border bg-white">
          <div className="mx-auto w-full max-w-[1200px] px-4 py-16">
            <SectionHeader
              eyebrow="Neden DataWhisper?"
              title="Veriyi anlamak için BI uzmanı olmanıza gerek yok"
              description="Açık, somut ve uygulanabilir analiz. Genel-geçer öğütler yerine işletmenize özgü sayılarla konuşur."
            />
            <div className="grid gap-4 md:grid-cols-3">
              {BENEFITS.map((benefit) => (
                <article
                  key={benefit.title}
                  className="rounded-[var(--radius-dw)] border border-dw-border bg-dw-card p-6 shadow-sm"
                >
                  <h3 className="text-base font-semibold text-dw-text">
                    {benefit.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-dw-muted">
                    {benefit.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-dw-bg">
          <div className="mx-auto w-full max-w-[1200px] px-4 py-14">
            <div className="flex flex-col items-start justify-between gap-6 rounded-[var(--radius-dw)] border border-dw-border bg-dw-card p-8 shadow-sm md:flex-row md:items-center">
              <div className="max-w-xl">
                <h2 className="text-xl font-semibold text-dw-text md:text-2xl">
                  İşletme verinizi 5 dakikada içgörüye çevirin
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-dw-muted">
                  Ücretsiz hesap oluşturun; demo veriyle hemen deneyebilir,
                  sonra kendi CSV/Excel dosyanızı yükleyebilirsiniz.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  to="/register"
                  className="rounded-[var(--radius-dw)] bg-dw-primary px-6 py-3 font-medium text-white shadow-sm transition hover:bg-blue-700"
                >
                  Ücretsiz Başla
                </Link>
                <Link
                  to="/login"
                  className="rounded-[var(--radius-dw)] border border-dw-border bg-dw-bg px-6 py-3 font-medium text-dw-text transition hover:bg-white"
                >
                  Giriş Yap
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-dw-border bg-white py-6 text-center text-sm text-dw-muted">
        © {new Date().getFullYear()} DataWhisper — Yapay Zeka Destekli İş
        Analizi Platformu
      </footer>
    </div>
  )
}
