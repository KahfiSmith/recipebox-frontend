import { z } from 'zod'

import { getZodErrorMessage } from '@/shared/lib/validators'
import {
  mealPlanListResponseSchema,
  mealPlanPayloadSchema,
  mealPlanResponseSchema,
  type MealPlan,
  type MealPlanListResponse,
  type MealPlanPayloadInput,
} from '@/shared/schemas/mealPlanSchemas'
import { apiEndpoints } from '@/shared/services/api'
import { apiClient } from '@/shared/services/httpClient'

interface GetMealPlansParams {
  limit?: number
  offset?: number
}

const parseWithSchema = <T>(schema: z.ZodSchema<T>, data: unknown): T => {
  const result = schema.safeParse(data)

  if (!result.success) {
    throw new Error(getZodErrorMessage(result.error, 'Invalid response from API'))
  }

  return result.data
}

export const mealPlanService = {
  async getMealPlans(params: GetMealPlansParams = {}): Promise<MealPlanListResponse> {
    const { limit = 20, offset = 0 } = params

    const response = await apiClient.get<unknown>(apiEndpoints.dashboard.mealPlans, {
      query: {
        limit,
        offset,
      },
    })

    return parseWithSchema(mealPlanListResponseSchema, response)
  },

  async createMealPlan(payload: MealPlanPayloadInput): Promise<MealPlan> {
    const validatedPayload = parseWithSchema(mealPlanPayloadSchema, payload)
    const response = await apiClient.post<unknown, MealPlanPayloadInput>(
      apiEndpoints.dashboard.mealPlans,
      validatedPayload,
    )

    return parseWithSchema(mealPlanResponseSchema, response)
  },

  async updateMealPlan(id: string, payload: MealPlanPayloadInput): Promise<MealPlan> {
    const validatedPayload = parseWithSchema(mealPlanPayloadSchema, payload)
    const response = await apiClient.put<unknown, MealPlanPayloadInput>(
      apiEndpoints.dashboard.mealPlanById(id),
      validatedPayload,
    )

    return parseWithSchema(mealPlanResponseSchema, response)
  },

  async deleteMealPlan(id: string): Promise<void> {
    await apiClient.delete<unknown>(apiEndpoints.dashboard.mealPlanById(id))
  },
}
