<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <div
    class="relative min-h-screen overflow-hidden bg-[color:color-mix(in_oklab,var(--recipe-sand),white_80%)] text-[color:var(--recipe-ink)]"
  >
    <div
      aria-hidden="true"
      class="pointer-events-none absolute -top-24 right-6 h-64 w-64 rounded-full bg-[color:color-mix(in_oklab,var(--recipe-orange),white_70%)] blur-3xl"
    ></div>
    <div
      aria-hidden="true"
      class="pointer-events-none absolute -bottom-24 left-4 h-72 w-72 rounded-full bg-[color:color-mix(in_oklab,var(--recipe-green),white_70%)] blur-[90px]"
    ></div>
    <main class="relative flex min-h-screen items-center justify-center px-4 py-12">
      <div class="w-full max-w-md">
        <div
          class="w-full rounded-2xl border border-[color:color-mix(in_oklab,var(--recipe-sand),black_10%)] bg-white p-8 shadow-[0_18px_50px_-20px_rgba(238,155,106,0.4)]"
        >
          <RouterView />
        </div>
      </div>
    </main>
  </div>
</template>
