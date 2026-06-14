const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim())
}

export function validateRequiredEmail(email: string): string | null {
  const trimmed = email.trim()
  if (!trimmed) {
    return 'E-posta adresi gereklidir.'
  }
  if (!isValidEmail(trimmed)) {
    return 'Geçerli bir e-posta adresi girin.'
  }
  return null
}

export function validateRequiredPassword(password: string): string | null {
  if (!password) {
    return 'Şifre gereklidir.'
  }
  return null
}

export function validatePasswordMinLength(
  password: string,
  minLength = 8,
): string | null {
  if (password.length < minLength) {
    return `Şifre en az ${minLength} karakter olmalıdır.`
  }
  return null
}

export function validatePasswordsMatch(
  password: string,
  confirmPassword: string,
): string | null {
  if (password !== confirmPassword) {
    return 'Şifreler eşleşmiyor.'
  }
  return null
}

export function validateRequiredName(name: string): string | null {
  if (!name.trim()) {
    return 'Ad Soyad gereklidir.'
  }
  return null
}
