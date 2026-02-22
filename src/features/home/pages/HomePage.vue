<script setup lang="ts">
import { RouterLink } from 'vue-router'

import { Button } from '@/shared/components/ui'

const year = new Date().getFullYear()

const features = [
  {
    icon: '📌',
    title: 'Save Recipes',
    description: 'Save full recipes with ingredients and step-by-step instructions.',
  },
  {
    icon: '🧺',
    title: 'Search by Ingredients',
    description: 'Find recipes based on what you already have at home.',
  },
  {
    icon: '🧾',
    title: 'Shopping List Generator',
    description: 'Generate a clean shopping list from selected recipes.',
  },
  {
    icon: '🗓️',
    title: 'Meal Planning Calendar',
    description: 'Plan your week to stay consistent and organized.',
  },
]

const steps = [
  {
    title: 'Add and save recipes',
    description: 'Store your favorites (ingredients, steps, notes) so you can reuse them anytime.',
  },
  {
    title: 'Search with available ingredients',
    description: 'Pick what you have, then discover recipes you can cook right away.',
  },
  {
    title: 'Generate shopping lists & meal plans',
    description: 'Turn your selections into a plan and a list—shopping becomes straightforward.',
  },
]

const benefits = [
  'Stop wondering “what should I cook today?”.',
  'Reduce wasted ingredients with better planning.',
  'Keep shopping lists tidy and reusable.',
  'Great for meal prep and diet planning.',
]

const recipePreviewItems = [
  { name: 'Chicken Stir Fry', time: '25 min', tags: ['Quick', 'High Protein'] },
  { name: 'Avocado Toast', time: '10 min', tags: ['Breakfast', 'Vegetarian'] },
  { name: 'Salmon Bowl', time: '30 min', tags: ['Omega-3', 'Meal Prep'] },
]

const weeklyPlanPreview = [
  { day: 'Mon', meal: 'Chicken Stir Fry' },
  { day: 'Tue', meal: 'Pasta Primavera' },
  { day: 'Wed', meal: 'Salmon Bowl' },
  { day: 'Thu', meal: 'Veggie Curry' },
  { day: 'Fri', meal: 'Homemade Pizza' },
]

const shoppingPreviewItems = [
  { item: 'Chicken breast', qty: '500 g', checked: true },
  { item: 'Bell pepper', qty: '2 pcs', checked: false },
  { item: 'Broccoli', qty: '1 head', checked: false },
  { item: 'Greek yogurt', qty: '1 cup', checked: true },
]
</script>

