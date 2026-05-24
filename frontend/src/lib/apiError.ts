import axios from 'axios'

const ERROR_MESSAGES: Record<string, string> = {
  'An account with this email already exists.':
    'Bu e-posta adresi zaten kayıtlı.',
  'Invalid email or password.': 'E-posta veya şifre hatalı.',
}

export function getApiErrorMessage(error: unknown): string {
  if (!axios.isAxiosError(error)) {
    return 'Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.'
  }

  if (!error.response) {
    return 'Sunucuya ulaşılamadı. Backend’in çalıştığından ve adresin doğru olduğundan emin olun.'
  }

  const { status } = error.response
  const detail = error.response.data?.detail

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

  if (status === 401) {
    return 'Oturumunuz sona erdi. Lütfen tekrar giriş yapın.'
  }

  if (status === 403) {
    return 'Bu işlem için yetkiniz yok. Giriş yapmayı deneyin.'
  }

  if (status === 413) {
    return 'Dosya çok büyük. Daha küçük bir CSV dosyası yükleyin.'
  }

  if (status >= 500) {
    return 'Sunucu hatası oluştu. Biraz sonra tekrar deneyin.'
  }

  return 'İşlem tamamlanamadı. Lütfen bilgilerinizi kontrol edip tekrar deneyin.'
}
