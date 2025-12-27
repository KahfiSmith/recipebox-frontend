<script setup lang="ts">
import { reactive, ref } from 'vue'
import { RouterLink } from 'vue-router'

import { Button, Input } from '@/shared/components/ui'
import { isEmail, isMinLength } from '@/shared/lib/validators'

const form = reactive({
  email: '',
  code: '',
})

const error = ref('')
const success = ref('')
const info = ref('')

const handleSubmit = () => {
  error.value = ''
  success.value = ''
  info.value = ''

  if (!isEmail(form.email)) {
    error.value = 'Invalid email address'
    return
  }

  if (!isMinLength(form.code.trim(), 6)) {
    error.value = 'Verification code must be at least 6 characters'
    return
  }

  success.value = 'Email verified. You can now log in.'
}

const handleResend = () => {
  error.value = ''
  success.value = ''

  if (!isEmail(form.email)) {
    error.value = 'Enter a valid email to resend the code'
    return
  }

  info.value = 'If the email exists, we sent a new verification code.'
}
</script>

<template>
  <form class="space-y-5" @submit.prevent="handleSubmit">
    <div class="space-y-2">
      <h1 class="text-2xl font-semibold text-slate-900">Verify your email</h1>
      <p class="text-sm text-slate-600">Enter the code we sent to your inbox.</p>
    </div>

    <Input
      v-model="form.email"
      label="Email"
      name="email"
      placeholder="you@mail.com"
      autocomplete="email"
      required
    />
    <Input
      v-model="form.code"
      label="Verification code"
      name="code"
      placeholder="123456"
      inputmode="numeric"
      autocomplete="one-time-code"
      required
    />

    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <RouterLink to="/auth/login" class="text-sm text-slate-600 transition hover:text-recipe-orange">
        Back to login
      </RouterLink>
      <Button type="button" variant="ghost" size="sm" @click="handleResend">
        Resend code
      </Button>
    </div>

    <p v-if="error" class="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
      {{ error }}
    </p>
    <p
      v-if="info"
      class="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-700"
    >
      {{ info }}
    </p>
    <p
      v-if="success"
      class="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700"
    >
      {{ success }}
    </p>

    <Button class="w-full">Verify email</Button>
  </form>
</template>
