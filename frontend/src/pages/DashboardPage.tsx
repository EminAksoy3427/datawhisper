import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Navbar } from '@/components/Navbar'
import { useAuth } from '@/context/AuthContext'

const sampleChartData = [
  { month: 'Oca', sales: 4200 },
  { month: 'Şub', sales: 5100 },
  { month: 'Mar', sales: 4800 },
  { month: 'Nis', sales: 6200 },
]

const metrics = [
  { label: 'Toplam Gelir', value: '₺24.500', tone: 'text-dw-text' },
  { label: 'Kar', value: '₺6.200', tone: 'text-dw-secondary' },
  { label: 'İade Oranı', value: '%3,2', tone: 'text-dw-warning' },
  { label: 'Sağlık Skoru', value: '78 / 100', tone: 'text-dw-primary' },
]

export function DashboardPage() {
  const { user } = useAuth()

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-dw-text md:text-[32px]">
            İşletme Paneli
          </h1>
          <p className="mt-1 text-sm text-dw-muted">
            Hoş geldiniz, {user?.name}. Örnek veriler — CSV ve yapay zeka
            analizi yakında bağlanacak.
          </p>
        </div>

        <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => (
            <article
              key={metric.label}
              className="rounded-[var(--radius-dw)] border border-dw-border bg-dw-card p-5 shadow-sm"
            >
              <p className="text-sm text-dw-muted">{metric.label}</p>
              <p className={`mt-2 text-xl font-semibold ${metric.tone}`}>
                {metric.value}
              </p>
            </article>
          ))}
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-[var(--radius-dw)] border border-dw-border bg-dw-card p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-dw-text">
              Veri Yükleme
            </h2>
            <p className="mb-4 text-sm text-dw-muted">
              CSV dosyanızı yükleyin veya demo veriyi kullanın.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                className="rounded-[var(--radius-dw)] border border-dw-border bg-dw-bg px-4 py-2 text-sm font-medium text-dw-text"
              >
                CSV Seç (yakında)
              </button>
              <button
                type="button"
                className="rounded-[var(--radius-dw)] bg-dw-secondary px-4 py-2 text-sm font-medium text-white"
              >
                Demo Veri (yakında)
              </button>
            </div>
          </section>

          <section className="rounded-[var(--radius-dw)] border border-dw-border bg-dw-card p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-dw-text">
              Soru Sor
            </h2>
            <textarea
              rows={3}
              placeholder="Örn: Bu ay en çok satan ürün hangisi?"
              className="mb-3 w-full resize-none rounded-[var(--radius-dw)] border border-dw-border px-3 py-2 text-sm outline-none focus:border-dw-primary focus:ring-2 focus:ring-blue-100"
              readOnly
            />
            <button
              type="button"
              className="rounded-[var(--radius-dw)] bg-dw-primary px-4 py-2 text-sm font-medium text-white"
            >
              Analiz Et (yakında)
            </button>
          </section>

          <section className="rounded-[var(--radius-dw)] border border-dw-border bg-dw-card p-6 shadow-sm lg:col-span-2">
            <h2 className="mb-4 text-lg font-semibold text-dw-text">
              Aylık Satış (örnek grafik)
            </h2>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sampleChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar
                    dataKey="sales"
                    name="Satış"
                    fill="#2563eb"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="rounded-[var(--radius-dw)] border border-dw-border bg-dw-card p-6 shadow-sm lg:col-span-2">
            <h2 className="mb-2 text-lg font-semibold text-dw-text">
              Yapay Zeka Özeti
            </h2>
            <p className="text-sm leading-relaxed text-dw-muted">
              Veri yükledikten ve soru sorduktan sonra Türkçe özet, öneri ve
              risk seviyesi burada görünecek.
            </p>
          </section>
        </div>
      </main>
    </div>
  )
}
