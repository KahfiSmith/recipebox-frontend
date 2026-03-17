<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

import AppMealPlannerPanel from '@/features/app/components/AppMealPlannerPanel.vue'
import AppOverviewPanel from '@/features/app/components/AppOverviewPanel.vue'
import AppRecipesPanel from '@/features/app/components/AppRecipesPanel.vue'
import AppShoppingListPanel from '@/features/app/components/AppShoppingListPanel.vue'
import { dashboardService } from '@/features/app/services/dashboardService'
import type {
  AddIngredientsPayload,
  DashboardMenuKey,
  MealPlanEntry,
  MealPlanPayload,
  RecipeItem,
  RecipePayload,
  ShoppingItem,
  ShoppingPayload,
} from '@/features/app/types'
import { useAuth } from '@/shared/composables/useAuth'

const hasApiBaseUrl = Boolean(import.meta.env.VITE_API_BASE_URL)
const route = useRoute()
const { isAuthenticated, sessionReady } = useAuth()

const isDashboardMenuKey = (value: unknown): value is DashboardMenuKey =>
  value === 'overview'
  || value === 'recipes'
  || value === 'meal-planner'
  || value === 'shopping-list'

const activeMenu = computed<DashboardMenuKey>(() => {
  const rawValue = route.query.menu

  if (typeof rawValue === 'string' && isDashboardMenuKey(rawValue)) {
    return rawValue
  }

  return 'overview'
})

const recipes = ref<RecipeItem[]>([
  { id: 'recipe-1', name: 'Chicken Stir Fry', category: 'Dinner', prepTime: 25 },
  { id: 'recipe-2', name: 'Overnight Oats', category: 'Breakfast', prepTime: 10 },
])

const mealPlanEntries = ref<MealPlanEntry[]>([
  {
    id: 'meal-1',
    day: 'Monday',
    mealName: 'Chicken Stir Fry',
    servings: 2,
    ingredients: ['Chicken breast', 'Bell pepper', 'Garlic'],
    cooked: false,
  },
])

const shoppingItems = ref<ShoppingItem[]>([
  {
    id: 'shop-1',
    name: 'Rice',
    qty: '1 kg',
    checked: false,
    source: 'manual',
    sourceLabel: 'General',
  },
])

const saveRecipe = (payload: RecipePayload) => {
  if (payload.id) {
    recipes.value = recipes.value.map((recipe) =>
      recipe.id === payload.id ? { ...recipe, ...payload, id: payload.id } : recipe,
    )
    return
  }

  recipes.value.unshift({
    id: crypto.randomUUID(),
    ...payload,
  })
}

const deleteRecipe = (id: string) => {
  recipes.value = recipes.value.filter((recipe) => recipe.id !== id)
}

const saveMealPlanEntry = (payload: MealPlanPayload) => {
  if (payload.id) {
    mealPlanEntries.value = mealPlanEntries.value.map((entry) =>
      entry.id === payload.id
        ? { ...entry, ...payload, id: payload.id, cooked: entry.cooked }
        : entry,
    )
    return
  }

  mealPlanEntries.value.unshift({
    id: crypto.randomUUID(),
    ...payload,
    cooked: false,
  })
}

const deleteMealPlanEntry = (id: string) => {
  mealPlanEntries.value = mealPlanEntries.value.filter((entry) => entry.id !== id)
}

const toggleMealCooked = (id: string) => {
  mealPlanEntries.value = mealPlanEntries.value.map((entry) =>
    entry.id === id ? { ...entry, cooked: !entry.cooked } : entry,
  )
}

const addIngredientsToShopping = (payload: AddIngredientsPayload) => {
  payload.ingredients.forEach((ingredient) => {
    const normalized = ingredient.trim().toLowerCase()
    if (!normalized) return

    const existing = shoppingItems.value.find((item) => item.name.toLowerCase() === normalized)
    if (existing) return

    shoppingItems.value.unshift({
      id: crypto.randomUUID(),
      name: ingredient.trim(),
      qty: '1 item',
      checked: false,
      source: 'meal-plan',
      sourceLabel: payload.mealName,
    })
  })
}

