import { z } from 'zod'

export const emailSchema = z.string().trim().email('Invalid email address')

export const minLengthSchema = (length: number, message: string) =>
  z.string().min(length, message)

export const nonEmptyTrimmedSchema = (message: string) =>
  z.string().trim().min(1, message)

export const getZodErrorMessage = (error: z.ZodError, fallback: string) =>
  error.issues[0]?.message ?? fallback

export const isEmail = (value: string) => emailSchema.safeParse(value).success

export const isMinLength = (value: string, length: number) =>
  minLengthSchema(length, `Must be at least ${length} characters`).safeParse(value).success
