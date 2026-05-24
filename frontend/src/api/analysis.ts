import apiClient from '@/api/client'
import type { AskRequest, AnalysisResponse } from '@/api/types/analysis'

export async function askQuestion(
  payload: AskRequest,
): Promise<AnalysisResponse> {
  const { data } = await apiClient.post<AnalysisResponse>('/ask', payload)
  return data
}
