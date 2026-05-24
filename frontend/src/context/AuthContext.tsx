import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { fetchCurrentUser, loginUser, registerUser } from '@/api/auth'
import { clearStoredToken, setStoredToken, getStoredToken } from '@/api/client'
import type { LoginPayload, RegisterPayload, User } from '@/api/types/auth'
import { getApiErrorMessage } from '@/lib/apiError'

type AuthContextValue = {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (payload: LoginPayload) => Promise<void>
  register: (payload: RegisterPayload) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function applyAuthSession(
  accessToken: string,
  user: User,
  setUser: (user: User | null) => void,
): void {
  setStoredToken(accessToken)
  setUser(user)
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function loadSession() {
      const token = getStoredToken()
      if (!token) {
        if (!cancelled) {
          setIsLoading(false)
        }
        return
      }

      try {
        const currentUser = await fetchCurrentUser()
        if (!cancelled) {
          setUser(currentUser)
        }
      } catch {
        clearStoredToken()
        if (!cancelled) {
          setUser(null)
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    void loadSession()

    return () => {
      cancelled = true
    }
  }, [])

  const login = useCallback(async (payload: LoginPayload) => {
    try {
      const response = await loginUser(payload)
      applyAuthSession(response.access_token, response.user, setUser)
    } catch (error) {
      throw new Error(getApiErrorMessage(error))
    }
  }, [])

  const register = useCallback(async (payload: RegisterPayload) => {
    try {
      const response = await registerUser(payload)
      applyAuthSession(response.access_token, response.user, setUser)
    } catch (error) {
      throw new Error(getApiErrorMessage(error))
    }
  }, [])

  const logout = useCallback(() => {
    clearStoredToken()
    setUser(null)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      isAuthenticated: user !== null,
      login,
      register,
      logout,
    }),
    [user, isLoading, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (context === null) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
