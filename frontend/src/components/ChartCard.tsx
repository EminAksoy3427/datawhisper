import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { formatCurrency, truncateLabel } from '@/lib/format'

export type ChartDataPoint = {
  name: string
  value: number
}

type ChartCardProps = {
  title: string
  description?: string
  data: ChartDataPoint[]
  valueLabel: string
  emptyMessage?: string
  formatValueAsCurrency?: boolean
}

export function ChartCard({
  title,
  description,
  data,
  valueLabel,
  emptyMessage = 'Henüz gösterilecek veri yok.',
  formatValueAsCurrency = true,
}: ChartCardProps) {
  const chartData = data.map((item) => ({
    ...item,
    shortName: truncateLabel(item.name),
  }))

  return (
    <section className="rounded-[var(--radius-dw)] border border-dw-border bg-dw-card p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-dw-text">{title}</h2>
      {description && (
        <p className="mt-1 mb-4 text-sm text-dw-muted">{description}</p>
      )}
      {!description && <div className="mb-4" />}
      {chartData.length === 0 ? (
        <p className="rounded-[var(--radius-dw)] border border-dashed border-dw-border bg-dw-bg px-4 py-6 text-center text-sm text-dw-muted">
          {emptyMessage}
        </p>
      ) : (
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="shortName" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value) => {
                  if (typeof value !== 'number') {
                    return value
                  }
                  return formatValueAsCurrency
                    ? formatCurrency(value)
                    : String(value)
                }}
                labelFormatter={(_, payload) => {
                  const item = payload?.[0]?.payload as
                    | { name?: string }
                    | undefined
                  return item?.name ?? ''
                }}
              />
              <Bar
                dataKey="value"
                name={valueLabel}
                fill="#2563eb"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  )
}
