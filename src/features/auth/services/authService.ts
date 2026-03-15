import {
  parseAuthResponse,
  parseCurrentUserResponse,
  parseForgotPasswordPayload,
  parseLoginPayload,
  parseMessageResponse,
  parseRegisterPayload,
  parseResetPasswordPayload,
  parseVerifyEmailConfirmPayload,
  parseVerifyEmailRequestPayload,
} from '@/features/auth/lib/authSchemas'
import { apiClient } from '@/shared/services/httpClient'
import { apiEndpoints } from '@/shared/services/api'
import type {
  ApiMessageResponse,
  AuthResponse,
  ForgotPasswordPayload,
  LoginPayload,
  RawAuthResponse,
  RawUserResponse,
  RegisterPayload,
  ResetPasswordPayload,
  User,
  VerifyEmailConfirmPayload,
  VerifyEmailRequestPayload,
} from '@/shared/types/api.types'

const MOCK_USER: User = {
  id: '1',
  name: 'Demo User',
  email: 'demo@example.com',
}

const MOCK_RESPONSE: AuthResponse = {
  accessToken: 'dev-token',
  user: MOCK_USER,
}

const hasApiBaseUrl = Boolean(import.meta.env.VITE_API_BASE_URL)

export const authService = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const validatedPayload = parseLoginPayload(payload)

    if (!hasApiBaseUrl) {
      return Promise.resolve({
        ...MOCK_RESPONSE,
        user: {
          ...MOCK_USER,
          email: validatedPayload.email,
        },
      })
    }

    const response = await apiClient.post<RawAuthResponse, LoginPayload>(
      apiEndpoints.auth.login,
      validatedPayload,
    )
    return parseAuthResponse(response)
  },

  async register(payload: RegisterPayload): Promise<ApiMessageResponse> {
    const validatedPayload = parseRegisterPayload(payload)

    if (!hasApiBaseUrl) {
      return Promise.resolve({
        message: 'Account created. Check your inbox to verify your email before logging in.',
      })
    }

    const response = await apiClient.post<unknown, RegisterPayload>(
      apiEndpoints.auth.register,
      validatedPayload,
    )
    return parseMessageResponse(
      response,
      'Account created. Check your inbox to verify your email before logging in.',
    )
  },

  async requestEmailVerification(
    payload: VerifyEmailRequestPayload,
  ): Promise<ApiMessageResponse> {
    const validatedPayload = parseVerifyEmailRequestPayload(payload)

    if (!hasApiBaseUrl) {
      return Promise.resolve({
        message: 'If the email exists, a new verification code has been sent.',
      })
    }

    const response = await apiClient.post<unknown, VerifyEmailRequestPayload>(
      apiEndpoints.auth.requestEmailVerification,
      validatedPayload,
    )

    return parseMessageResponse(response, 'If the email exists, a new verification code has been sent.')
  },

  async confirmEmailVerification(
    payload: VerifyEmailConfirmPayload,
  ): Promise<ApiMessageResponse> {
    const validatedPayload = parseVerifyEmailConfirmPayload(payload)

    if (!hasApiBaseUrl) {
      return Promise.resolve({
        message: 'Email verified. You can now log in.',
      })
    }

    const response = await apiClient.post<unknown, VerifyEmailConfirmPayload>(
      apiEndpoints.auth.confirmEmailVerification,
      validatedPayload,
    )

    return parseMessageResponse(response, 'Email verified. You can now log in.')
  },

  async forgotPassword(payload: ForgotPasswordPayload): Promise<ApiMessageResponse> {
    const validatedPayload = parseForgotPasswordPayload(payload)

    if (!hasApiBaseUrl) {
      return Promise.resolve({
        message: 'If an account exists for this email, we sent a reset link.',
      })
    }

    const response = await apiClient.post<unknown, ForgotPasswordPayload>(
      apiEndpoints.auth.forgotPassword,
      validatedPayload,
    )

    return parseMessageResponse(response, 'If an account exists for this email, we sent a reset link.')
  },

  async resetPassword(payload: ResetPasswordPayload): Promise<ApiMessageResponse> {
    const validatedPayload = parseResetPasswordPayload(payload)

    if (!hasApiBaseUrl) {
      return Promise.resolve({
        message: 'Password updated. You can now log in with your new password.',
      })
    }

    const response = await apiClient.post<unknown, ResetPasswordPayload>(
      apiEndpoints.auth.resetPassword,
      validatedPayload,
    )

    return parseMessageResponse(response, 'Password updated. You can now log in with your new password.')
  },

  async refresh(): Promise<AuthResponse> {
    const response = await apiClient.post<RawAuthResponse, Record<string, never>>(
      apiEndpoints.auth.refresh,
      {},
      {
        skipAuthRefresh: true,
        skipUnauthorizedHandler: true,
      },
    )
    return parseAuthResponse(response)
  },

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<RawUserResponse>(apiEndpoints.auth.me)
    return parseCurrentUserResponse(response)
  },

  async logout(): Promise<void> {
    if (!hasApiBaseUrl) {
      return
    }

    await apiClient.post<unknown, Record<string, never>>(apiEndpoints.auth.logout, {})
  },
}
