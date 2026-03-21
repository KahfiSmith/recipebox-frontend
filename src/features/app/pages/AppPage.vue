<script setup lang="ts">
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import AppMealPlannerPanel from '@/features/app/components/AppMealPlannerPanel.vue'
import AppOverviewPanel from '@/features/app/components/AppOverviewPanel.vue'
import AppRecipesPanel from '@/features/app/components/AppRecipesPanel.vue'
import AppShoppingListPanel from '@/features/app/components/AppShoppingListPanel.vue'
import { dashboardService } from '@/features/app/services/dashboardService'
import { mealPlanService } from '@/features/app/services/mealPlanService'
import { recipeService } from '@/features/app/services/recipeService'
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
const queryClient = useQueryClient()

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

const recipes = ref<RecipeItem[]>([])

const localMealPlanEntries = ref<MealPlanEntry[]>([
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

const remoteMealPlanEntries = ref<MealPlanEntry[]>([])
const shouldUseRemoteMealPlans = computed(() =>
  hasApiBaseUrl && sessionReady.value && isAuthenticated.value)
const mealPlanEntries = computed(() =>
  shouldUseRemoteMealPlans.value ? remoteMealPlanEntries.value : localMealPlanEntries.value)

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

const recipesQuery = useQuery({
  queryKey: ['recipes', 20, 0],
  queryFn: () => recipeService.getRecipes({ limit: 20, offset: 0 }),
  enabled: computed(() =>
    hasApiBaseUrl
    && sessionReady.value
    && isAuthenticated.value
    && activeMenu.value === 'recipes'),
})

const mealPlansQuery = useQuery({
  queryKey: ['meal-plans', 20, 0],
  queryFn: () => mealPlanService.getMealPlans({ limit: 20, offset: 0 }),
  enabled: computed(() =>
    shouldUseRemoteMealPlans.value
    && (activeMenu.value === 'meal-planner' || activeMenu.value === 'shopping-list')),
})

const saveRecipeMutation = useMutation({
  mutationFn: async (payload: RecipePayload) => {
    if (payload.id) {
      return recipeService.updateRecipe(payload.id, payload)
    }

    return recipeService.createRecipe(payload)
  },
  onSuccess: async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['recipes'] }),
      queryClient.invalidateQueries({ queryKey: ['dashboard-overview'] }),
    ])
  },
})

const deleteRecipeMutation = useMutation({
  mutationFn: (id: string) => recipeService.deleteRecipe(id),
  onSuccess: async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['recipes'] }),
      queryClient.invalidateQueries({ queryKey: ['dashboard-overview'] }),
    ])
  },
})

const saveMealPlanMutation = useMutation({
  mutationFn: async (payload: MealPlanPayload) => {
    if (payload.id) {
      return mealPlanService.updateMealPlan(payload.id, payload)
    }

    return mealPlanService.createMealPlan(payload)
  },
  onSuccess: async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['meal-plans'] }),
      queryClient.invalidateQueries({ queryKey: ['dashboard-overview'] }),
    ])
  },
})

const deleteMealPlanMutation = useMutation({
  mutationFn: (id: string) => mealPlanService.deleteMealPlan(id),
  onSuccess: async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['meal-plans'] }),
      queryClient.invalidateQueries({ queryKey: ['dashboard-overview'] }),
    ])
  },
})

watch(
  () => recipesQuery.data.value,
  (data) => {
    if (!data) return
    recipes.value = data.items
  },
  { immediate: true },
)

watch(
  () => mealPlansQuery.data.value,
  (data) => {
    if (!data) return
    remoteMealPlanEntries.value = data.items
  },
  { immediate: true },
)

const overviewRecipeCount = computed(() =>
  dashboardQuery.data.value?.summary.recipeCount ?? recipes.value.length)
const overviewMealPlanCount = computed(() =>
  dashboardQuery.data.value?.summary.upcomingMealPlanCount ?? mealPlanEntries.value.length)
