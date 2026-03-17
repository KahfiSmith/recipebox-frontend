import { z } from 'zod'

import { dashboardResponseSchema } from '@/shared/schemas/dashboardSchemas'
import { getZodErrorMessage } from '@/shared/lib/validators'
import { apiEndpoints } from '@/shared/services/api'
import { apiClient } from '@/shared/services/httpClient'
import type { DashboardOverviewResponse } from '@/features/app/types'

const parseWithSchema = <T>(schema: z.ZodSchema<T>, value: unknown, fallback: string): T => {
  const result = schema.safeParse(value)

  if (!result.success) {
    throw new Error(getZodErrorMessage(result.error, fallback))
  }

  return result.data
}

export const dashboardService = {
  async getDashboard(): Promise<DashboardOverviewResponse> {
    const response = await apiClient.get<unknown>(apiEndpoints.dashboard.overview)
    const parsed = parseWithSchema(
      dashboardResponseSchema,
      response,
      'Invalid dashboard response from API',
    )

    return parsed.data
  },
}