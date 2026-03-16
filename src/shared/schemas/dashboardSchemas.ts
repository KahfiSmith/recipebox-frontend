import { z } from 'zod'

export const dashboardSummarySchema = z.object({
  recipeCount: z.number().int().nonnegative(),
  upcomingMealPlanCount: z.number().int().nonnegative(),
  pendingShoppingItemCount: z.number().int().nonnegative(),
})

export const dashboardResponseSchema = z.object({
  data: z.object({
    summary: dashboardSummarySchema,
    recipes: z.array(z.unknown()),
    mealPlans: z.array(z.unknown()),
    shoppingItems: z.array(z.unknown()),
  }).passthrough(),
}).passthrough()
