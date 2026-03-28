import { z } from 'zod'

import { getZodErrorMessage } from '@/shared/lib/validators'
import {
  shoppingListListResponseSchema,
  shoppingListPayloadSchema,
  shoppingListResponseSchema,
  type ShoppingList,
  type ShoppingListListResponse,
  type ShoppingListPayloadInput,
} from '@/shared/schemas/shoopingListSchema'
import { apiEndpoints } from '@/shared/services/api'
import { apiClient } from '@/shared/services/httpClient'

interface GetShoppingListParams {
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

export const shoppingListService = {
  async getShoppingList(params: GetShoppingListParams = {}): Promise<ShoppingListListResponse> {
    const { limit = 20, offset = 0 } = params

    const response = await apiClient.get<unknown>(apiEndpoints.dashboard.shoppingLists, {
      query: {
        limit,
        offset,
      },
    })

    return parseWithSchema(shoppingListListResponseSchema, response)
  },

  async createShoppingListItem(payload: ShoppingListPayloadInput): Promise<ShoppingList> {
    const validatedPayload = parseWithSchema(shoppingListPayloadSchema, payload)
    const response = await apiClient.post<unknown, ShoppingListPayloadInput>(
      apiEndpoints.dashboard.shoppingLists,
      validatedPayload,
    )

    return parseWithSchema(shoppingListResponseSchema, response)
  },

  async updateShoppingListItem(id: string, payload: ShoppingListPayloadInput): Promise<ShoppingList> {
    const validatedPayload = parseWithSchema(shoppingListPayloadSchema, payload)
    const response = await apiClient.put<unknown, ShoppingListPayloadInput>(
      apiEndpoints.dashboard.shoppingListById(id),
      validatedPayload,
    )

    return parseWithSchema(shoppingListResponseSchema, response)
  },

  async deleteShoppingListItem(id: string): Promise<void> {
    await apiClient.delete<unknown>(apiEndpoints.dashboard.shoppingListById(id))
  },
}
