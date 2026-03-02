<script setup lang="ts">
import { computed, reactive, ref } from 'vue'

import type { RecipeItem, RecipePayload } from '@/features/app/types'
import { Button, Input } from '@/shared/components/ui'
import { isMinLength } from '@/shared/lib/validators'

const props = defineProps<{
  recipes: RecipeItem[]
}>()

const emit = defineEmits<{
  (e: 'save-recipe', payload: RecipePayload): void
  (e: 'delete-recipe', id: string): void
}>()

const form = reactive({
  name: '',
  category: '',
  prepTime: 15,
})

const editingId = ref<string | null>(null)
const error = ref('')

const submitLabel = computed(() => (editingId.value ? 'Update recipe' : 'Add recipe'))

const resetForm = () => {
  form.name = ''
  form.category = ''
  form.prepTime = 15
  editingId.value = null
  error.value = ''
}

const handleSubmit = () => {
  error.value = ''

  if (!isMinLength(form.name.trim(), 2)) {
    error.value = 'Recipe name must be at least 2 characters.'
    return
  }

  if (!isMinLength(form.category.trim(), 2)) {
    error.value = 'Category must be at least 2 characters.'
    return
  }

  if (Number(form.prepTime) <= 0) {
    error.value = 'Prep time must be greater than 0.'
    return
  }

  if (editingId.value) {
    emit('save-recipe', {
      id: editingId.value,
      name: form.name.trim(),
      category: form.category.trim(),
      prepTime: Number(form.prepTime),
    })
  } else {
    emit('save-recipe', {
      name: form.name.trim(),
      category: form.category.trim(),
      prepTime: Number(form.prepTime),
    })
  }

  resetForm()
}

const handleEdit = (item: RecipeItem) => {
  editingId.value = item.id
  form.name = item.name
  form.category = item.category
  form.prepTime = item.prepTime
  error.value = ''
}

const handleDelete = (id: string) => {
  emit('delete-recipe', id)
  if (editingId.value === id) resetForm()
}
</script>

<template>
  <div class="min-w-0 space-y-6">
    <header class="rounded-2xl border border-recipe-sand-b10 bg-white p-6 shadow-sm">
      <p class="text-xs font-semibold uppercase tracking-[0.2em] text-recipe-orange">Recipes</p>
      <h1 class="mt-2 text-2xl font-semibold text-recipe-ink">Your recipes</h1>
      <p class="mt-2 max-w-2xl text-sm text-slate-600">
        Save, update, and organize recipes so your go-to meals are always easy to find.
      </p>
    </header>

    <section class="rounded-2xl border border-recipe-sand-b10 bg-white p-6 shadow-sm">
      <h2 class="text-lg font-semibold text-recipe-ink">
        {{ editingId ? 'Edit recipe' : 'Add new recipe' }}
      </h2>

      <form class="mt-4 grid gap-4 sm:grid-cols-3" @submit.prevent="handleSubmit">
        <Input v-model="form.name" label="Recipe name" name="recipe-name" placeholder="Fried rice" required />
        <Input v-model="form.category" label="Category" name="recipe-category" placeholder="Dinner" required />
        <Input
          v-model="form.prepTime"
          label="Prep time (minutes)"
          name="recipe-prep-time"
          type="number"
          min="1"
          required
        />

        <p
          v-if="error"
          class="sm:col-span-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {{ error }}
        </p>

        <div class="sm:col-span-3 flex flex-wrap gap-3">
          <Button>{{ submitLabel }}</Button>
          <Button type="button" variant="ghost" @click="resetForm">Reset</Button>
        </div>
      </form>
    </section>

    <section class="rounded-2xl border border-recipe-sand-b10 bg-white p-6 shadow-sm">
      <div class="mb-4 flex items-center justify-between">
        <h2 class="text-lg font-semibold text-recipe-ink">Recipe list</h2>
        <p class="text-sm text-slate-500">{{ props.recipes.length }} item</p>
      </div>

      <div v-if="props.recipes.length" class="space-y-3">
        <article
          v-for="item in props.recipes"
          :key="item.id"
          class="rounded-xl border border-recipe-sand-b10 bg-recipe-sand-w75 p-4"
        >
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p class="text-sm font-semibold text-recipe-ink">{{ item.name }}</p>
              <p class="mt-1 text-xs text-slate-600">{{ item.category }} • {{ item.prepTime }} min</p>
            </div>
            <div class="flex gap-2">
              <Button size="sm" variant="secondary" @click="handleEdit(item)">Edit</Button>
              <Button size="sm" variant="ghost" @click="handleDelete(item.id)">Delete</Button>
            </div>
          </div>
        </article>
      </div>

      <p v-else class="text-sm text-slate-500">No recipes yet. Add your first recipe.</p>
    </section>
  </div>
</template>
