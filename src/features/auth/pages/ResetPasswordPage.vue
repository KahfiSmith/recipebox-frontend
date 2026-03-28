<script setup lang="ts">
import ResetPasswordForm from '@/features/auth/components/ResetPasswordForm.vue'
</script>

<template>
  <section class="space-y-6">
    <div class="space-y-2 text-center">
      <p class="text-xs font-semibold uppercase tracking-[0.2em] text-recipe-orange">
        Authentication
      </p>
      <h1 class="text-2xl font-semibold text-recipe-ink">Reset your password</h1>
      <p class="text-sm text-slate-600">Use the reset code from your email to choose a new password.</p>
    </div>

    <ResetPasswordForm />
  </section>
</template>
