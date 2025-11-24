<script setup lang="ts">
import { RouterView } from 'vue-router'

import AppHeader from '@/components/common/AppHeader.vue'
</script>

<template>
  <div class="layout">
    <AppHeader />
    <main class="layout__content">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.layout {
  min-height: 100vh;
  display: grid;
  grid-template-rows: auto 1fr;
  background: linear-gradient(135deg, #0f172a 0%, #111827 70%, #0b1224 100%);
  color: #e5e7eb;
}

.layout__content {
  width: min(1200px, 92vw);
  margin: 0 auto;
  padding: 32px 0 64px;
}

@media (max-width: 640px) {
  .layout__content {
    width: 100%;
    padding: 20px 16px 48px;
  }
}
</style>
