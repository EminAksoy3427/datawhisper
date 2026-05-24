import apiClient from '@/api/client'
import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  User,
} from '@/api/types/auth'

export async function registerUser(
  payload: RegisterPayload,
): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>('/auth/register', payload)
  return data
}

export async function loginUser(payload: LoginPayload): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>('/auth/login', payload)
  return data
}

export async function fetchCurrentUser(): Promise<User> {
  const { data } = await apiClient.get<User>('/auth/me')
  return data
}
