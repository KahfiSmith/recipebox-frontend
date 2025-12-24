<script setup lang="ts">
import { RouterLink } from 'vue-router'

import { Button } from '@/shared/components/ui'
import { APP_NAME } from '@/shared/constants'
</script>

<template>
  <header
    class="sticky top-0 z-50 border-b border-[color:color-mix(in_oklab,var(--recipe-sand),black_12%)] bg-white/70 backdrop-blur"
  >
    <div class="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
      <RouterLink to="/" class="flex items-center gap-3">
        <div class="space-y-0.5">
          <p class="text-sm font-semibold text-[color:var(--recipe-ink)]">{{ APP_NAME }}</p>
          <p class="text-xs text-slate-600">Recipe Manager</p>
        </div>
      </RouterLink>

      <nav class="flex items-center gap-3">
        <RouterLink
          :to="{ path: '/', hash: '#features' }"
          class="hidden text-sm font-medium text-slate-700 hover:text-[color:var(--recipe-orange)] md:inline-flex"
        >
          Features
        </RouterLink>
        <RouterLink
          :to="{ path: '/', hash: '#how-it-works' }"
          class="hidden text-sm font-medium text-slate-700 hover:text-[color:var(--recipe-orange)] md:inline-flex"
        >
          How it works
        </RouterLink>
        <RouterLink
          :to="{ path: '/', hash: '#preview' }"
          class="hidden text-sm font-medium text-slate-700 hover:text-[color:var(--recipe-orange)] md:inline-flex"
        >
          Preview
        </RouterLink>
        <RouterLink to="/app">
          <Button>Open App</Button>
        </RouterLink>
      </nav>
    </div>
  </header>
</template>
