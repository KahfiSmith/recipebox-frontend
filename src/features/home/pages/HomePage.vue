<script setup lang="ts">
import { RouterLink } from 'vue-router'

import BaseButton from '@/components/base/BaseButton.vue'
import { useCounterStore } from '@/stores/counter'

const counter = useCounterStore()

const pillars = [
  {
    title: 'Feature-first',
    description: 'Co-locate pages, components, and services by feature for natural scaling.',
  },
  {
    title: 'Type safe',
    description: 'Strict TypeScript + alias support keeps imports clean and refactors safe.',
  },
  {
    title: 'Composable',
    description: 'Encapsulate logic with composables and stores, keep views thin and declarative.',
  },
]
</script>

<template>
  <section class="hero">
    <div class="hero__text">
      <p class="eyebrow">Vue 3 + Vite + TypeScript</p>
      <h1>Scalable boilerplate to kickstart new features, fast.</h1>
      <p class="lede">
        Opinionated file structure, global styles, routing, and state setup so you can focus on
        shipping features—not wiring.
      </p>
      <div class="hero__actions">
        <RouterLink to="/">
          <BaseButton>View routes</BaseButton>
        </RouterLink>
        <BaseButton variant="secondary" as="a" href="https://router.vuejs.org/" target="_blank">
          Router docs
        </BaseButton>
      </div>
    </div>
    <div class="hero__card">
      <header class="card__header">
        <p class="muted">Example store usage</p>
        <span class="pill">Pinia</span>
      </header>
      <p class="count">{{ counter.count }}</p>
      <p class="muted">Double: {{ counter.doubleCount }}</p>
      <div class="card__actions">
        <BaseButton variant="ghost" @click="counter.increment">Increment</BaseButton>
        <BaseButton variant="secondary" @click="counter.reset()">Reset</BaseButton>
      </div>
    </div>
  </section>

  <section class="pillars">
    <article v-for="pillar in pillars" :key="pillar.title" class="pillar">
      <h3>{{ pillar.title }}</h3>
      <p>{{ pillar.description }}</p>
    </article>
  </section>
</template>

<style scoped>
.hero {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  align-items: center;
  gap: 28px;
  margin-top: 28px;
}

.hero__text h1 {
  font-size: clamp(2rem, 4vw, 2.8rem);
  margin: 0.35rem 0 0.75rem;
}

.eyebrow {
  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #a855f7;
  margin: 0;
}

.hero__text .lede {
  margin: 0 0 1.25rem;
  color: #cbd5e1;
  max-width: 540px;
}

.hero__actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.hero__card {
  background: linear-gradient(160deg, rgba(99, 102, 241, 0.08), rgba(14, 165, 233, 0.08));
  border: 1px solid rgba(148, 163, 184, 0.2);
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.35);
  padding: 20px;
  border-radius: 16px;
}

.card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.muted {
  color: #94a3b8;
}

.pill {
  background: rgba(15, 23, 42, 0.8);
  color: #e5e7eb;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 0.85rem;
  border: 1px solid rgba(148, 163, 184, 0.25);
}

.count {
  font-size: 2.4rem;
  font-weight: 800;
  margin: 12px 0 4px;
}

.card__actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 12px;
}

.pillars {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 14px;
  margin-top: 36px;
}

.pillar {
  padding: 18px;
  border-radius: 14px;
  border: 1px solid rgba(148, 163, 184, 0.18);
  background: rgba(15, 23, 42, 0.55);
}

.pillar h3 {
  margin: 0 0 0.35rem;
}

.pillar p {
  margin: 0;
  color: #cbd5e1;
}

@media (max-width: 900px) {
  .hero {
    grid-template-columns: 1fr;
  }
}
</style>
