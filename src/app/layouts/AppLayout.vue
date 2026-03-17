<script setup lang="ts">
import { RouterView } from 'vue-router'

</script>

<template>
  <div
    class="min-h-screen bg-linear-to-b from-recipe-sand-w70 via-white to-recipe-mint-w82 text-recipe-ink"
  >
    <main class="w-full px-4 py-10 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <RouterView />
    </main>
  </div>
</template>
