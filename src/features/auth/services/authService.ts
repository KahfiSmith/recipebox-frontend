import {
  apiMessageResponseSchema,
  authResponseSchema,
  currentUserResponseSchema,
  forgotPasswordPayloadSchema,
  loginPayloadSchema,
  registerPayloadSchema,
  registerResponseSchema,
  refreshResponseSchema,
  resetPasswordPayloadSchema,
  verifyEmailConfirmPayloadSchema,
  verifyEmailRequestPayloadSchema,
} from '@/shared/schemas/authSchemas'
import { getZodErrorMessage } from '@/shared/lib/validators'
import { apiClient } from '@/shared/services/httpClient'
import { apiEndpoints } from '@/shared/services/api'
import type {
  ApiMessageResponse,
  AuthResponse,
  ForgotPasswordPayload,
  LoginPayload,
  RawRegisterResponse,
  RegisterPayload,
  ResetPasswordPayload,
  User,
  VerifyEmailConfirmPayload,
  VerifyEmailRequestPayload,
} from '@/shared/types/api.types'
import { z } from 'zod'

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
const registerSuccessMessage =
  'Account created. Check your inbox to verify your email before logging in.'

const parseWithSchema = <T>(schema: z.ZodSchema<T>, value: unknown, fallback: string): T => {
  const result = schema.safeParse(value)

  if (!result.success) {
    throw new Error(getZodErrorMessage(result.error, fallback))
  }

  return result.data
}

const parseApiMessage = (value: unknown, fallback: string): ApiMessageResponse => {
  const result = apiMessageResponseSchema.safeParse(value)

  if (result.success) {
    return result.data
  }

  return { message: fallback }
}

export const authService = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const validatedPayload = parseWithSchema(loginPayloadSchema, payload, 'Invalid login payload')

    if (!hasApiBaseUrl) {
      return Promise.resolve({
        ...MOCK_RESPONSE,
        user: {
          ...MOCK_USER,
          email: validatedPayload.email,
        },
      })
    }

    const response = await apiClient.post<unknown, LoginPayload>(
      apiEndpoints.auth.login,
      validatedPayload,
    )
    const parsed = parseWithSchema(authResponseSchema, response, 'Invalid auth response from API')

    return {
      accessToken: parsed.data.accessToken,
      user: parsed.data.user,
    }
  },

  async register(payload: RegisterPayload): Promise<ApiMessageResponse> {
    const validatedPayload = parseWithSchema(
      registerPayloadSchema,
      payload,
      'Invalid registration payload',
    )

    if (!hasApiBaseUrl) {
      return Promise.resolve({
        message: registerSuccessMessage,
      })
    }

    const response = await apiClient.post<RawRegisterResponse, RegisterPayload>(
      apiEndpoints.auth.register,
      validatedPayload,
    )
    parseWithSchema(registerResponseSchema, response, 'Invalid registration response from API')
    return { message: registerSuccessMessage }
  },

  async requestEmailVerification(
    payload: VerifyEmailRequestPayload,
  ): Promise<ApiMessageResponse> {
    const validatedPayload = parseWithSchema(
      verifyEmailRequestPayloadSchema,
      payload,
      'Invalid email verification payload',
    )

    if (!hasApiBaseUrl) {
      return Promise.resolve({
        message: 'If the email exists, a new verification code has been sent.',
      })
    }

    const response = await apiClient.post<unknown, VerifyEmailRequestPayload>(
      apiEndpoints.auth.requestEmailVerification,
      validatedPayload,
    )

    return parseApiMessage(response, 'If the email exists, a new verification code has been sent.')
  },

  async confirmEmailVerification(
    payload: VerifyEmailConfirmPayload,
  ): Promise<ApiMessageResponse> {
    const validatedPayload = parseWithSchema(
      verifyEmailConfirmPayloadSchema,
      payload,
      'Invalid email verification payload',
    )

    if (!hasApiBaseUrl) {
      return Promise.resolve({
        message: 'Email verified. You can now log in.',
      })
    }

    const response = await apiClient.post<unknown, VerifyEmailConfirmPayload>(
      apiEndpoints.auth.confirmEmailVerification,
      validatedPayload,
    )

    return parseApiMessage(response, 'Email verified. You can now log in.')
  },

  async forgotPassword(payload: ForgotPasswordPayload): Promise<ApiMessageResponse> {
    const validatedPayload = parseWithSchema(
      forgotPasswordPayloadSchema,
      payload,
      'Invalid forgot password payload',
    )

    if (!hasApiBaseUrl) {
      return Promise.resolve({
        message: 'If an account exists for this email, we sent a reset link.',
      })
    }

    const response = await apiClient.post<unknown, ForgotPasswordPayload>(
      apiEndpoints.auth.forgotPassword,
      validatedPayload,
    )

    return parseApiMessage(response, 'If an account exists for this email, we sent a reset link.')
  },

  async resetPassword(payload: ResetPasswordPayload): Promise<ApiMessageResponse> {
    const validatedPayload = parseWithSchema(
      resetPasswordPayloadSchema,
      payload,
      'Invalid reset password payload',
    )

    if (!hasApiBaseUrl) {
      return Promise.resolve({
        message: 'Password updated. You can now log in with your new password.',
      })
    }

    const response = await apiClient.post<unknown, ResetPasswordPayload>(
      apiEndpoints.auth.resetPassword,
      validatedPayload,
    )

    return parseApiMessage(response, 'Password updated. You can now log in with your new password.')
  },

  async refresh(): Promise<AuthResponse> {
    const response = await apiClient.post<unknown, Record<string, never>>(
      apiEndpoints.auth.refresh,
      {},
      {
        skipAuthRefresh: true,
        skipUnauthorizedHandler: true,
      },
    )
    const parsed = parseWithSchema(refreshResponseSchema, response, 'Invalid refresh response from API')

    return {
      accessToken: parsed.data.accessToken,
      user: parsed.data.user,
    }
  },

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<unknown>(apiEndpoints.auth.me)
    const parsed = parseWithSchema(currentUserResponseSchema, response, 'Invalid user response from API')

    return parsed.data.user
  },

  async logout(): Promise<void> {
    if (!hasApiBaseUrl) {
      return
    }

    await apiClient.post<unknown, Record<string, never>>(apiEndpoints.auth.logout, {})
  },
}
