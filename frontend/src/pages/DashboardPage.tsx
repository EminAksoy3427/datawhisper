import { useRef, useState } from 'react'
import { askQuestion } from '@/api/analysis'
import { fetchDemoData, uploadCsv } from '@/api/data'
import type { AnalysisResponse } from '@/api/types/analysis'
import type { BusinessSummary } from '@/api/types/data'
import { ChartCard } from '@/components/ChartCard'
import { FormAlert } from '@/components/FormAlert'
import { InsightCard } from '@/components/InsightCard'
import { MetricCard } from '@/components/MetricCard'
import { Navbar } from '@/components/Navbar'
import { QuestionBox } from '@/components/QuestionBox'
import { useAuth } from '@/context/AuthContext'
import { getApiErrorMessage } from '@/lib/apiError'
import { formatCurrency, formatNumber, formatPercent } from '@/lib/format'

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
      setAnalysisError('Lütfen en az 3 karakterlik bir soru yazın.')
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
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-dw-text md:text-[32px]">
            İşletme Paneli
          </h1>
          <p className="mt-1 text-sm text-dw-muted">
            Hoş geldiniz, {user?.name}. Demo veriyi yükleyin veya CSV
            dosyanızı analiz edin.
          </p>
        </div>

        <section className="mb-8 rounded-[var(--radius-dw)] border border-dw-border bg-dw-card p-6 shadow-sm">
          <h2 className="mb-2 text-lg font-semibold text-dw-text">Veri Kaynağı</h2>
          <p className="mb-4 text-sm text-dw-muted">
            Analiz için önce veri yükleyin. Demo veri herkese açıktır; CSV
            yüklemek için giriş yapmanız gerekir.
          </p>

          {dataError && (
            <div className="mb-4">
              <FormAlert message={dataError} />
            </div>
          )}

          {isLoadingData && (
            <p className="mb-4 flex items-center gap-2 text-sm text-dw-muted">
              <span
                className="h-4 w-4 animate-spin rounded-full border-2 border-dw-border border-t-dw-primary"
                aria-hidden
              />
              Veriler yükleniyor...
            </p>
          )}

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => void handleLoadDemo()}
              disabled={isLoadingData}
              className="rounded-[var(--radius-dw)] bg-dw-secondary px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Demo Veriyi Yükle
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoadingData}
              className="rounded-[var(--radius-dw)] border border-dw-border bg-dw-bg px-4 py-2 text-sm font-medium text-dw-text hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              CSV Dosyası Yükle
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {businessSummary && (
            <p className="mt-4 text-sm text-dw-secondary">
              {formatNumber(businessSummary.row_count)} satır analiz edildi.
            </p>
          )}
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-lg font-semibold text-dw-text">
            İş Metrikleri
          </h2>
          {!businessSummary ? (
            <p className="text-sm text-dw-muted">
              Metrikleri görmek için önce veri yükleyin.
            </p>
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

        {businessSummary && businessSummary.category_summary.length > 0 && (
          <section className="mb-8 overflow-x-auto rounded-[var(--radius-dw)] border border-dw-border bg-dw-card p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-dw-text">
              Kategori Özeti
            </h2>
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
                    <td className="py-2 pr-4 text-dw-text">{category.category}</td>
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
          </section>
        )}

        <section className="mb-8 grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="En Yüksek Gelirli Ürünler"
            data={revenueChartData}
            valueLabel="Gelir"
            emptyMessage="Veri yükleyince grafik burada görünecek."
          />
          <ChartCard
            title="En Çok İade Edilen Ürünler"
            data={returnChartData}
            valueLabel="İade adedi"
            emptyMessage="Veri yükleyince grafik burada görünecek."
          />
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <QuestionBox
            question={question}
            onQuestionChange={setQuestion}
            onSubmit={() => void handleAskQuestion()}
            isLoading={isAsking}
            disabled={!businessSummary || isLoadingData}
            warningMessage={
              !businessSummary
                ? 'Soru sormak için önce demo veri yükleyin veya CSV dosyanızı analiz edin.'
                : null
            }
            errorMessage={analysisError}
          />
          <InsightCard analysis={analysis} isLoading={isAsking} />
        </section>
      </main>
    </div>
  )
}