const saveShoppingItem = (payload: ShoppingPayload) => {
  if (payload.id) {
    shoppingItems.value = shoppingItems.value.map((item) =>
      item.id === payload.id
        ? { ...item, name: payload.name, qty: payload.qty, sourceLabel: payload.sourceLabel }
        : item,
    )
    return
  }

  shoppingItems.value.unshift({
    id: crypto.randomUUID(),
    name: payload.name,
    qty: payload.qty,
    checked: false,
    source: 'manual',
    sourceLabel: payload.sourceLabel || 'General',
  })
}

const deleteShoppingItem = (id: string) => {
  shoppingItems.value = shoppingItems.value.filter((item) => item.id !== id)
}

const toggleShoppingItem = (id: string) => {
  shoppingItems.value = shoppingItems.value.map((item) =>
    item.id === id ? { ...item, checked: !item.checked } : item,
  )
}

const clearCheckedShoppingItems = () => {
  shoppingItems.value = shoppingItems.value.filter((item) => !item.checked)
}

const shoppingMenuOptions = computed(() => {
  const options = new Set<string>()

  mealPlanEntries.value.forEach((entry) => {
    options.add(entry.mealName)
  })

  shoppingItems.value.forEach((item) => {
    const label = item.sourceLabel?.trim()
    if (label) options.add(label)
  })

  if (!options.size) options.add('General')

  return Array.from(options)
})

const dashboardQuery = useQuery({
  queryKey: ['dashboard-overview'],
  queryFn: dashboardService.getDashboard,
  enabled: computed(() =>
    hasApiBaseUrl && sessionReady.value && isAuthenticated.value),
})

const overviewStatusMessage = computed(() => {
  if (!hasApiBaseUrl) {
    return 'Workspace masih memakai data lokal karena VITE_API_BASE_URL belum di-set.'
  }

  if (!sessionReady.value) {
    return 'Restoring session before loading dashboard summary...'
  }

  if (!isAuthenticated.value) {
    return 'Dashboard summary from API tersedia setelah login.'
  }

  if (dashboardQuery.isPending.value) {
    return 'Loading dashboard summary from API...'
  }

  if (dashboardQuery.error.value instanceof Error) {
    return dashboardQuery.error.value.message
  }

  return 'Dashboard summary loaded from API.'
})

const overviewRecipeCount = computed(() =>
  dashboardQuery.data.value?.summary.recipeCount ?? recipes.value.length)
const overviewMealPlanCount = computed(() =>
  dashboardQuery.data.value?.summary.upcomingMealPlanCount ?? mealPlanEntries.value.length)
const overviewShoppingItemCount = computed(() =>
  dashboardQuery.data.value?.summary.pendingShoppingItemCount ?? shoppingItems.value.length)
</script>

<template>
  <AppOverviewPanel
    v-if="activeMenu === 'overview'"
    :recipe-count="overviewRecipeCount"
    :planned-meals-count="overviewMealPlanCount"
    :shopping-items-count="overviewShoppingItemCount"
    :status-message="overviewStatusMessage"
  />
  <AppRecipesPanel
    v-else-if="activeMenu === 'recipes'"
    :recipes="recipes"
    @save-recipe="saveRecipe"
    @delete-recipe="deleteRecipe"
  />
  <AppMealPlannerPanel
    v-else-if="activeMenu === 'meal-planner'"
    :entries="mealPlanEntries"
    @save-entry="saveMealPlanEntry"
    @delete-entry="deleteMealPlanEntry"
    @toggle-cooked="toggleMealCooked"
    @add-ingredients="addIngredientsToShopping"
  />
  <AppShoppingListPanel
    v-else
    :items="shoppingItems"
    :menu-options="shoppingMenuOptions"
    @save-item="saveShoppingItem"
    @delete-item="deleteShoppingItem"
    @toggle-item="toggleShoppingItem"
    @clear-checked="clearCheckedShoppingItems"
  />
</template>
