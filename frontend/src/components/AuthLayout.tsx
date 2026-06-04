import { type ReactNode } from 'react'
import { Navbar } from '@/components/Navbar'

const AUTH_BENEFITS = [
  'CSV & Excel desteği',
  'Türkçe AI iş analisti',
  'İade ve kârlılık riskleri',
  'Teknik BI bilgisi gerekmez',
]

interface AuthLayoutProps {
  children: ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 bg-gradient-to-b from-white via-dw-bg to-dw-bg">
        <div className="mx-auto grid w-full min-w-0 max-w-[1200px] gap-8 px-4 py-8 sm:py-10 md:gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-12 lg:py-16">
          <div className="flex min-w-0 flex-col justify-center">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-dw-primary">
              <span
                aria-hidden
                className="h-1.5 w-1.5 rounded-full bg-dw-primary"
              />
              Yapay zekâ destekli iş analizi
            </span>

            <h1 className="mt-4 text-2xl font-bold tracking-tight text-dw-text md:text-3xl md:leading-tight">
              DataWhisper ile işletme verinizi daha hızlı anlayın
            </h1>

            <p className="mt-4 max-w-lg text-sm leading-relaxed text-dw-muted md:text-base">
              CSV veya Excel dosyanızı yükleyin, Türkçe sorular sorun, satış
              ve iade risklerini tek panelde görün.
            </p>

            <ul className="mt-6 space-y-3">
              {AUTH_BENEFITS.map((benefit) => (
                <li
                  key={benefit}
                  className="flex items-start gap-2.5 text-sm text-dw-text"
                >
                  <span
                    aria-hidden
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-xs font-semibold text-dw-secondary"
                  >
                    ✓
                  </span>
                  {benefit}
                </li>
              ))}
            </ul>

          
          </div>

          <div className="w-full min-w-0 lg:max-w-md lg:justify-self-end">
            <div className="rounded-[var(--radius-dw)] border border-dw-border bg-dw-card p-6 shadow-sm sm:p-8 md:shadow-md">
              {children}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
