<script setup lang="ts">
import { RouterLink } from 'vue-router'

import BaseButton from '@/components/base/BaseButton.vue'
</script>

<template>
  <header class="app-header">
    <div class="app-header__inner">
      <RouterLink to="/" class="brand">
        <span class="brand__mark">Vue</span>
        <span class="brand__text">Boilerplate</span>
      </RouterLink>

      <nav class="nav">
        <RouterLink class="nav__link" to="/">Home</RouterLink>
        <RouterLink class="nav__link" to="/not-found">404</RouterLink>
      </nav>

      <BaseButton variant="ghost" aria-label="Open GitHub template" as="a" href="https://vuejs.org/">
        Docs
      </BaseButton>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  border-bottom: 1px solid rgba(148, 163, 184, 0.15);
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(10px);
}

.app-header__inner {
  width: min(1200px, 92vw);
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 0;
  gap: 16px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: inherit;
  text-decoration: none;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.brand__mark {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  border-radius: 12px;
  background: linear-gradient(135deg, #a855f7, #6366f1, #22d3ee);
  color: #0b1224;
  font-size: 0.85rem;
  text-transform: uppercase;
}

.brand__text {
  font-size: 1.1rem;
}

.nav {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.nav__link {
  color: #cbd5e1;
  text-decoration: none;
  font-weight: 600;
  padding: 0.35rem 0.5rem;
  transition: color 160ms ease, transform 160ms ease;
}

.nav__link:hover,
:deep(.router-link-active.nav__link) {
  color: #e5e7eb;
  transform: translateY(-1px);
}

@media (max-width: 640px) {
  .app-header__inner {
    width: 100%;
    padding: 14px 16px;
  }

  .nav {
    display: none;
  }
}
</style>
