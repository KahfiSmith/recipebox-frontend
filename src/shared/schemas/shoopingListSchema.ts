import { z } from 'zod'

const trimmedString = z.string().trim()
const shoppingListIdSchema = z.union([z.number().int().nonnegative(), trimmedString.min(1)])
const numericLikeSchema = z.union([
  z.number(),
  trimmedString.regex(/^\d+$/, 'Must be a number').transform(Number),
]).pipe(z.number().int().nonnegative())
const textLikeSchema = z.union([
  trimmedString.min(1),
  z.number().transform((value) => String(value)),
])

const booleanLikeSchema = z.union([
  z.boolean(),
  z.literal('true').transform(() => true),
  z.literal('false').transform(() => false),
  z.literal('1').transform(() => true),
  z.literal('0').transform(() => false),
  z.literal(1).transform(() => true),
  z.literal(0).transform(() => false),
])

const shoppingSourceSchema = z.union([
  z.literal('manual'),
  z.literal('meal-plan'),
  z.literal('meal_plan'),
]).transform((value) => (value === 'meal_plan' ? 'meal-plan' : value))

export const shoppingListSchema = z.object({
  id: shoppingListIdSchema,
  name: textLikeSchema.optional(),
  itemName: textLikeSchema.optional(),
  item_name: textLikeSchema.optional(),
  title: textLikeSchema.optional(),
  qty: textLikeSchema.optional(),
  quantity: textLikeSchema.optional(),
  amount: textLikeSchema.optional(),
  checked: booleanLikeSchema.optional(),
  isChecked: booleanLikeSchema.optional(),
  is_checked: booleanLikeSchema.optional(),
  source: shoppingSourceSchema.optional(),
  sourceType: shoppingSourceSchema.optional(),
  source_type: shoppingSourceSchema.optional(),
  sourceLabel: trimmedString.min(1).optional(),
  source_label: trimmedString.min(1).optional(),
  group: trimmedString.min(1).optional(),
  groupName: trimmedString.min(1).optional(),
  group_name: trimmedString.min(1).optional(),
  menuName: trimmedString.min(1).optional(),
  menu_name: trimmedString.min(1).optional(),
}).passthrough().transform((item) => ({
  id: String(item.id),
  name: item.name ?? item.itemName ?? item.item_name ?? item.title ?? 'Untitled item',
  qty: item.qty ?? item.quantity ?? item.amount ?? '1 item',
  checked: item.checked ?? item.isChecked ?? item.is_checked ?? false,
  source: item.source ?? item.sourceType ?? item.source_type ?? 'manual',
  sourceLabel:
    item.sourceLabel
    ?? item.source_label
    ?? item.group
    ?? item.groupName
    ?? item.group_name
    ?? item.menuName
    ?? item.menu_name,
}))

export const shoppingListPayloadSchema = z.object({
  name: trimmedString.min(2, 'Item name must be at least 2 characters'),
  qty: trimmedString.min(1, 'Quantity is required'),
  checked: z.boolean().optional(),
  source: z.enum(['manual', 'meal-plan']).optional(),
  sourceLabel: trimmedString.min(2, 'Group name must be at least 2 characters').optional(),
})

const paginationSchema = z.object({
  limit: numericLikeSchema.optional(),
  offset: numericLikeSchema.optional(),
  total: numericLikeSchema.optional(),
}).passthrough()

const shoppingListDataSchema = z.union([
  z.array(shoppingListSchema).transform((items) => ({
    items,
    pagination: {
      limit: undefined,
      offset: undefined,
      total: undefined,
    },
  })),
  z.object({
    shoppingItems: z.array(shoppingListSchema),
    pagination: paginationSchema.optional(),
    limit: numericLikeSchema.optional(),
    offset: numericLikeSchema.optional(),
    total: numericLikeSchema.optional(),
  }).passthrough().transform((data) => ({
    items: data.shoppingItems,
    pagination: {
      limit: data.pagination?.limit ?? data.limit,
      offset: data.pagination?.offset ?? data.offset,
      total: data.pagination?.total ?? data.total,
    },
  })),
  z.object({
    shoppingLists: z.array(shoppingListSchema),
    pagination: paginationSchema.optional(),
    limit: numericLikeSchema.optional(),
    offset: numericLikeSchema.optional(),
    total: numericLikeSchema.optional(),
  }).passthrough().transform((data) => ({
    items: data.shoppingLists,
    pagination: {
      limit: data.pagination?.limit ?? data.limit,
      offset: data.pagination?.offset ?? data.offset,
      total: data.pagination?.total ?? data.total,
    },
  })),
  z.object({
    items: z.array(shoppingListSchema),
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

export const shoppingListListResponseSchema = z.union([
  z.object({
    data: shoppingListDataSchema,
  }).passthrough().transform((payload) => payload.data),
  shoppingListDataSchema,
])

export const shoppingListResponseSchema = z.union([
  z.object({
    data: shoppingListSchema,
  }).passthrough().transform((payload) => payload.data),
  z.object({
    data: z.object({
      shoppingItem: shoppingListSchema,
    }).passthrough(),
  }).passthrough().transform((payload) => payload.data.shoppingItem),
  z.object({
    data: z.object({
      shoppingList: shoppingListSchema,
    }).passthrough(),
  }).passthrough().transform((payload) => payload.data.shoppingList),
  shoppingListSchema,
])

export type ShoppingList = z.infer<typeof shoppingListSchema>
export type ShoppingListPayloadInput = z.infer<typeof shoppingListPayloadSchema>
export type ShoppingListListResponse = z.infer<typeof shoppingListListResponseSchema>
