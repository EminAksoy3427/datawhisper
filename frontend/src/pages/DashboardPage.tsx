import { useRef, useState } from 'react'
import { askQuestion } from '@/api/analysis'
import { fetchDemoData, uploadCsv } from '@/api/data'
import type { AnalysisResponse } from '@/api/types/analysis'
import type { BusinessSummary } from '@/api/types/data'
import { ChartCard } from '@/components/ChartCard'
import { EmptyState } from '@/components/EmptyState'
import { FormAlert } from '@/components/FormAlert'
import { InsightCard } from '@/components/InsightCard'
import { HealthScoreCard } from '@/components/HealthScoreCard'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { MetricCard } from '@/components/MetricCard'
import { Navbar } from '@/components/Navbar'
import { QuestionBox } from '@/components/QuestionBox'
import { useAuth } from '@/context/AuthContext'
import { getApiErrorMessage } from '@/lib/apiError'
import { formatCurrency, formatNumber, formatPercent } from '@/lib/format'
import { getColumnLabel } from '@/lib/labels'

const ACCEPTED_FILE_TYPES = '.csv,.xlsx,.xls'

export function DashboardPage() {
  const { user } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [businessSummary, setBusinessSummary] = useState<BusinessSummary | null>(
    null,
  )
  const [isLoadingData, setIsLoadingData] = useState(false)
  const [dataError, setDataError] = useState<string | null>(null)

  const [question, setQuestion] = useState('')
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null)
  const [isAsking, setIsAsking] = useState(false)
  const [analysisError, setAnalysisError] = useState<string | null>(null)

  async function handleLoadDemo() {
    setIsLoadingData(true)
    setDataError(null)

    try {
      const summary = await fetchDemoData()
      setBusinessSummary(summary)
      setAnalysis(null)
      setAnalysisError(null)
    } catch (error) {
      setDataError(getApiErrorMessage(error))
    } finally {
      setIsLoadingData(false)
    }
  }

  async function handleCsvUpload(file: File) {
    setIsLoadingData(true)
    setDataError(null)

    try {
      const summary = await uploadCsv(file)
      setBusinessSummary(summary)
      setAnalysis(null)
      setAnalysisError(null)
    } catch (error) {
      setDataError(getApiErrorMessage(error))
    } finally {
      setIsLoadingData(false)
    }
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (file) {
      void handleCsvUpload(file)
    }
    event.target.value = ''
  }

  async function handleAskQuestion() {
    if (!businessSummary) {
      return
    }

    const trimmedQuestion = question.trim()
    if (trimmedQuestion.length < 3) {
      setAnalysisError('Sorunuz en az 3 karakter olmalıdır.')
      return
    }

    setIsAsking(true)
    setAnalysisError(null)

    try {
      const response = await askQuestion({
        question: trimmedQuestion,
        business_summary: businessSummary,
      })
      setAnalysis(response)
    } catch (error) {
      setAnalysis(null)
      setAnalysisError(getApiErrorMessage(error))
    } finally {
      setIsAsking(false)
    }
  }

  const metrics = businessSummary?.metrics
  const revenueChartData =
    businessSummary?.top_revenue_products.map((product) => ({
      name: product.product_name,
      value: product.revenue,
    })) ?? []
  const returnChartData =
    businessSummary?.top_returned_products.map((product) => ({
      name: product.product_name,
      value: product.return_quantity,
    })) ?? []

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-8">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-dw-text md:text-[32px]">
            İşletme Paneli
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-dw-muted">
            Merhaba {user?.name}. Önce iş verinizi yükleyin, ardından metrikleri
            ve grafikleri inceleyin. İsterseniz Türkçe bir soru sorarak yapay
            zekâdan öneri alın.
          </p>
        </header>

        <section className="mb-8 rounded-[var(--radius-dw)] border border-dw-border bg-dw-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-dw-text">1. Veriyi Yükleyin</h2>
          <p className="mt-1 text-sm text-dw-muted">
            Analiz için demo veriyi kullanabilir veya kendi CSV / Excel
            dosyanızı yükleyebilirsiniz.
          </p>

          {dataError && (
            <div className="mt-4">
              <FormAlert message={dataError} />
            </div>
          )}

          {isLoadingData && (
            <div className="mt-4">
              <LoadingSpinner message="Veriler analiz ediliyor..." />
            </div>
          )}

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-[var(--radius-dw)] border border-dw-border bg-dw-bg p-4">
              <h3 className="font-medium text-dw-text">Demo veri</h3>
              <p className="mt-2 text-sm leading-relaxed text-dw-muted">
                Hazır KOBİ örnek verisi: giyim, aksesuar ve ev ürünleri satış
                kayıtları. Hızlıca uygulamayı denemek için idealdir; giriş
                yapmadan da kullanılabilir.
              </p>
              <button
                type="button"
                onClick={() => void handleLoadDemo()}
                disabled={isLoadingData}
                className="mt-4 rounded-[var(--radius-dw)] bg-dw-secondary px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoadingData ? 'Yükleniyor...' : 'Demo Veriyi Yükle'}
              </button>
            </div>

            <div className="rounded-[var(--radius-dw)] border border-dw-border bg-dw-bg p-4">
              <h3 className="font-medium text-dw-text">
                Kendi CSV veya Excel dosyanız
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-dw-muted">
                .csv, .xlsx veya .xls uzantılı bir dosya yükleyin. DataWhisper
                sütun adlarınızı otomatik olarak anlamaya çalışır; Türkçe ya da
                İngilizce başlıklar (ör. <em>Ürün Adı</em>, <em>Ciro</em>,{' '}
                <em>Maliyet</em>) sorun çıkarmaz. Yükleme için giriş yapmış
                olmanız gerekir.
              </p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoadingData}
                className="mt-4 rounded-[var(--radius-dw)] border border-dw-border bg-dw-card px-4 py-2 text-sm font-medium text-dw-text hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoadingData ? 'Yükleniyor...' : 'Dosya Seç (CSV / Excel)'}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept={ACCEPTED_FILE_TYPES}
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </div>

          {businessSummary && !isLoadingData && (
            <div className="mt-4 space-y-3">
              <p className="text-sm font-medium text-dw-secondary">
                ✓ {formatNumber(businessSummary.row_count)} satır başarıyla
                analiz edildi.
              </p>

              {businessSummary.detected_columns &&
                Object.keys(businessSummary.detected_columns).length > 0 && (
                  <div className="rounded-[var(--radius-dw)] border border-dw-border bg-dw-bg p-4">
                    <p className="text-sm font-medium text-dw-text">
                      Otomatik tanınan sütunlar
                    </p>
                    <ul className="mt-2 flex flex-wrap gap-2">
                      {Object.entries(businessSummary.detected_columns).map(
                        ([canonical, original]) => (
                          <li
                            key={canonical}
                            className="rounded-full border border-dw-border bg-dw-card px-3 py-1 text-xs text-dw-text"
                          >
                            <span className="font-medium">
                              {getColumnLabel(canonical)}
                            </span>
                            <span className="text-dw-muted">
                              {' '}
                              ← {original}
                            </span>
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                )}

              {businessSummary.missing_capabilities &&
                businessSummary.missing_capabilities.length > 0 && (
                  <div className="rounded-[var(--radius-dw)] border border-amber-200 bg-amber-50 p-4">
                    <p className="text-sm font-medium text-amber-900">
                      Bazı analizler atlandı
                    </p>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-amber-900">
                      {businessSummary.missing_capabilities.map((message) => (
                        <li key={message}>{message}</li>
                      ))}
                    </ul>
                  </div>
                )}
            </div>
          )}
        </section>

        <section className="mb-8">
          <h2 className="mb-1 text-lg font-semibold text-dw-text">
            2. İş Metrikleri
          </h2>
          <p className="mb-4 text-sm text-dw-muted">
            Gelir, kar ve iade oranınızın özeti.
          </p>
          {!businessSummary ? (
            <EmptyState
              title="Henüz veri yok"
              description="Metrikleri görmek için yukarıdan demo veriyi yükleyin veya CSV / Excel dosyanızı seçin."
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <MetricCard
                label="Toplam Gelir"
                value={formatCurrency(metrics!.total_revenue)}
              />
              <MetricCard
                label="Tahmini Kar"
                value={formatCurrency(metrics!.estimated_profit)}
                tone="success"
              />
              <MetricCard
                label="İade Oranı"
                value={formatPercent(metrics!.return_rate)}
                tone="warning"
              />
              <MetricCard
                label="Kar Marjı"
                value={formatPercent(metrics!.profit_margin)}
                tone="primary"
              />
            </div>
          )}
        </section>

        {businessSummary ? (
          <section className="mb-8">
            <h2 className="mb-4 text-lg font-semibold text-dw-text">
              İşletme Sağlık Skoru
            </h2>
            <HealthScoreCard summary={businessSummary} />
          </section>
        ) : (
          <section className="mb-8">
            <h2 className="mb-4 text-lg font-semibold text-dw-text">
              İşletme Sağlık Skoru
            </h2>
            <EmptyState description="Sağlık skoru, veri yükledikten sonra otomatik hesaplanır." />
          </section>
        )}

        <section className="mb-8">
          <h2 className="mb-1 text-lg font-semibold text-dw-text">
            3. Kategori Özeti
          </h2>
          <p className="mb-4 text-sm text-dw-muted">
            Ürün kategorilerine göre gelir, kar ve iade dağılımı.
          </p>
          {!businessSummary ? (
            <EmptyState description="Kategori tablosu veri yükledikten sonra görünür." />
          ) : businessSummary.category_summary.length === 0 ? (
            <EmptyState description="Bu veri setinde kategori özeti bulunamadı." />
          ) : (
            <div className="overflow-x-auto rounded-[var(--radius-dw)] border border-dw-border bg-dw-card p-6 shadow-sm">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="border-b border-dw-border text-dw-muted">
                    <th className="pb-2 pr-4 font-medium">Kategori</th>
                    <th className="pb-2 pr-4 font-medium">Gelir</th>
                    <th className="pb-2 pr-4 font-medium">Kar</th>
                    <th className="pb-2 pr-4 font-medium">Satış</th>
                    <th className="pb-2 font-medium">İade</th>
                  </tr>
                </thead>
                <tbody>
                  {businessSummary.category_summary.map((category) => (
                    <tr
                      key={category.category}
                      className="border-b border-dw-border last:border-0"
                    >
                      <td className="py-2 pr-4 text-dw-text">
                        {category.category}
                      </td>
                      <td className="py-2 pr-4 text-dw-muted">
                        {formatCurrency(category.revenue)}
                      </td>
                      <td className="py-2 pr-4 text-dw-muted">
                        {formatCurrency(category.estimated_profit)}
                      </td>
                      <td className="py-2 pr-4 text-dw-muted">
                        {formatNumber(category.sales_quantity)}
                      </td>
                      <td className="py-2 text-dw-muted">
                        {formatNumber(category.return_quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="mb-8">
          <h2 className="mb-1 text-lg font-semibold text-dw-text">4. Grafikler</h2>
          <p className="mb-4 text-sm text-dw-muted">
            En çok gelir getiren ve en çok iade edilen ürünler.
          </p>
          <div className="grid gap-6 lg:grid-cols-2">
            <ChartCard
              title="En Yüksek Gelirli Ürünler"
              description="Satış gelirine göre ilk 5 ürün."
              data={revenueChartData}
              valueLabel="Gelir"
              emptyMessage="Grafik için önce veri yükleyin."
            />
            <ChartCard
              title="En Çok İade Edilen Ürünler"
              description="İade adedine göre ilk 5 ürün."
              data={returnChartData}
              valueLabel="İade adedi"
              formatValueAsCurrency={false}
              emptyMessage="Grafik için önce veri yükleyin."
            />
          </div>
        </section>

        <section>
          <h2 className="mb-1 text-lg font-semibold text-dw-text">
            5. Soru ve Yapay Zeka
          </h2>
          <p className="mb-4 text-sm text-dw-muted">
            Verilerinize dayalı Türkçe sorular sorun; yanıtlar sağ tarafta
            görünür.
          </p>
          <div className="grid gap-6 lg:grid-cols-2">
            <QuestionBox
              question={question}
              onQuestionChange={setQuestion}
              onSubmit={() => void handleAskQuestion()}
              isLoading={isAsking}
              disabled={!businessSummary || isLoadingData}
              warningMessage={
                !businessSummary
                  ? 'Soru gönderebilmek için önce demo veri yükleyin veya CSV / Excel dosyanızı analiz edin.'
                  : null
              }
              errorMessage={analysisError}
            />
            <InsightCard
              analysis={analysis}
              isLoading={isAsking}
              onFollowUpClick={(followUp) => {
                setQuestion(followUp)
                setAnalysisError(null)
              }}
            />
          </div>
        </section>
      </main>
    </div>
  )
}
