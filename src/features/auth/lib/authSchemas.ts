import { z } from 'zod'

import {
  emailSchema,
  getZodErrorMessage,
  minLengthSchema,
  nonEmptyTrimmedSchema,
} from '@/shared/lib/validators'
import type {
  ApiMessageResponse,
  AuthResponse,
  ForgotPasswordPayload,
  LoginPayload,
  RegisterPayload,
  ResetPasswordPayload,
  User,
  VerifyEmailConfirmPayload,
  VerifyEmailRequestPayload,
} from '@/shared/types/api.types'

const trimmedString = z.string().trim()

const userObjectSchema = z.object({
  id: trimmedString.min(1, 'User id is required'),
  name: trimmedString.min(1, 'User name is required'),
  email: emailSchema,
}).passthrough()

const authDataSchema = z.object({
  token: trimmedString.min(1).optional(),
  accessToken: trimmedString.min(1).optional(),
  user: userObjectSchema.optional(),
}).passthrough()

const rawAuthResponseSchema = z.object({
  token: trimmedString.min(1).optional(),
  accessToken: trimmedString.min(1).optional(),
  user: userObjectSchema.optional(),
  message: trimmedString.min(1).optional(),
  data: z.union([authDataSchema, userObjectSchema]).optional(),
}).passthrough()

const rawUserResponseSchema = z.object({
  user: userObjectSchema.optional(),
  message: trimmedString.min(1).optional(),
  data: z.union([
    userObjectSchema,
    z.object({
      user: userObjectSchema.optional(),
    }).passthrough(),
  ]).optional(),
}).passthrough()

const apiMessageResponseSchema = z.object({
  message: trimmedString.min(1, 'Message is required'),
})

export const loginPayloadSchema = z.object({
  email: emailSchema,
  password: minLengthSchema(6, 'Password must be at least 6 characters'),
})

export const registerPayloadSchema = z.object({
  name: nonEmptyTrimmedSchema('Name is required').min(2, 'Name must be at least 2 characters'),
  email: emailSchema,
  password: minLengthSchema(6, 'Password must be at least 6 characters'),
})

export const forgotPasswordPayloadSchema = z.object({
  email: emailSchema,
})

export const verifyEmailRequestPayloadSchema = z.object({
  email: emailSchema,
})

export const verifyEmailConfirmPayloadSchema = z.object({
  email: emailSchema,
  code: nonEmptyTrimmedSchema('Verification code is required')
    .min(6, 'Verification code must be at least 6 characters'),
})

export const resetPasswordPayloadSchema = z.object({
  token: nonEmptyTrimmedSchema('Reset token is required').min(6, 'Reset token is required'),
  password: minLengthSchema(6, 'New password must be at least 6 characters'),
})

export const registerFormSchema = registerPayloadSchema.extend({
  confirmPassword: z.string(),
}).refine((value) => value.password === value.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

export const resetPasswordFormSchema = resetPasswordPayloadSchema.extend({
  confirmPassword: z.string(),
}).refine((value) => value.password === value.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

const authResponseSchema = z.object({
  accessToken: trimmedString.min(1, 'Access token is required'),
  user: userObjectSchema.nullable(),
})

const unwrapApiMessage = (value: unknown, fallback: string): ApiMessageResponse => {
  const result = apiMessageResponseSchema.safeParse(value)

  if (result.success) {
    return result.data
  }

  return { message: fallback }
}

const toServiceError = (error: z.ZodError, fallback: string) =>
  new Error(getZodErrorMessage(error, fallback))

export const parseLoginPayload = (payload: LoginPayload) => {
  const result = loginPayloadSchema.safeParse(payload)

  if (!result.success) {
    throw toServiceError(result.error, 'Invalid login payload')
  }

  return result.data
}

export const parseRegisterPayload = (payload: RegisterPayload) => {
  const result = registerPayloadSchema.safeParse(payload)

  if (!result.success) {
    throw toServiceError(result.error, 'Invalid registration payload')
  }

  return result.data
}

export const parseForgotPasswordPayload = (payload: ForgotPasswordPayload) => {
  const result = forgotPasswordPayloadSchema.safeParse(payload)

  if (!result.success) {
    throw toServiceError(result.error, 'Invalid forgot password payload')
  }

  return result.data
}

export const parseVerifyEmailRequestPayload = (payload: VerifyEmailRequestPayload) => {
  const result = verifyEmailRequestPayloadSchema.safeParse(payload)

  if (!result.success) {
    throw toServiceError(result.error, 'Invalid email verification payload')
  }

  return result.data
}

export const parseVerifyEmailConfirmPayload = (payload: VerifyEmailConfirmPayload) => {
  const result = verifyEmailConfirmPayloadSchema.safeParse(payload)

  if (!result.success) {
    throw toServiceError(result.error, 'Invalid email verification payload')
  }

  return result.data
}

export const parseResetPasswordPayload = (payload: ResetPasswordPayload) => {
  const result = resetPasswordPayloadSchema.safeParse(payload)

  if (!result.success) {
    throw toServiceError(result.error, 'Invalid reset password payload')
  }

  return result.data
}

export const parseAuthResponse = (response: unknown): AuthResponse => {
  const result = rawAuthResponseSchema.safeParse(response)

  if (!result.success) {
    throw toServiceError(result.error, 'Invalid auth response from API')
  }

  const parsed = result.data
  const nestedData = parsed.data
  const token = parsed.accessToken
    ?? parsed.token
    ?? (nestedData && 'accessToken' in nestedData ? nestedData.accessToken : undefined)
    ?? (nestedData && 'token' in nestedData ? nestedData.token : undefined)
  const user = parsed.user
    ?? (nestedData && 'user' in nestedData ? nestedData.user ?? null : null)

  const normalized = authResponseSchema.safeParse({
    accessToken: token,
    user,
  })

  if (!normalized.success) {
    throw toServiceError(normalized.error, 'Invalid auth response from API')
  }

  return normalized.data
}

export const parseCurrentUserResponse = (response: unknown): User => {
  const result = rawUserResponseSchema.safeParse(response)

  if (!result.success) {
    throw toServiceError(result.error, 'Invalid user response from API')
  }

  const parsed = result.data
  const user = parsed.user
    ?? (parsed.data && 'user' in parsed.data ? parsed.data.user : parsed.data)
  const normalized = userObjectSchema.safeParse(user)

  if (!normalized.success) {
    throw toServiceError(normalized.error, 'Invalid user response from API')
  }

  return normalized.data
}

export const parseMessageResponse = (response: unknown, fallback: string) =>
  unwrapApiMessage(response, fallback)

export const getSchemaErrorMessage = (error: unknown, fallback: string) =>
  error instanceof z.ZodError ? getZodErrorMessage(error, fallback) : fallback
