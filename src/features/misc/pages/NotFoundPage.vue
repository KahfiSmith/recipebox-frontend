<script setup lang="ts">
import { RouterLink } from 'vue-router'

import BaseButton from '@/components/base/BaseButton.vue'
</script>

<template>
  <section class="not-found">
    <p class="code">404</p>
    <h1>Page not found</h1>
    <p class="muted">The page you are looking for doesn’t exist or has moved.</p>
    <RouterLink to="/">
      <BaseButton variant="secondary">Back to home</BaseButton>
    </RouterLink>
  </section>
</template>

<style scoped>
.not-found {
  text-align: center;
  padding: 60px 0;
}

.code {
  font-size: 3.4rem;
  font-weight: 800;
  margin: 0;
  color: #334155;
}

.not-found h1 {
  margin: 6px 0 10px;
}

.muted {
  color: #94a3b8;
  margin-bottom: 18px;
}
</style>
