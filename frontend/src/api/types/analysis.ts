import type { BusinessSummary } from '@/api/types/data'

export type RiskLevel = 'low' | 'medium' | 'high'
export type ChartSuggestion = 'bar' | 'line' | 'pie' | 'table'
export type Priority =
  | 'Bugün kontrol edilmeli'
  | 'Bu hafta kontrol edilmeli'
  | 'Takipte kalmalı'

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

  headline: string
  focus_area: string
  priority: Priority
  main_finding: string
  why_it_matters: string
  recommended_actions: string[]
  expected_impact: string
  data_to_check: string[]
  follow_up_questions: string[]
}
