import { z } from 'zod'

import {
  emailSchema,
  minLengthSchema,
  nonEmptyTrimmedSchema,
} from '@/shared/lib/validators'

const trimmedString = z.string().trim()
const accessTokenSchema = trimmedString.min(1, 'Access token is required')

const rawApiUserSchema = z.object({
  id: z.union([z.number().int().nonnegative(), trimmedString.min(1, 'User id is required')]),
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
  accessToken: accessTokenSchema,
  accessTokenExpiresAt: z.string().optional(),
  refreshToken: z.string().optional(),
  refreshTokenExpiresAt: z.string().optional(),
}).passthrough()

const directTokenPayloadSchema = z.object({
  accessToken: accessTokenSchema,
  accessTokenExpiresAt: z.string().optional(),
  refreshToken: z.string().optional(),
  refreshTokenExpiresAt: z.string().optional(),
}).passthrough()

export const apiMessageResponseSchema = z.object({
  message: trimmedString.min(1, 'Message is required'),
})

export const authResponseSchema = z.object({
  data: z.union([
    z.object({
      user: userSchema,
      tokens: tokensSchema,
    }).passthrough().transform((data) => ({
      user: data.user,
      accessToken: data.tokens.accessToken,
    })),
    z.object({
      user: userSchema,
    }).merge(directTokenPayloadSchema).passthrough().transform((data) => ({
      user: data.user,
      accessToken: data.accessToken,
    })),
  ]),
}).passthrough()

export const refreshResponseSchema = z.object({
  data: z.union([
    directTokenPayloadSchema.transform((data) => ({
      user: null,
      accessToken: data.accessToken,
    })),
    z.object({
      user: userSchema.optional(),
    }).merge(directTokenPayloadSchema).passthrough().transform((data) => ({
      user: data.user ?? null,
      accessToken: data.accessToken,
    })),
    z.object({
      tokens: tokensSchema,
      user: userSchema.optional(),
    }).passthrough().transform((data) => ({
      user: data.user ?? null,
      accessToken: data.tokens.accessToken,
    })),
  ]),
}).passthrough()

export const currentUserResponseSchema = z.object({
  data: z.union([
    z.object({
      user: userSchema,
    }).passthrough().transform((data) => ({
      user: data.user,
    })),
    userSchema.transform((user) => ({
      user,
    })),
  ]),
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
  password: minLengthSchema(8, 'Password must be at least 8 characters'),
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
  token: nonEmptyTrimmedSchema('Reset code is required').min(6, 'Reset code is required'),
  newPassword: minLengthSchema(8, 'New password must be at least 8 characters'),
})

export const registerFormSchema = registerPayloadSchema.extend({
  confirmPassword: z.string(),
}).refine((value) => value.password === value.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

export const resetPasswordFormSchema = resetPasswordPayloadSchema.extend({
  confirmPassword: z.string(),
}).refine((value) => value.newPassword === value.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})
