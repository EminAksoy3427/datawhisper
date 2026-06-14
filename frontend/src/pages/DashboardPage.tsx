import { useRef, useState } from 'react'
import { askQuestion } from '@/api/analysis'
import { fetchDemoData, uploadCsv } from '@/api/data'
import type { AnalysisResponse } from '@/api/types/analysis'
import type { BusinessSummary } from '@/api/types/data'
import { AnalysisStatusCard } from '@/components/AnalysisStatusCard'
import { ChartCard } from '@/components/ChartCard'
import { DataUnderstandingCard } from '@/components/DataUnderstandingCard'
import { EmptyState } from '@/components/EmptyState'
import { ExecutiveSummaryCard } from '@/components/ExecutiveSummaryCard'
import { FormAlert } from '@/components/FormAlert'
import { InsightCard } from '@/components/InsightCard'
import { HealthScoreCard } from '@/components/HealthScoreCard'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { MetricCard } from '@/components/MetricCard'
import { Navbar } from '@/components/Navbar'
import { QuestionBox } from '@/components/QuestionBox'
import { useAuth } from '@/context/AuthContext'
import { getApiErrorMessage } from '@/lib/apiError'
import {
  getCategoryRisk,
  getCategoryRiskBadgeClass,
} from '@/lib/categoryRisk'
import {
  getReturnChartEmptyMessage,
  getRevenueChartEmptyMessage,
} from '@/lib/chartEmptyMessages'
import { formatCurrency, formatNumber, formatPercent } from '@/lib/format'

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
  const [lastLoadWasUpload, setLastLoadWasUpload] = useState(false)

  async function handleLoadDemo() {
    setIsLoadingData(true)
    setDataError(null)

    try {
      const summary = await fetchDemoData()
      setBusinessSummary(summary)
      setLastLoadWasUpload(false)
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
      setLastLoadWasUpload(true)
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
    <div className="flex min-h-screen min-w-0 flex-col overflow-x-hidden">
      <Navbar />

      <main className="mx-auto w-full min-w-0 max-w-[1200px] flex-1 px-4 py-6 sm:py-8">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-dw-text sm:text-[28px] md:text-[32px]">
            İşletme Paneli
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-dw-muted">
            Merhaba {user?.name}. Önce iş verinizi yükleyin, ardından metrikleri
            ve grafikleri inceleyin. İsterseniz Türkçe bir soru sorarak yapay
            zekâdan öneri alın.
          </p>
        </header>

        {/* EmailVerificationNotice: enable after Resend domain is verified and live email delivery is configured. */}

        <section className="mb-8 min-w-0 rounded-[var(--radius-dw)] border border-dw-border bg-dw-card p-4 shadow-sm sm:p-6">
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
                40 satırlık sentetik e-ticaret örneği: 8 kategori, kanal ve bölge
                kırılımları. Hızlıca uygulamayı denemek için idealdir; giriş
                yapmadan da kullanılabilir.
              </p>
              <button
                type="button"
                onClick={() => void handleLoadDemo()}
                disabled={isLoadingData}
                className="mt-4 w-full rounded-[var(--radius-dw)] bg-dw-secondary px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
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
                className="mt-4 w-full rounded-[var(--radius-dw)] border border-dw-border bg-dw-card px-4 py-2 text-sm font-medium text-dw-text hover:bg-white disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
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

          {businessSummary && !isLoadingData && lastLoadWasUpload && (
            <p className="mt-4 rounded-[var(--radius-dw)] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-relaxed text-dw-text">
              Dosya başarıyla analiz edildi. DataWhisper güvenli algıladığı
              alanlarla metrikleri oluşturdu.
            </p>
          )}
        </section>

        {businessSummary && !isLoadingData && (
          <>
            <section className="mb-8 grid min-w-0 gap-4 lg:grid-cols-2">
              <AnalysisStatusCard summary={businessSummary} />
              <ExecutiveSummaryCard summary={businessSummary} />
            </section>
            <section className="mb-8 min-w-0">
              <DataUnderstandingCard summary={businessSummary} />
            </section>
          </>
        )}

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
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead>
                  <tr className="border-b border-dw-border text-dw-muted">
                    <th className="pb-2 pr-4 font-medium">Kategori</th>
                    <th className="pb-2 pr-4 font-medium">Gelir</th>
                    <th className="pb-2 pr-4 font-medium">Kar</th>
                    <th className="pb-2 pr-4 font-medium">Satış</th>
                    <th className="pb-2 pr-4 font-medium">İade</th>
                    <th className="pb-2 font-medium">İade Riski</th>
                  </tr>
                </thead>
                <tbody>
                  {businessSummary.category_summary.map((category) => {
                    const risk = getCategoryRisk(category)
                    return (
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
                        <td className="py-2 pr-4 text-dw-muted">
                          {formatNumber(category.return_quantity)}
                        </td>
                        <td className="py-2">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium ${getCategoryRiskBadgeClass(risk.level)}`}
                          >
                            {risk.label}
                            {risk.rate !== null && (
                              <span className="font-normal opacity-80">
                                · {formatPercent(risk.rate)}
                              </span>
                            )}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
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
          <div className="grid min-w-0 gap-6 lg:grid-cols-2">
            <div className="min-w-0">
            <ChartCard
              title="En Yüksek Gelirli Ürünler"
              description="Satış gelirine göre ilk 5 ürün."
              data={revenueChartData}
              valueLabel="Gelir"
              emptyMessage={getRevenueChartEmptyMessage(businessSummary)}
            />
            </div>
            <div className="min-w-0">
            <ChartCard
              title="En Çok İade Edilen Ürünler"
              description="İade adedine göre ilk 5 ürün."
              data={returnChartData}
              valueLabel="İade adedi"
              formatValueAsCurrency={false}
              emptyMessage={getReturnChartEmptyMessage(businessSummary)}
            />
            </div>
          </div>
        </section>

        <section className="min-w-0">
          <h2 className="mb-1 text-lg font-semibold text-dw-text">
            5. AI İş Analisti
          </h2>
          <p className="mb-4 text-sm text-dw-muted">
            Sorunuzu soldan iletin; yapılandırılmış analiz raporu sağda
            görünür.
          </p>
          <div className="grid min-w-0 gap-6 lg:grid-cols-2 lg:items-stretch">
            <div className="min-w-0">
            <QuestionBox
              summary={businessSummary}
              question={question}
              onQuestionChange={setQuestion}
              onExampleSelect={() => setAnalysisError(null)}
              onSubmit={() => void handleAskQuestion()}
              isLoading={isAsking}
              disabled={!businessSummary || isLoadingData}
              errorMessage={analysisError}
            />
            </div>
            <div className="min-w-0">
            <InsightCard
              analysis={analysis}
              isLoading={isAsking}
              onFollowUpClick={(followUp) => {
                setQuestion(followUp)
                setAnalysisError(null)
              }}
            />
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
