import { Navigate, useLocation } from 'react-router-dom'
import { AuthLoadingScreen } from '@/components/AuthLoadingScreen'
import { useAuth } from '@/context/AuthContext'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return <AuthLoadingScreen />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return children
}
