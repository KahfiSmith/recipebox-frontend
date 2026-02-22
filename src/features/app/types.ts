export type DashboardMenuKey = 'overview' | 'recipes' | 'meal-planner' | 'shopping-list'

export interface DashboardMenuItem {
  key: DashboardMenuKey
  label: string
  description: string
}

export interface RecipeItem {
  id: string
  name: string
  category: string
  prepTime: number
}

export interface RecipePayload {
  id?: string
  name: string
  category: string
  prepTime: number
}

export interface MealPlanEntry {
  id: string
  day: string
  mealName: string
  servings: number
  ingredients: string[]
  cooked: boolean
}

export interface MealPlanPayload {
  id?: string
  day: string
  mealName: string
  servings: number
  ingredients: string[]
}

export interface AddIngredientsPayload {
  mealName: string
  ingredients: string[]
}

export interface ShoppingItem {
  id: string
  name: string
  qty: string
  checked: boolean
  source: 'manual' | 'meal-plan'
  sourceLabel?: string
}

export interface ShoppingPayload {
  id?: string
  name: string
  qty: string
}
