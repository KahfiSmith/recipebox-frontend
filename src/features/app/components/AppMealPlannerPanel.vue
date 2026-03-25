<script setup lang="ts">
import { computed, reactive, ref } from 'vue'

import type { AddIngredientsPayload, MealPlanEntry, MealPlanPayload } from '@/features/app/types'
import { Button, Input } from '@/shared/components/ui'
import { isMinLength } from '@/shared/lib/validators'

const props = defineProps<{
  entries: MealPlanEntry[]
  isLoading?: boolean
  isDisabled?: boolean
  errorMessage?: string
}>()

const emit = defineEmits<{
  (e: 'save-entry', payload: MealPlanPayload): void
  (e: 'delete-entry', id: string): void
  (e: 'toggle-cooked', id: string): void
  (e: 'add-ingredients', payload: AddIngredientsPayload): void
}>()

const form = reactive({
  day: 'Monday',
  mealName: '',
  servings: 2,
  ingredientsText: '',
})

const editingId = ref<string | null>(null)
const error = ref('')

const cookedCount = computed(() => props.entries.filter((entry) => entry.cooked).length)

const resetForm = () => {
  form.day = 'Monday'
  form.mealName = ''
  form.servings = 2
  form.ingredientsText = ''
  editingId.value = null
  error.value = ''
}

const toIngredients = (value: string) =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)

const handleSubmit = () => {
  if (props.isDisabled) {
    return
  }

  error.value = ''

  if (!isMinLength(form.mealName.trim(), 2)) {
    error.value = 'Meal name must be at least 2 characters.'
    return
  }

  if (Number(form.servings) <= 0) {
    error.value = 'Servings must be greater than 0.'
    return
  }

  const ingredients = toIngredients(form.ingredientsText)
  if (!ingredients.length) {
    error.value = 'Add at least one ingredient (separate items with commas).'
    return
  }

  emit('save-entry', {
    id: editingId.value ?? undefined,
    day: form.day,
    mealName: form.mealName.trim(),
    servings: Number(form.servings),
    ingredients,
  })

  resetForm()
}

const handleEdit = (entry: MealPlanEntry) => {
  if (props.isDisabled) {
    return
  }

  editingId.value = entry.id
  form.day = entry.day
  form.mealName = entry.mealName
  form.servings = entry.servings
  form.ingredientsText = entry.ingredients.join(', ')
  error.value = ''
}

const handleSendIngredients = (entry: MealPlanEntry) => {
  if (props.isDisabled) {
    return
  }

  emit('add-ingredients', {
    mealName: entry.mealName,
    ingredients: entry.ingredients,
  })
}
</script>

<template>
  <div class="min-w-0 space-y-6">
    <header class="rounded-2xl border border-recipe-sand-b10 bg-white p-6 shadow-sm">
      <p class="text-xs font-semibold uppercase tracking-[0.2em] text-recipe-orange">Meal Planner</p>
      <h1 class="mt-2 text-2xl font-semibold text-recipe-ink">Weekly planner</h1>
      <p class="mt-2 max-w-2xl text-sm text-slate-600">
        Plan meals for each day, mark what is cooked, and send ingredients to your shopping list.
      </p>
      <div class="mt-4 flex flex-wrap gap-2 text-xs">
        <span class="rounded-full border border-recipe-sand-b10 bg-recipe-sand-w75 px-3 py-1">
          {{ entries.length }} planned meals
        </span>
        <span class="rounded-full border border-recipe-sand-b10 bg-recipe-mint-w88 px-3 py-1">
          {{ cookedCount }} cooked
        </span>
      </div>
    </header>

    <section class="rounded-2xl border border-recipe-sand-b10 bg-white p-6 shadow-sm">
      <h2 class="text-lg font-semibold text-recipe-ink">
        {{ editingId ? 'Edit meal plan' : 'Add meal plan' }}
      </h2>

      <form class="mt-4 grid gap-4 sm:grid-cols-2" @submit.prevent="handleSubmit">
        <label class="block text-sm font-medium text-recipe-ink">
          Day
          <select
            v-model="form.day"
            :disabled="props.isDisabled"
            class="mt-2 w-full rounded-lg border border-recipe-sand bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-recipe-mint focus:ring-2 focus:ring-recipe-mint-w60 focus:ring-offset-1"
          >
            <option>Monday</option>
            <option>Tuesday</option>
            <option>Wednesday</option>
            <option>Thursday</option>
            <option>Friday</option>
            <option>Saturday</option>
            <option>Sunday</option>
          </select>
        </label>

        <Input
          v-model="form.mealName"
          :disabled="props.isDisabled"
          label="Meal name"
          name="meal-name"
          placeholder="Chicken Stir Fry"
          required
        />
        <Input
          v-model="form.servings"
          :disabled="props.isDisabled"
          type="number"
          min="1"
          label="Servings"
          name="servings"
          required
        />
        <Input
          v-model="form.ingredientsText"
          :disabled="props.isDisabled"
          label="Ingredients (comma separated)"
          name="ingredients"
          placeholder="Chicken breast, bell pepper, garlic"
          required
        />

        <p
          v-if="error"
          class="sm:col-span-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {{ error }}
        </p>

        <div class="sm:col-span-2 flex flex-wrap gap-3">
          <Button :disabled="props.isDisabled">{{ editingId ? 'Update meal' : 'Save meal' }}</Button>
          <Button :disabled="props.isDisabled" type="button" variant="ghost" @click="resetForm">Reset</Button>
        </div>
      </form>
    </section>

    <section class="rounded-2xl border border-recipe-sand-b10 bg-white p-6 shadow-sm">
      <h2 class="text-lg font-semibold text-recipe-ink">Planned meals</h2>

      <p
        v-if="props.errorMessage"
        class="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
      >
        {{ props.errorMessage }}
      </p>

      <div v-if="entries.length" class="mt-4 space-y-3">
        <article
          v-for="entry in entries"
          :key="entry.id"
          class="rounded-xl border border-recipe-sand-b10 bg-recipe-sand-w75 p-4"
        >
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p class="text-sm font-semibold text-recipe-ink">{{ entry.day }} • {{ entry.mealName }}</p>
              <p class="mt-1 text-xs text-slate-600">
                {{ entry.servings }} servings • {{ entry.ingredients.join(', ') }}
              </p>
            </div>
            <span
              class="rounded-full px-2 py-1 text-[11px] font-semibold"
              :class="entry.cooked ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'"
            >
              {{ entry.cooked ? 'Cooked' : 'Planned' }}
            </span>
          </div>

          <div class="mt-3 flex flex-wrap gap-2">
            <Button :disabled="props.isDisabled" size="sm" variant="secondary" @click="handleEdit(entry)">Edit</Button>
            <Button :disabled="props.isDisabled" size="sm" variant="ghost" @click="emit('toggle-cooked', entry.id)">
              {{ entry.cooked ? 'Mark planned' : 'Mark cooked' }}
            </Button>
            <Button :disabled="props.isDisabled" size="sm" variant="ghost" @click="handleSendIngredients(entry)">
              To shopping
            </Button>
            <Button :disabled="props.isDisabled" size="sm" variant="ghost" @click="emit('delete-entry', entry.id)">
              Delete
            </Button>
          </div>
        </article>
      </div>

      <p v-else-if="!props.isLoading" class="mt-4 text-sm text-slate-500">
        No meal plans yet for this week.
      </p>
    </section>
  </div>
</template>
