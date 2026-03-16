export interface User {
  id: string
  name: string
  email: string
}

export interface RawApiUser {
  id: number
  name: string
  email: string
  emailVerifiedAt?: string | null
  createdAt?: string
  updatedAt?: string
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
  data: {
    user: RawApiUser
    tokens: {
      accessToken: string
      accessTokenExpiresAt?: string
      refreshToken?: string
      refreshTokenExpiresAt?: string
    }
  }
}

export interface RawUserResponse {
  data: {
    user: RawApiUser
  }
}

export interface RawRegisterResponse {
  data: {
    user: RawApiUser
  }
}
