<script setup lang="ts">
import VerifyEmailForm from '@/features/auth/components/VerifyEmailForm.vue'
</script>

<template>
  <section class="space-y-6">
    <div class="space-y-2 text-center">
      <p class="text-xs font-semibold uppercase tracking-[0.2em] text-recipe-orange">
        Authentication
      </p>
      <h1 class="text-2xl font-semibold text-recipe-ink">Email verification</h1>
      <p class="text-sm text-slate-600">
        Confirm your account from the link in your inbox, then continue to login.
      </p>
    </div>

    <VerifyEmailForm />
  </section>
</template>
