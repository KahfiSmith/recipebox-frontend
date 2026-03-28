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
import { shoppingListService } from '@/features/app/services/shoopingListService'
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

const localShoppingItems = ref<ShoppingItem[]>([
  {
    id: 'shop-1',
    name: 'Rice',
    qty: '1 kg',
    checked: false,
    source: 'manual',
    sourceLabel: 'General',
  },
])

const remoteShoppingItems = ref<ShoppingItem[]>([])
const isMealPlannerRemoteReady = computed(() =>
  hasApiBaseUrl && sessionReady.value && isAuthenticated.value)
const shouldUseRemoteShoppingItems = computed(() =>
  hasApiBaseUrl && sessionReady.value && isAuthenticated.value)
const mealPlanEntries = computed<MealPlanEntry[]>(() => mealPlansQuery.data.value?.items ?? [])
const shoppingItems = computed(() =>
  shouldUseRemoteShoppingItems.value ? remoteShoppingItems.value : localShoppingItems.value)
const shoppingActionError = ref('')

const invalidateShoppingQueries = async () => {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: ['shopping-items'] }),
    queryClient.invalidateQueries({ queryKey: ['dashboard-overview'] }),
  ])
}

const addIngredientsToShopping = async (payload: AddIngredientsPayload) => {
  shoppingActionError.value = ''

  const existingNames = new Set(
    shoppingItems.value.map((item) => item.name.trim().toLowerCase()),
  )

  const itemsToCreate = payload.ingredients
    .map((ingredient) => ingredient.trim())
    .filter((ingredient) => {
      const normalized = ingredient.toLowerCase()

      if (!normalized || existingNames.has(normalized)) {
        return false
      }

      existingNames.add(normalized)
      return true
    })

  if (!itemsToCreate.length) {
    return
  }

  if (!shouldUseRemoteShoppingItems.value) {
    itemsToCreate.forEach((ingredient) => {
      localShoppingItems.value.unshift({
        id: crypto.randomUUID(),
        name: ingredient,
        qty: '1 item',
        checked: false,
        source: 'meal-plan',
        sourceLabel: payload.mealName,
      })
    })
    return
  }

  try {
    await Promise.all(itemsToCreate.map((ingredient) =>
      shoppingListService.createShoppingListItem({
        name: ingredient,
        qty: '1 item',
        checked: false,
        source: 'meal-plan',
        sourceLabel: payload.mealName,
      })))
    await invalidateShoppingQueries()
  } catch (error) {
    shoppingActionError.value = error instanceof Error
      ? error.message
      : 'Failed to add meal ingredients to shopping list.'
  }
}

const saveShoppingItem = async (payload: ShoppingPayload) => {
  shoppingActionError.value = ''

  const currentItem = payload.id
    ? shoppingItems.value.find((item) => item.id === payload.id)
    : null
  const normalizedPayload: ShoppingPayload = {
    ...payload,
    checked: payload.checked ?? currentItem?.checked ?? false,
    source: payload.source ?? currentItem?.source ?? 'manual',
    sourceLabel: payload.sourceLabel ?? currentItem?.sourceLabel ?? 'General',
  }

  if (shouldUseRemoteShoppingItems.value) {
    await saveShoppingItemMutation.mutateAsync(normalizedPayload)
    return
  }

  if (payload.id) {
    localShoppingItems.value = localShoppingItems.value.map((item) =>
      item.id === payload.id
        ? {
            ...item,
            name: normalizedPayload.name,
            qty: normalizedPayload.qty,
            checked: normalizedPayload.checked ?? item.checked,
            source: normalizedPayload.source ?? item.source,
            sourceLabel: normalizedPayload.sourceLabel,
          }
        : item,
    )
    return
  }

  localShoppingItems.value.unshift({
    id: crypto.randomUUID(),
    name: normalizedPayload.name,
    qty: normalizedPayload.qty,
    checked: normalizedPayload.checked ?? false,
    source: normalizedPayload.source ?? 'manual',
    sourceLabel: normalizedPayload.sourceLabel || 'General',
  })
}

