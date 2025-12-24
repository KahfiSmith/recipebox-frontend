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
</script>

<template>
  <section class="grid gap-10 lg:grid-cols-[1.2fr,1fr] lg:items-center">
    <div class="space-y-5">
      <p class="text-xs font-semibold uppercase tracking-[0.25em] text-[color:var(--recipe-orange)]">
        Recipe Box
      </p>
      <h1 class="text-3xl font-semibold leading-tight text-[color:var(--recipe-ink)] sm:text-4xl">
        Organize recipes, shopping, and meal plans in one place.
      </h1>
      <p class="max-w-2xl text-base text-slate-600">
        Save your favorites, search by ingredients, plan your week, and generate shopping lists
        automatically.
      </p>
      <div class="flex flex-wrap gap-3">
        <RouterLink to="/app">
          <Button>Open App</Button>
        </RouterLink>
        <RouterLink :to="{ path: '/', hash: '#features' }">
          <Button variant="secondary">See features</Button>
        </RouterLink>
      </div>
    </div>

    <div
      class="relative overflow-hidden rounded-2xl border border-[color:color-mix(in_oklab,var(--recipe-sand),black_10%)] bg-white p-6 shadow-sm"
    >
      <div
        class="absolute inset-0 bg-gradient-to-br from-[color:color-mix(in_oklab,var(--recipe-peach),white_78%)] via-white to-[color:color-mix(in_oklab,var(--recipe-mint),white_82%)]"
      />
      <div class="relative space-y-4">
        <p class="text-sm font-semibold text-[color:var(--recipe-ink)]">Preview mockup</p>
        <div class="grid gap-3">
          <div
            class="h-12 rounded-xl border border-[color:color-mix(in_oklab,var(--recipe-sand),black_10%)] bg-white/70"
          />
          <div
            class="h-40 rounded-xl border border-[color:color-mix(in_oklab,var(--recipe-sand),black_10%)] bg-white/70"
          />
          <div class="grid grid-cols-2 gap-3">
            <div
              class="h-20 rounded-xl border border-[color:color-mix(in_oklab,var(--recipe-sand),black_10%)] bg-white/70"
            />
            <div
              class="h-20 rounded-xl border border-[color:color-mix(in_oklab,var(--recipe-sand),black_10%)] bg-white/70"
            />
          </div>
        </div>
        <p class="text-xs text-slate-500">
          Placeholder for now—replace with screenshots or illustrations later.
        </p>
      </div>
    </div>
  </section>

  <section id="features" class="mt-14 scroll-mt-24">
    <header class="max-w-2xl">
      <h2 class="text-2xl font-semibold text-[color:var(--recipe-ink)]">Features</h2>
      <p class="mt-2 text-sm text-slate-600">
        Focus on the essentials: recipes, ingredient-based search, meal planning, and smarter
        shopping.
      </p>
    </header>

    <div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <article
        v-for="feature in features"
        :key="feature.title"
        class="rounded-xl border border-[color:color-mix(in_oklab,var(--recipe-sand),black_10%)] bg-white p-5 shadow-sm"
      >
        <div class="flex items-start justify-between gap-3">
          <p class="text-2xl">{{ feature.icon }}</p>
          <span
            class="rounded-full bg-[color:color-mix(in_oklab,var(--recipe-sand),white_55%)] px-2.5 py-1 text-xs font-semibold text-[color:var(--recipe-orange)]"
          >
            New
          </span>
        </div>
        <h3 class="mt-3 text-base font-semibold text-[color:var(--recipe-ink)]">
          {{ feature.title }}
        </h3>
        <p class="mt-2 text-sm text-slate-600">{{ feature.description }}</p>
      </article>
    </div>
  </section>

  <section id="how-it-works" class="mt-14 scroll-mt-24">
    <header class="max-w-2xl">
      <h2 class="text-2xl font-semibold text-[color:var(--recipe-ink)]">How it works</h2>
      <p class="mt-2 text-sm text-slate-600">3 simple steps to get organized.</p>
    </header>

    <div class="mt-6 grid gap-4 lg:grid-cols-3">
      <article
        v-for="(step, index) in steps"
        :key="step.title"
        class="rounded-xl border border-[color:color-mix(in_oklab,var(--recipe-sand),black_10%)] bg-white p-5 shadow-sm"
      >
        <p class="text-xs font-semibold uppercase tracking-[0.25em] text-[color:var(--recipe-mint)]">
          Step {{ index + 1 }}
        </p>
        <h3 class="mt-2 text-base font-semibold text-[color:var(--recipe-ink)]">
          {{ step.title }}
        </h3>
        <p class="mt-2 text-sm text-slate-600">{{ step.description }}</p>
      </article>
    </div>
  </section>

  <section id="preview" class="mt-14 scroll-mt-24">
    <header class="max-w-2xl">
      <h2 class="text-2xl font-semibold text-[color:var(--recipe-ink)]">Preview</h2>
      <p class="mt-2 text-sm text-slate-600">
        A rough UI sketch—replace with real components and data later.
      </p>
    </header>

    <div class="mt-6 grid gap-6 lg:grid-cols-2">
      <div
        class="rounded-2xl border border-[color:color-mix(in_oklab,var(--recipe-sand),black_10%)] bg-white p-6 shadow-sm"
      >
        <p class="text-sm font-semibold text-[color:var(--recipe-ink)]">Recipe List</p>
        <p class="mt-1 text-sm text-slate-600">Saved recipes with quick search.</p>
        <div class="mt-5 space-y-3">
          <div
            class="h-10 rounded-xl border border-[color:color-mix(in_oklab,var(--recipe-sand),black_10%)] bg-[color:color-mix(in_oklab,var(--recipe-sand),white_75%)]"
          />
          <div
            class="h-24 rounded-xl border border-[color:color-mix(in_oklab,var(--recipe-sand),black_10%)] bg-[color:color-mix(in_oklab,var(--recipe-sand),white_75%)]"
          />
          <div
            class="h-24 rounded-xl border border-[color:color-mix(in_oklab,var(--recipe-sand),black_10%)] bg-[color:color-mix(in_oklab,var(--recipe-sand),white_75%)]"
          />
        </div>
      </div>

      <div
        class="rounded-2xl border border-[color:color-mix(in_oklab,var(--recipe-sand),black_10%)] bg-white p-6 shadow-sm"
      >
        <p class="text-sm font-semibold text-[color:var(--recipe-ink)]">
          Meal Planner / Shopping List
        </p>
        <p class="mt-1 text-sm text-slate-600">Plan meals and auto-generate shopping lists.</p>
        <div class="mt-5 grid gap-3 sm:grid-cols-2">
          <div
            class="h-44 rounded-xl border border-[color:color-mix(in_oklab,var(--recipe-sand),black_10%)] bg-[color:color-mix(in_oklab,var(--recipe-mint),white_88%)]"
          />
          <div
            class="h-44 rounded-xl border border-[color:color-mix(in_oklab,var(--recipe-sand),black_10%)] bg-[color:color-mix(in_oklab,var(--recipe-mint),white_88%)]"
          />
        </div>
      </div>
    </div>
  </section>

  <section id="benefits" class="mt-14 scroll-mt-24">
    <header class="max-w-2xl">
      <h2 class="text-2xl font-semibold text-[color:var(--recipe-ink)]">Benefits</h2>
      <p class="mt-2 text-sm text-slate-600">Small wins that make cooking feel easier.</p>
    </header>

    <ul class="mt-6 grid gap-4 lg:grid-cols-2">
      <li
        v-for="benefit in benefits"
        :key="benefit"
        class="rounded-xl border border-[color:color-mix(in_oklab,var(--recipe-sand),black_10%)] bg-white p-5 text-sm text-slate-700 shadow-sm"
      >
        {{ benefit }}
      </li>
    </ul>
  </section>

  <section
    class="mt-14 overflow-hidden rounded-2xl border border-[color:color-mix(in_oklab,var(--recipe-sand),black_10%)] bg-white shadow-sm"
  >
    <div
      class="bg-gradient-to-r from-[color:var(--recipe-orange)] to-[color:var(--recipe-mint)] px-6 py-10 text-white sm:px-10"
    >
      <h2 class="text-2xl font-semibold">Ready to start?</h2>
      <p class="mt-2 max-w-2xl text-sm text-white/90">
        Open the app and start organizing recipes, shopping, and meal plans.
      </p>
      <div class="mt-6">
        <RouterLink to="/app">
          <Button variant="secondary">Open App</Button>
        </RouterLink>
      </div>
    </div>
  </section>

  <footer
    class="mt-14 border-t border-[color:color-mix(in_oklab,var(--recipe-sand),black_12%)] pt-8 text-sm text-slate-500"
  >
    <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <p>Recipe Box • {{ year }}</p>
      <a
        class="text-slate-600 hover:text-[color:var(--recipe-orange)]"
        href="https://github.com/KahfiSmith"
        target="_blank"
        rel="noreferrer"
      >
        GitHub: KahfiSmith
      </a>
    </div>
  </footer>
</template>