<template>
  <section class="grid gap-10 lg:grid-cols-[1.2fr,1fr] lg:items-center">
    <div class="space-y-5">
      <p class="text-xs font-semibold uppercase tracking-[0.25em] text-recipe-orange">
        Recipe Box
      </p>
      <h1 class="text-3xl font-semibold leading-tight text-recipe-ink sm:text-4xl">
        Organize recipes, shopping, and meal plans in one place.
      </h1>
      <p class="max-w-2xl text-base text-slate-600">
        Save your favorites, search by ingredients, plan your week, and generate shopping lists
        automatically.
      </p>
      <div class="flex flex-wrap gap-3">
        <Button :as="RouterLink" to="/app">Open App</Button>
        <Button :as="RouterLink" :to="{ path: '/', hash: '#features' }" variant="secondary">
          See features
        </Button>
      </div>
    </div>

    <div
      class="relative overflow-hidden rounded-2xl border border-recipe-sand-b10 bg-white p-6 shadow-sm"
    >
      <div
        class="absolute inset-0 bg-gradient-to-br from-recipe-peach-w78 via-white to-recipe-mint-w82"
      />
      <div class="relative space-y-4">
        <div class="flex items-center justify-between">
          <p class="text-sm font-semibold text-recipe-ink">This week snapshot</p>
          <span class="rounded-full bg-white/80 px-2 py-1 text-[11px] font-medium text-slate-600">
            3 recipes planned
          </span>
        </div>
        <div class="rounded-xl border border-recipe-sand-b10 bg-white/80 p-3">
          <div class="flex items-center justify-between text-xs text-slate-500">
            <span>Next meal</span>
            <span>Tonight • 19:00</span>
          </div>
          <p class="mt-1 text-sm font-semibold text-recipe-ink">Chicken Stir Fry + Rice</p>
          <p class="text-xs text-slate-600">Prep 10m • Cook 15m</p>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div class="rounded-xl border border-recipe-sand-b10 bg-white/80 p-3">
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-recipe-mint">
              Shopping
            </p>
            <p class="mt-1 text-sm font-semibold text-recipe-ink">8 / 14 items</p>
            <div class="mt-2 h-2 rounded-full bg-recipe-sand-w75">
              <div class="h-full w-2/3 rounded-full bg-recipe-mint"></div>
            </div>
          </div>
          <div class="rounded-xl border border-recipe-sand-b10 bg-white/80 p-3">
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-recipe-orange">
              Weekly plan
            </p>
            <p class="mt-1 text-sm font-semibold text-recipe-ink">5 days filled</p>
            <p class="mt-2 text-xs text-slate-600">Mon to Fri scheduled</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section id="features" class="mt-14 scroll-mt-24">
    <header class="max-w-2xl">
      <h2 class="text-2xl font-semibold text-recipe-ink">Features</h2>
      <p class="mt-2 text-sm text-slate-600">
        Focus on the essentials: recipes, ingredient-based search, meal planning, and smarter
        shopping.
      </p>
    </header>

    <div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <article
        v-for="feature in features"
        :key="feature.title"
        class="rounded-xl border border-recipe-sand-b10 bg-white p-5 shadow-sm"
      >
        <div class="flex items-start justify-between gap-3">
          <p class="text-2xl">{{ feature.icon }}</p>
          <span
            class="rounded-full bg-recipe-sand-w55 px-2.5 py-1 text-xs font-semibold text-recipe-orange"
          >
            New
          </span>
        </div>
        <h3 class="mt-3 text-base font-semibold text-recipe-ink">
          {{ feature.title }}
        </h3>
        <p class="mt-2 text-sm text-slate-600">{{ feature.description }}</p>
      </article>
    </div>
  </section>

  <section id="how-it-works" class="mt-14 scroll-mt-24">
    <header class="max-w-2xl">
      <h2 class="text-2xl font-semibold text-recipe-ink">How it works</h2>
      <p class="mt-2 text-sm text-slate-600">3 simple steps to get organized.</p>
    </header>

    <div class="mt-6 grid gap-4 lg:grid-cols-3">
      <article
        v-for="(step, index) in steps"
        :key="step.title"
        class="rounded-xl border border-recipe-sand-b10 bg-white p-5 shadow-sm"
      >
        <p class="text-xs font-semibold uppercase tracking-[0.25em] text-recipe-mint">
          Step {{ index + 1 }}
        </p>
        <h3 class="mt-2 text-base font-semibold text-recipe-ink">
          {{ step.title }}
        </h3>
        <p class="mt-2 text-sm text-slate-600">{{ step.description }}</p>
      </article>
    </div>
  </section>

  <section id="preview" class="mt-14 scroll-mt-24">
    <header class="max-w-2xl">
      <h2 class="text-2xl font-semibold text-recipe-ink">Preview</h2>
      <p class="mt-2 text-sm text-slate-600">
        A rough UI sketch—replace with real components and data later.
      </p>
    </header>

    <div class="mt-6 grid gap-6 lg:grid-cols-2">
      <div
        class="rounded-2xl border border-recipe-sand-b10 bg-white p-6 shadow-sm"
      >
        <p class="text-sm font-semibold text-recipe-ink">Recipe List</p>
        <p class="mt-1 text-sm text-slate-600">Saved recipes with quick search and tags.</p>
        <div class="mt-5 space-y-3">
          <article
            v-for="recipe in recipePreviewItems"
            :key="recipe.name"
            class="rounded-xl border border-recipe-sand-b10 bg-recipe-sand-w75 p-3"
          >
            <div class="flex items-center justify-between gap-2">
              <p class="text-sm font-semibold text-recipe-ink">{{ recipe.name }}</p>
              <span class="text-xs text-slate-500">{{ recipe.time }}</span>
            </div>
            <div class="mt-2 flex flex-wrap gap-2">
              <span
                v-for="tag in recipe.tags"
                :key="tag"
                class="rounded-full border border-recipe-sand-b12 bg-gradient-to-r from-white to-recipe-peach-w85 px-2 py-1 text-[11px] font-medium text-slate-700 shadow-[0_8px_18px_-14px_rgba(15,23,42,0.45)] transition hover:border-recipe-orange-b10 hover:from-recipe-orange-w85 hover:to-white hover:text-recipe-ink"
              >
                {{ tag }}
              </span>
            </div>
          </article>
        </div>
      </div>

      <div
        class="rounded-2xl border border-recipe-sand-b10 bg-white p-6 shadow-sm"
      >
        <p class="text-sm font-semibold text-recipe-ink">
          Meal Planner / Shopping List
        </p>
        <p class="mt-1 text-sm text-slate-600">Plan meals and auto-generate shopping lists.</p>
        <div class="mt-5 grid gap-3 sm:grid-cols-2">
          <div class="rounded-xl border border-recipe-sand-b10 bg-recipe-mint-w88 p-3">
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-recipe-ink">
              Weekly plan
            </p>
            <ul class="mt-2 space-y-2 text-xs text-slate-700">
              <li
                v-for="plan in weeklyPlanPreview"
                :key="plan.day"
                class="flex items-center justify-between rounded-lg bg-white/70 px-2 py-1.5"
              >
                <span class="font-semibold">{{ plan.day }}</span>
                <span>{{ plan.meal }}</span>
              </li>
            </ul>
          </div>
          <div class="rounded-xl border border-recipe-sand-b10 bg-recipe-mint-w88 p-3">
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-recipe-ink">
              Shopping list
            </p>
            <ul class="mt-2 space-y-2 text-xs text-slate-700">
              <li
                v-for="entry in shoppingPreviewItems"
                :key="entry.item"
                class="flex items-center justify-between rounded-lg bg-white/70 px-2 py-1.5"
              >
                <span class="flex items-center gap-2">
                  <span
                    class="h-2 w-2 rounded-full"
                    :class="entry.checked ? 'bg-emerald-500' : 'bg-slate-300'"
                  ></span>
                  <span>{{ entry.item }}</span>
                </span>
                <span>{{ entry.qty }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section id="benefits" class="mt-14 scroll-mt-24">
    <header class="max-w-2xl">
      <h2 class="text-2xl font-semibold text-recipe-ink">Benefits</h2>
      <p class="mt-2 text-sm text-slate-600">Small wins that make cooking feel easier.</p>
    </header>

    <ul class="mt-6 grid gap-4 lg:grid-cols-2">
      <li
        v-for="benefit in benefits"
        :key="benefit"
        class="rounded-xl border border-recipe-sand-b10 bg-white p-5 text-sm text-slate-700 shadow-sm"
      >
        {{ benefit }}
      </li>
    </ul>
  </section>

  <section
    class="mt-14 overflow-hidden rounded-2xl border border-recipe-sand-b10 bg-white shadow-sm"
  >
    <div
      class="bg-gradient-to-r from-recipe-orange to-recipe-mint px-6 py-10 text-white sm:px-10"
    >
      <h2 class="text-2xl font-semibold">Ready to start?</h2>
      <p class="mt-2 max-w-2xl text-sm text-white/90">
        Open the app and start organizing recipes, shopping, and meal plans.
      </p>
      <div class="mt-6">
        <Button :as="RouterLink" to="/app" variant="secondary">Open App</Button>
      </div>
    </div>
  </section>

  <footer
    class="mt-14 border-t border-recipe-sand-b12 pt-8 text-sm text-slate-500"
  >
    <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <p>Recipe Box • {{ year }}</p>
      <a
        class="text-slate-600 hover:text-recipe-orange"
        href="https://github.com/KahfiSmith"
        target="_blank"
        rel="noreferrer"
      >
        GitHub: KahfiSmith
      </a>
    </div>
  </footer>
</template>
