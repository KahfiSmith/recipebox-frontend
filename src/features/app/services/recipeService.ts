import { z } from 'zod'

import { getZodErrorMessage } from '@/shared/lib/validators'
import { recipeListResponseSchema, type RecipeListResponse } from '@/shared/schemas/recipeSchemas'
import { apiEndpoints } from '@/shared/services/api'
import { apiClient } from '@/shared/services/httpClient'

interface GetRecipesParams {
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

export const recipeService = {
  async getRecipes(params: GetRecipesParams = {}): Promise<RecipeListResponse> {
    const { limit = 20, offset = 0 } = params

    const response = await apiClient.get<unknown>(apiEndpoints.dashboard.recipes, {
      query: {
        limit,
        offset,
      },
    })

    const parsed = parseWithSchema(
      recipeListResponseSchema,
      response,
    )

    return parsed
  },
}