const overviewShoppingItemCount = computed(() =>
  dashboardQuery.data.value?.summary.pendingShoppingItemCount ?? shoppingItems.value.length)
const recipeErrorMessage = computed(() =>
  recipesQuery.error.value instanceof Error
    ? recipesQuery.error.value.message
    : saveRecipeMutation.error.value instanceof Error
      ? saveRecipeMutation.error.value.message
      : deleteRecipeMutation.error.value instanceof Error
        ? deleteRecipeMutation.error.value.message
        : '')
const mealPlanErrorMessage = computed(() =>
  mealPlansQuery.error.value instanceof Error
    ? mealPlansQuery.error.value.message
    : saveMealPlanMutation.error.value instanceof Error
      ? saveMealPlanMutation.error.value.message
      : deleteMealPlanMutation.error.value instanceof Error
        ? deleteMealPlanMutation.error.value.message
        : '')

const saveRecipe = async (payload: RecipePayload) => {
  await saveRecipeMutation.mutateAsync(payload)
}

const deleteRecipe = async (id: string) => {
  await deleteRecipeMutation.mutateAsync(id)
}

const saveMealPlanEntry = async (payload: MealPlanPayload) => {
  if (!shouldUseRemoteMealPlans.value) {
    if (payload.id) {
      localMealPlanEntries.value = localMealPlanEntries.value.map((entry) =>
        entry.id === payload.id
          ? { ...entry, ...payload, id: payload.id, cooked: entry.cooked }
          : entry,
      )
      return
    }

    localMealPlanEntries.value.unshift({
      id: crypto.randomUUID(),
      ...payload,
      cooked: false,
    })
    return
  }

  const currentEntry = payload.id
    ? mealPlanEntries.value.find((entry) => entry.id === payload.id)
    : null

  await saveMealPlanMutation.mutateAsync({
    ...payload,
    cooked: payload.cooked ?? currentEntry?.cooked ?? false,
  })
}

const deleteMealPlanEntry = async (id: string) => {
  if (!shouldUseRemoteMealPlans.value) {
    localMealPlanEntries.value = localMealPlanEntries.value.filter((entry) => entry.id !== id)
    return
  }

  await deleteMealPlanMutation.mutateAsync(id)
}

const toggleMealCooked = async (id: string) => {
  if (!shouldUseRemoteMealPlans.value) {
    localMealPlanEntries.value = localMealPlanEntries.value.map((entry) =>
      entry.id === id ? { ...entry, cooked: !entry.cooked } : entry,
    )
    return
  }

  const entry = mealPlanEntries.value.find((item) => item.id === id)
  if (!entry) return

  await saveMealPlanMutation.mutateAsync({
    id: entry.id,
    day: entry.day,
    mealName: entry.mealName,
    servings: entry.servings,
    ingredients: entry.ingredients,
    cooked: !entry.cooked,
  })
}
</script>

<template>
  <AppOverviewPanel
    v-if="activeMenu === 'overview'"
    :recipe-count="overviewRecipeCount"
    :planned-meals-count="overviewMealPlanCount"
    :shopping-items-count="overviewShoppingItemCount"
  />
  <AppRecipesPanel
    v-else-if="activeMenu === 'recipes'"
    :recipes="recipes"
    :is-loading="recipesQuery.isPending.value || saveRecipeMutation.isPending.value || deleteRecipeMutation.isPending.value"
    :error-message="recipeErrorMessage"
    @save-recipe="saveRecipe"
    @delete-recipe="deleteRecipe"
  />
  <AppMealPlannerPanel
    v-else-if="activeMenu === 'meal-planner'"
    :entries="mealPlanEntries"
    :is-loading="mealPlansQuery.isPending.value || saveMealPlanMutation.isPending.value || deleteMealPlanMutation.isPending.value"
    :error-message="mealPlanErrorMessage"
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
