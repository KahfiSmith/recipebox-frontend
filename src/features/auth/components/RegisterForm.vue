<script setup lang="ts">
import { reactive, ref } from 'vue'
import { RouterLink } from 'vue-router'

import { Button, Input } from '@/shared/components/ui'
import { isEmail, isMinLength } from '@/shared/lib/validators'

const form = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const error = ref('')
const success = ref('')

const handleSubmit = () => {
  error.value = ''
  success.value = ''

  if (!isMinLength(form.name.trim(), 2)) {
    error.value = 'Name must be at least 2 characters'
    return
  }

  if (!isEmail(form.email)) {
    error.value = 'Invalid email address'
    return
  }

  if (!isMinLength(form.password, 6)) {
    error.value = 'Password must be at least 6 characters'
    return
  }

  if (form.password !== form.confirmPassword) {
    error.value = 'Passwords do not match'
    return
  }

  success.value = 'Account created. You can now log in.'
  form.password = ''
  form.confirmPassword = ''
}
</script>

<template>
  <form class="space-y-5" @submit.prevent="handleSubmit">
    <div class="space-y-2">
      <h1 class="text-2xl font-semibold text-slate-900">Create account</h1>
      <p class="text-sm text-slate-600">Fill in your details to get started.</p>
    </div>

    <Input v-model="form.name" label="Full name" name="name" placeholder="Jane Doe" required />
    <Input v-model="form.email" label="Email" name="email" placeholder="you@mail.com" required />
    <Input
      v-model="form.password"
      label="Password"
      name="password"
      type="password"
      placeholder="••••••••"
      required
    />
    <Input
      v-model="form.confirmPassword"
      label="Confirm password"
      name="confirmPassword"
      type="password"
      placeholder="••••••••"
      required
    />

    <div class="flex items-center justify-between text-sm">
      <span class="text-slate-600">Already have an account?</span>
      <RouterLink
        to="/auth/login"
        class="inline-flex items-center justify-center rounded-full border border-recipe-orange-b8 bg-recipe-orange-w85 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-recipe-orange-b35 shadow-[0_10px_22px_-18px_rgba(238,155,106,0.7)] transition hover:bg-recipe-orange hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-recipe-orange"
      >
        Log in
      </RouterLink>
    </div>

    <p
      v-if="error"
      class="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
    >
      {{ error }}
    </p>
    <p
      v-if="success"
      class="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700"
    >
      {{ success }}
    </p>

    <Button class="w-full">Create account</Button>
  </form>
</template>
