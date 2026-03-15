export interface User {
  id: string
  name: string
  email: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
}

export interface VerifyEmailRequestPayload {
  email: string
}

export interface VerifyEmailConfirmPayload {
  email: string
  code: string
}

export interface ForgotPasswordPayload {
  email: string
}

export interface ResetPasswordPayload {
  token: string
  password: string
}

export interface ApiMessageResponse {
  message: string
}

export interface AuthResponse {
  accessToken: string
  user: User | null
}

export interface RawAuthResponse {
  token?: string
  accessToken?: string
  user?: User
  message?: string
  data?: {
    token?: string
    accessToken?: string
    user?: User
  } | User
}

export interface RawUserResponse {
  user?: User
  message?: string
  data?: {
    user?: User
  } | User
}
