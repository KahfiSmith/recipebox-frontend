import { z } from 'zod'

const trimmedString = z.string().trim()
const recipeIdSchema = z.union([z.number().int().nonnegative(), trimmedString.min(1)])
const numericLikeSchema = z.union([
  z.number(),
  trimmedString.regex(/^\d+$/, 'Must be a number').transform(Number),
]).pipe(z.number().int().nonnegative())
const positiveNumericLikeSchema = numericLikeSchema.refine((value) => value > 0, {
  message: 'Prep time must be greater than 0',
})

export const recipeSchema = z.object({
  id: recipeIdSchema,
  name: trimmedString.min(1, 'Recipe name is required'),
  category: trimmedString.optional(),
  prepTime: numericLikeSchema.optional(),
  prepTimeMinutes: numericLikeSchema.optional(),
  prep_time_minutes: numericLikeSchema.optional(),
}).passthrough().transform((recipe) => ({
  id: String(recipe.id),
  name: recipe.name,
  category: recipe.category || 'Uncategorized',
  prepTime: recipe.prepTime ?? recipe.prepTimeMinutes ?? recipe.prep_time_minutes ?? 0,
}))

export const recipePayloadSchema = z.object({
  name: trimmedString.min(2, 'Recipe name must be at least 2 characters'),
  category: trimmedString.min(2, 'Category must be at least 2 characters'),
  prepTime: positiveNumericLikeSchema,
})

const paginationSchema = z.object({
  limit: numericLikeSchema.optional(),
  offset: numericLikeSchema.optional(),
  total: numericLikeSchema.optional(),
}).passthrough()

const recipeListDataSchema = z.union([
  z.array(recipeSchema).transform((items) => ({
    items,
    pagination: {
      limit: undefined,
      offset: undefined,
      total: undefined,
    },
  })),
  z.object({
    recipes: z.array(recipeSchema),
    pagination: paginationSchema.optional(),
    limit: numericLikeSchema.optional(),
    offset: numericLikeSchema.optional(),
    total: numericLikeSchema.optional(),
  }).passthrough().transform((data) => ({
    items: data.recipes,
    pagination: {
      limit: data.pagination?.limit ?? data.limit,
      offset: data.pagination?.offset ?? data.offset,
      total: data.pagination?.total ?? data.total,
    },
  })),
  z.object({
    items: z.array(recipeSchema),
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

export const recipeListResponseSchema = z.union([
  z.object({
    data: recipeListDataSchema,
  }).passthrough().transform((payload) => payload.data),
  recipeListDataSchema,
])

export const recipeResponseSchema = z.union([
  z.object({
    data: recipeSchema,
  }).passthrough().transform((payload) => payload.data),
  z.object({
    data: z.object({
      recipe: recipeSchema,
    }).passthrough(),
  }).passthrough().transform((payload) => payload.data.recipe),
  recipeSchema,
])

export type Recipe = z.infer<typeof recipeSchema>
export type RecipePayloadInput = z.infer<typeof recipePayloadSchema>
export type RecipeListResponse = z.infer<typeof recipeListResponseSchema>
