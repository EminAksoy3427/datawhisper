import apiClient from '@/api/client'
import type {
  AuthResponse,
  ForgotPasswordPayload,
  LoginPayload,
  MessageResponse,
  RegisterPayload,
  ResetPasswordPayload,
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

export async function forgotPassword(
  payload: ForgotPasswordPayload,
): Promise<MessageResponse> {
  const { data } = await apiClient.post<MessageResponse>(
    '/auth/forgot-password',
    payload,
  )
  return data
}

export async function resetPassword(
  payload: ResetPasswordPayload,
): Promise<MessageResponse> {
  const { data } = await apiClient.post<MessageResponse>(
    '/auth/reset-password',
    payload,
  )
  return data
}

export async function verifyEmail(token: string): Promise<MessageResponse> {
  const { data } = await apiClient.get<MessageResponse>('/auth/verify-email', {
    params: { token },
  })
  return data
}

export async function resendVerification(): Promise<MessageResponse> {
  const { data } = await apiClient.post<MessageResponse>(
    '/auth/resend-verification',
  )
  return data
}
