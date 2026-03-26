<script setup lang="ts">
import { useMutation } from '@tanstack/vue-query'
import { computed, reactive, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'

import { registerFormSchema } from '@/shared/schemas/authSchemas'
import { authService } from '@/features/auth/services/authService'
import { Button, Input } from '@/shared/components/ui'
import { getZodErrorMessage } from '@/shared/lib/validators'

const form = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const error = ref('')
const success = ref('')
const router = useRouter()
const registerMutation = useMutation({
  mutationFn: authService.register,
})
const isSubmitting = computed(() => registerMutation.isPending.value)

const handleSubmit = async () => {
  error.value = ''
  success.value = ''

  const validation = registerFormSchema.safeParse(form)

  if (!validation.success) {
    error.value = getZodErrorMessage(validation.error, 'Registration failed')
    return
  }

  try {
    const payload = {
      name: validation.data.name,
      email: validation.data.email,
      password: validation.data.password,
    }
    const response = await registerMutation.mutateAsync(payload)
    const registeredEmail = validation.data.email.trim()

    success.value = response.message
    form.password = ''
    form.confirmPassword = ''
    window.setTimeout(() => {
      router.push({
        name: 'login',
        query: { email: registeredEmail },
      })
    }, 900)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Registration failed'
  }
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
        class="inline-flex items-center justify-center rounded-full border border-recipe-orange-b8 bg-recipe-orange-w85 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-recipe-orange-b35 shadow-[0_10px_22px_-18px_rgba(238,155,106,0.7)] transition hover:bg-recipe-orange hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-recipe-orange"
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

    <Button class="w-full" :disabled="isSubmitting">
      {{ isSubmitting ? 'Creating account...' : 'Create account' }}
    </Button>
  </form>
</template>
