<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <div
    class="grid min-h-screen grid-rows-[auto,1fr] bg-[color:color-mix(in_oklab,var(--recipe-sand),white_75%)] text-[color:var(--recipe-ink)]"
  >
    <header
      class="border-b border-[color:color-mix(in_oklab,var(--recipe-sand),black_12%)] bg-white/60 backdrop-blur"
    >
      <div class="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
        <div class="flex items-center gap-3">
          <span
            class="flex h-10 w-10 items-center justify-center rounded-xl bg-[color:var(--recipe-orange)] text-lg font-semibold text-white"
          >
            A
          </span>
          <div>
            <p class="text-sm font-semibold text-[color:var(--recipe-ink)]">Auth Area</p>
            <p class="text-xs text-slate-600">Log in to continue</p>
          </div>
        </div>
        <RouterView name="header" />
      </div>
    </header>
    <main class="flex items-center justify-center px-4 py-10">
      <div
        class="w-full max-w-md rounded-2xl border border-[color:color-mix(in_oklab,var(--recipe-sand),black_10%)] bg-white p-8 shadow-[0_18px_50px_-20px_rgba(238,155,106,0.45)]"
      >
        <RouterView />
      </div>
    </main>
  </div>
</template>
