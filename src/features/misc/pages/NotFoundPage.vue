<script setup lang="ts">
import { RouterLink } from 'vue-router'

import { Button } from '@/shared/components/ui'
</script>

<template>
  <section class="flex flex-col items-center gap-3 py-16 text-center">
    <p class="text-5xl font-extrabold text-recipe-sand-w40">
      404
    </p>
    <h1 class="text-2xl font-semibold text-recipe-ink">Page not found</h1>
    <p class="max-w-md text-sm text-slate-600">
      The page you are looking for doesn’t exist or has moved. Check the URL or head back home.
    </p>
    <Button :as="RouterLink" to="/" variant="secondary">Back to home</Button>
  </section>
</template>
