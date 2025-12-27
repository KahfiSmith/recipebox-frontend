<script setup lang="ts">
import { reactive, ref } from 'vue'
import { RouterLink } from 'vue-router'

import { Button, Input } from '@/shared/components/ui'
import { isEmail } from '@/shared/lib/validators'

const form = reactive({
  email: '',
})

const error = ref('')
const success = ref('')

const handleSubmit = () => {
  error.value = ''
  success.value = ''

  if (!isEmail(form.email)) {
    error.value = 'Invalid email address'
    return
  }

  success.value = 'If an account exists for this email, we sent a reset link.'
}
</script>

<template>
  <form class="space-y-5" @submit.prevent="handleSubmit">
    <div class="space-y-2">
      <h1 class="text-2xl font-semibold text-slate-900">Reset password</h1>
      <p class="text-sm text-slate-600">Enter your email to receive a reset link.</p>
    </div>

    <Input
      v-model="form.email"
      label="Email"
      name="email"
      placeholder="you@mail.com"
      autocomplete="email"
      required
    />

    <div class="flex items-center justify-between text-sm">
      <RouterLink to="/auth/login" class="text-slate-600 transition hover:text-recipe-orange">
        Back to login
      </RouterLink>
      <RouterLink
        to="/auth/verify-email"
        class="text-slate-600 transition hover:text-recipe-orange"
      >
        Verify email
      </RouterLink>
    </div>

    <p v-if="error" class="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
      {{ error }}
    </p>
    <p
      v-if="success"
      class="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700"
    >
      {{ success }}
    </p>

    <Button class="w-full">Send reset link</Button>
  </form>
</template>
