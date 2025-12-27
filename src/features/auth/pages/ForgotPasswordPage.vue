<script setup lang="ts">
import ForgotPasswordForm from '@/features/auth/components/ForgotPasswordForm.vue'
</script>

<template>
  <section class="space-y-6">
    <div class="space-y-2 text-center">
      <p class="text-xs font-semibold uppercase tracking-[0.2em] text-recipe-orange">
        Authentication
      </p>
      <h1 class="text-2xl font-semibold text-recipe-ink">Forgot your password?</h1>
      <p class="text-sm text-slate-600">We will send you a reset link.</p>
    </div>

    <ForgotPasswordForm />
  </section>
</template>
