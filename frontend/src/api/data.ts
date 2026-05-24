import apiClient from '@/api/client'
import type { BusinessSummary } from '@/api/types/data'

export async function fetchDemoData(): Promise<BusinessSummary> {
  const { data } = await apiClient.get<BusinessSummary>('/demo-data')
  return data
}

export async function uploadCsv(file: File): Promise<BusinessSummary> {
  const formData = new FormData()
  formData.append('file', file)

  const { data } = await apiClient.post<BusinessSummary>(
    '/upload-csv',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  )
  return data
}
