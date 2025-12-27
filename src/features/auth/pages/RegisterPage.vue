<script setup lang="ts">
import RegisterForm from '@/features/auth/components/RegisterForm.vue'
</script>

<template>
  <section class="space-y-6">
    <div class="space-y-2 text-center">
      <p class="text-xs font-semibold uppercase tracking-[0.2em] text-recipe-orange">
        Authentication
      </p>
      <h1 class="text-2xl font-semibold text-recipe-ink">Create your account</h1>
      <p class="text-sm text-slate-600">Sign up to start saving recipes.</p>
    </div>

    <RegisterForm />
  </section>
</template>
