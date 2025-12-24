<script setup lang="ts">
import LoginForm from '@/features/auth/components/LoginForm.vue'
</script>

<template>
  <section class="space-y-6">
    <div class="space-y-2 text-center">
      <p class="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--recipe-orange)]">
        Authentication
      </p>
      <h1 class="text-2xl font-semibold text-[color:var(--recipe-ink)]">Welcome back</h1>
      <p class="text-sm text-slate-600">Log in to continue.</p>
    </div>

    <LoginForm />
  </section>
</template>
