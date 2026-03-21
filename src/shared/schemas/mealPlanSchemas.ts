import { z } from 'zod'

const trimmedString = z.string().trim()
const mealPlanIdSchema = z.union([z.number().int().nonnegative(), trimmedString.min(1)])
const numericLikeSchema = z.union([
  z.number(),
  trimmedString.regex(/^\d+$/, 'Must be a number').transform(Number),
]).pipe(z.number().int().nonnegative())
const positiveNumericLikeSchema = numericLikeSchema.refine((value) => value > 0, {
  message: 'Servings must be greater than 0',
})
const ingredientSchema = z.union([
  trimmedString.min(1),
  z.object({
    name: trimmedString.min(1),
  }).passthrough().transform((ingredient) => ingredient.name),
]).transform((ingredient) => ingredient.trim())

export const mealPlanSchema = z.object({
  id: mealPlanIdSchema,
  day: trimmedString.min(1, 'Day is required'),
  mealName: trimmedString.min(1).optional(),
  meal_name: trimmedString.min(1).optional(),
  name: trimmedString.min(1).optional(),
  title: trimmedString.min(1).optional(),
  servings: numericLikeSchema.optional(),
  servingCount: numericLikeSchema.optional(),
  serving_count: numericLikeSchema.optional(),
  ingredients: z.array(ingredientSchema).optional(),
  ingredientNames: z.array(ingredientSchema).optional(),
  ingredient_names: z.array(ingredientSchema).optional(),
  cooked: z.boolean().optional(),
  isCooked: z.boolean().optional(),
  is_cooked: z.boolean().optional(),
}).passthrough().transform((mealPlan) => ({
  id: String(mealPlan.id),
  day: mealPlan.day,
  mealName: mealPlan.mealName ?? mealPlan.meal_name ?? mealPlan.name ?? mealPlan.title ?? 'Untitled meal',
  servings: mealPlan.servings ?? mealPlan.servingCount ?? mealPlan.serving_count ?? 0,
  ingredients: mealPlan.ingredients ?? mealPlan.ingredientNames ?? mealPlan.ingredient_names ?? [],
  cooked: mealPlan.cooked ?? mealPlan.isCooked ?? mealPlan.is_cooked ?? false,
}))

export const mealPlanPayloadSchema = z.object({
  day: trimmedString.min(1, 'Day is required'),
  mealName: trimmedString.min(2, 'Meal name must be at least 2 characters'),
  servings: positiveNumericLikeSchema,
  ingredients: z.array(trimmedString.min(1, 'Ingredient is required')).min(1, 'Add at least one ingredient'),
  cooked: z.boolean().optional(),
})

const paginationSchema = z.object({
  limit: numericLikeSchema.optional(),
  offset: numericLikeSchema.optional(),
  total: numericLikeSchema.optional(),
}).passthrough()

const mealPlanListDataSchema = z.union([
  z.array(mealPlanSchema).transform((items) => ({
    items,
    pagination: {
      limit: undefined,
      offset: undefined,
      total: undefined,
    },
  })),
  z.object({
    mealPlans: z.array(mealPlanSchema),
    pagination: paginationSchema.optional(),
    limit: numericLikeSchema.optional(),
    offset: numericLikeSchema.optional(),
    total: numericLikeSchema.optional(),
  }).passthrough().transform((data) => ({
    items: data.mealPlans,
    pagination: {
      limit: data.pagination?.limit ?? data.limit,
      offset: data.pagination?.offset ?? data.offset,
      total: data.pagination?.total ?? data.total,
    },
  })),
  z.object({
    items: z.array(mealPlanSchema),
    pagination: paginationSchema.optional(),
    limit: numericLikeSchema.optional(),
    offset: numericLikeSchema.optional(),
    total: numericLikeSchema.optional(),
  }).passthrough().transform((data) => ({
    items: data.items,
    pagination: {
      limit: data.pagination?.limit ?? data.limit,
      offset: data.pagination?.offset ?? data.offset,
      total: data.pagination?.total ?? data.total,
    },
  })),
])

export const mealPlanListResponseSchema = z.union([
  z.object({
    data: mealPlanListDataSchema,
  }).passthrough().transform((payload) => payload.data),
  mealPlanListDataSchema,
])

export const mealPlanResponseSchema = z.union([
  z.object({
    data: mealPlanSchema,
  }).passthrough().transform((payload) => payload.data),
  z.object({
    data: z.object({
      mealPlan: mealPlanSchema,
    }).passthrough(),
  }).passthrough().transform((payload) => payload.data.mealPlan),
  mealPlanSchema,
])

export type MealPlan = z.infer<typeof mealPlanSchema>
export type MealPlanPayloadInput = z.infer<typeof mealPlanPayloadSchema>
export type MealPlanListResponse = z.infer<typeof mealPlanListResponseSchema>
