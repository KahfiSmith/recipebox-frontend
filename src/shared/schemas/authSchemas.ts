import { z } from 'zod'

import {
  emailSchema,
  minLengthSchema,
  nonEmptyTrimmedSchema,
} from '@/shared/lib/validators'

const trimmedString = z.string().trim()

const rawApiUserSchema = z.object({
  id: z.number().int().nonnegative(),
  name: trimmedString.min(1, 'User name is required'),
  email: emailSchema,
  emailVerifiedAt: z.string().nullable().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
}).passthrough()

const userSchema = rawApiUserSchema.transform((user) => ({
  id: String(user.id),
  name: user.name,
  email: user.email,
}))

const tokensSchema = z.object({
  accessToken: trimmedString.min(1, 'Access token is required'),
  accessTokenExpiresAt: z.string().optional(),
  refreshToken: z.string().optional(),
  refreshTokenExpiresAt: z.string().optional(),
}).passthrough()

export const apiMessageResponseSchema = z.object({
  message: trimmedString.min(1, 'Message is required'),
})

export const authResponseSchema = z.object({
  data: z.object({
    user: userSchema,
    tokens: tokensSchema,
  }).passthrough(),
}).passthrough()

export const currentUserResponseSchema = z.object({
  data: z.object({
    user: userSchema,
  }).passthrough(),
}).passthrough()

export const registerResponseSchema = z.object({
  data: z.object({
    user: userSchema,
  }).passthrough(),
}).passthrough()

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
