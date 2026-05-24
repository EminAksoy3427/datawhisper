import type { BusinessSummary } from '@/api/types/data'

export type RiskLevel = 'low' | 'medium' | 'high'
export type ChartSuggestion = 'bar' | 'line' | 'pie' | 'table'

export type AskRequest = {
  question: string
  business_summary: BusinessSummary
}

export type AnalysisResponse = {
  summary: string
  insight: string
  recommendation: string
  risk_level: RiskLevel
  chart_suggestion: ChartSuggestion
}
