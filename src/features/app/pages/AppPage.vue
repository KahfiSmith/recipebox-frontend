<script setup lang="ts">
import { computed, ref } from 'vue'

import AppMealPlannerPanel from '@/features/app/components/AppMealPlannerPanel.vue'
import AppOverviewPanel from '@/features/app/components/AppOverviewPanel.vue'
import AppRecipesPanel from '@/features/app/components/AppRecipesPanel.vue'
import AppShoppingListPanel from '@/features/app/components/AppShoppingListPanel.vue'
import AppSidebar from '@/features/app/components/AppSidebar.vue'
import type {
  AddIngredientsPayload,
  DashboardMenuItem,
  DashboardMenuKey,
  MealPlanEntry,
  MealPlanPayload,
  RecipeItem,
  RecipePayload,
  ShoppingItem,
  ShoppingPayload,
} from '@/features/app/types'

const activeMenu = ref<DashboardMenuKey>('overview')

const primaryMenu: DashboardMenuItem[] = [
  {
    key: 'overview',
    label: 'Overview',
    description: 'See your activity at a glance',
  },
  {
    key: 'recipes',
    label: 'Recipes',
    description: 'Keep your favorite recipes in one place',
  },
  {
    key: 'meal-planner',
    label: 'Meal Planner',
    description: 'Plan this week\'s meals',
  },
  {
    key: 'shopping-list',
    label: 'Shopping List',
    description: 'Track ingredients you need to buy',
  },
]

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
</script>

<template>
  <section class="grid min-h-[70vh] grid-cols-[260px_minmax(0,1fr)] items-start gap-5">
    <AppSidebar :active-menu="activeMenu" :menu-items="primaryMenu" @change-menu="activeMenu = $event" />

    <AppOverviewPanel
      v-if="activeMenu === 'overview'"
      :recipe-count="recipes.length"
      :planned-meals-count="mealPlanEntries.length"
      :shopping-items-count="shoppingItems.length"
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
  </section>
</template>
