<script setup lang="ts">
import { RouterLink } from 'vue-router'

import { Button } from '@/shared/components/ui'
</script>

<template>
  <section class="space-y-4">
    <h1 class="text-2xl font-semibold text-slate-900">App (Placeholder)</h1>
    <p class="max-w-2xl text-sm text-slate-600">
      This page is reserved for the main app later. For now it’s just a UI placeholder.
    </p>
    <div class="flex flex-wrap gap-3">
      <RouterLink to="/">
        <Button variant="secondary">Back to Landing</Button>
      </RouterLink>
      <RouterLink to="/auth/login">
        <Button>Login</Button>
      </RouterLink>
    </div>
  </section>
</template>
