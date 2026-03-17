import { z } from 'zod'

import { getZodErrorMessage } from '@/shared/lib/validators'
import {
  recipeListResponseSchema,
  recipePayloadSchema,
  recipeResponseSchema,
  type Recipe,
  type RecipeListResponse,
  type RecipePayloadInput,
} from '@/shared/schemas/recipeSchemas'
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

  async createRecipe(payload: RecipePayloadInput): Promise<Recipe> {
    const validatedPayload = parseWithSchema(recipePayloadSchema, payload)
    const response = await apiClient.post<unknown, RecipePayloadInput>(
      apiEndpoints.dashboard.recipes,
      validatedPayload,
    )

    return parseWithSchema(recipeResponseSchema, response)
  },

  async updateRecipe(id: string, payload: RecipePayloadInput): Promise<Recipe> {
    const validatedPayload = parseWithSchema(recipePayloadSchema, payload)
    const response = await apiClient.put<unknown, RecipePayloadInput>(
      apiEndpoints.dashboard.recipeById(id),
      validatedPayload,
    )

    return parseWithSchema(recipeResponseSchema, response)
  },

  async deleteRecipe(id: string): Promise<void> {
    await apiClient.delete<unknown>(apiEndpoints.dashboard.recipeById(id))
  },
}