const deleteShoppingItem = async (id: string) => {
  shoppingActionError.value = ''

  if (shouldUseRemoteShoppingItems.value) {
    await deleteShoppingItemMutation.mutateAsync(id)
    return
  }

  localShoppingItems.value = localShoppingItems.value.filter((item) => item.id !== id)
}

const toggleShoppingItem = async (id: string) => {
  shoppingActionError.value = ''

  const item = shoppingItems.value.find((entry) => entry.id === id)
  if (!item) return

  if (shouldUseRemoteShoppingItems.value) {
    await saveShoppingItemMutation.mutateAsync({
      id: item.id,
      name: item.name,
      qty: item.qty,
      checked: !item.checked,
      source: item.source,
      sourceLabel: item.sourceLabel,
    })
    return
  }

  localShoppingItems.value = localShoppingItems.value.map((entry) =>
    entry.id === id ? { ...entry, checked: !entry.checked } : entry,
  )
}

const clearCheckedShoppingItems = async () => {
  shoppingActionError.value = ''

  if (!shouldUseRemoteShoppingItems.value) {
    localShoppingItems.value = localShoppingItems.value.filter((item) => !item.checked)
    return
  }

  const checkedItems = shoppingItems.value.filter((item) => item.checked)
  if (!checkedItems.length) return

  try {
    await Promise.all(checkedItems.map((item) =>
      shoppingListService.deleteShoppingListItem(item.id)))
    await invalidateShoppingQueries()
  } catch (error) {
    shoppingActionError.value = error instanceof Error
      ? error.message
      : 'Failed to clear checked shopping items.'
  }
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
    isMealPlannerRemoteReady.value
    && (activeMenu.value === 'meal-planner' || activeMenu.value === 'shopping-list')),
})

const shoppingItemsQuery = useQuery({
  queryKey: ['shopping-items', 20, 0],
  queryFn: () => shoppingListService.getShoppingList({ limit: 20, offset: 0 }),
  enabled: computed(() =>
    shouldUseRemoteShoppingItems.value
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

const saveShoppingItemMutation = useMutation({
  mutationFn: async (payload: ShoppingPayload) => {
    const { id, ...requestPayload } = payload

    if (id) {
      return shoppingListService.updateShoppingListItem(id, requestPayload)
    }

    return shoppingListService.createShoppingListItem(requestPayload)
  },
  onSuccess: invalidateShoppingQueries,
})

const deleteShoppingItemMutation = useMutation({
  mutationFn: (id: string) => shoppingListService.deleteShoppingListItem(id),
  onSuccess: invalidateShoppingQueries,
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
  () => shoppingItemsQuery.data.value,
  (data) => {
    if (!data) return
    remoteShoppingItems.value = data.items
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
const shoppingErrorMessage = computed(() =>
  shoppingItemsQuery.error.value instanceof Error
    ? shoppingItemsQuery.error.value.message
    : saveShoppingItemMutation.error.value instanceof Error
      ? saveShoppingItemMutation.error.value.message
      : deleteShoppingItemMutation.error.value instanceof Error
        ? deleteShoppingItemMutation.error.value.message
        : shoppingActionError.value)

const saveRecipe = async (payload: RecipePayload) => {
  await saveRecipeMutation.mutateAsync(payload)
}

const deleteRecipe = async (id: string) => {
  await deleteRecipeMutation.mutateAsync(id)
}

const saveMealPlanEntry = async (payload: MealPlanPayload) => {
  if (!isMealPlannerRemoteReady.value) {
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
  if (!isMealPlannerRemoteReady.value) {
    return
  }

  await deleteMealPlanMutation.mutateAsync(id)
}

const toggleMealCooked = async (id: string) => {
  if (!isMealPlannerRemoteReady.value) {
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
    :is-disabled="!isMealPlannerRemoteReady"
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
    :is-loading="shoppingItemsQuery.isPending.value || saveShoppingItemMutation.isPending.value || deleteShoppingItemMutation.isPending.value"
    :menu-options="shoppingMenuOptions"
    :error-message="shoppingErrorMessage"
    @save-item="saveShoppingItem"
    @delete-item="deleteShoppingItem"
    @toggle-item="toggleShoppingItem"
    @clear-checked="clearCheckedShoppingItems"
  />
</template>
