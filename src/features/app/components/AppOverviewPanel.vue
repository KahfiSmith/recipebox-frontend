<script setup lang="ts">
import { RouterLink } from 'vue-router'

import { Button } from '@/shared/components/ui'

defineProps<{
  recipeCount: number
  plannedMealsCount: number
  shoppingItemsCount: number
}>()
</script>

<template>
  <div class="min-w-0 space-y-6">
    <header class="rounded-2xl border border-recipe-sand-b10 bg-white p-6 shadow-sm">
      <p class="text-xs font-semibold uppercase tracking-[0.2em] text-recipe-orange">Overview</p>
      <h1 class="mt-2 text-2xl font-semibold text-recipe-ink">Welcome to your dashboard</h1>
      <p class="mt-2 max-w-2xl text-sm text-slate-600">
        Bagian overview untuk ringkasan. CRUD utama diletakkan di menu Recipes agar alurnya jelas.
      </p>
      <div class="mt-4 flex flex-wrap gap-3">
        <Button :as="RouterLink" to="/app/profile" variant="secondary">Open Profile</Button>
        <Button :as="RouterLink" to="/" variant="ghost">Back to Landing</Button>
      </div>
    </header>

    <div class="grid gap-4 sm:grid-cols-3">
      <article class="rounded-xl border border-recipe-sand-b10 bg-white p-4 shadow-sm">
        <p class="text-xs uppercase tracking-[0.16em] text-slate-500">Recipes</p>
        <p class="mt-2 text-2xl font-semibold text-recipe-ink">{{ recipeCount }}</p>
        <p class="mt-1 text-xs text-slate-500">Total resep saat ini</p>
      </article>
      <article class="rounded-xl border border-recipe-sand-b10 bg-white p-4 shadow-sm">
        <p class="text-xs uppercase tracking-[0.16em] text-slate-500">Planned Meals</p>
        <p class="mt-2 text-2xl font-semibold text-recipe-ink">{{ plannedMealsCount }}</p>
        <p class="mt-1 text-xs text-slate-500">Minggu ini</p>
      </article>
      <article class="rounded-xl border border-recipe-sand-b10 bg-white p-4 shadow-sm">
        <p class="text-xs uppercase tracking-[0.16em] text-slate-500">Shopping Items</p>
        <p class="mt-2 text-2xl font-semibold text-recipe-ink">{{ shoppingItemsCount }}</p>
        <p class="mt-1 text-xs text-slate-500">Daftar aktif</p>
      </article>
    </div>
  </div>
</template>
