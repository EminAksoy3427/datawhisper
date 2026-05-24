import { LoadingSpinner } from '@/components/LoadingSpinner'

export function AuthLoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-dw-bg">
      <div className="text-center">
        <LoadingSpinner message="Oturum bilgileri kontrol ediliyor..." size="md" />
      </div>
    </div>
  )
}
