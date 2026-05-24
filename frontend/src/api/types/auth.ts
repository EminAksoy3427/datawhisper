export type User = {
  id: number
  name: string
  email: string
  created_at: string
}

export type AuthResponse = {
  user: User
  access_token: string
  token_type: string
}

export type RegisterPayload = {
  name: string
  email: string
  password: string
}

export type LoginPayload = {
  email: string
  password: string
}
