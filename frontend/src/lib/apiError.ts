import axios from 'axios'

const ERROR_MESSAGES: Record<string, string> = {
  'An account with this email already exists.':
    'Bu e-posta adresi zaten kayıtlı.',
  'Invalid email or password.': 'E-posta veya şifre hatalı.',
}

export function getApiErrorMessage(error: unknown): string {
  if (!axios.isAxiosError(error)) {
    return 'Bir hata oluştu. Lütfen tekrar deneyin.'
  }

  const detail = error.response?.data?.detail

  if (typeof detail === 'string') {
    return ERROR_MESSAGES[detail] ?? detail
  }

  if (Array.isArray(detail)) {
    const messages = detail
      .map((item) => {
        if (typeof item === 'object' && item !== null && 'msg' in item) {
          return String(item.msg)
        }
        return null
      })
      .filter(Boolean)

    if (messages.length > 0) {
      return messages.join(' ')
    }
  }

  if (error.response?.status === 401) {
    return 'Oturumunuz sona erdi. Lütfen tekrar giriş yapın.'
  }

  return 'Bir hata oluştu. Lütfen tekrar deneyin.'
}
