<script setup lang="ts">
import { useMutation } from '@tanstack/vue-query'
import { computed, reactive, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'

import { loginPayloadSchema } from '@/shared/schemas/authSchemas'
import { Button, Input } from '@/shared/components/ui'
import { useAuth } from '@/shared/composables/useAuth'
import { getZodErrorMessage } from '@/shared/lib/validators'

const form = reactive({
  email: '',
  password: '',
})

const error = ref('')

const { login } = useAuth()
const router = useRouter()
const route = useRoute()
const loginMutation = useMutation({
  mutationFn: login,
})
const isSubmitting = computed(() => loginMutation.isPending.value)

const emailQuery = route.query.email

if (typeof emailQuery === 'string') {
  form.email = emailQuery
}

const handleSubmit = async () => {
  error.value = ''

  const validation = loginPayloadSchema.safeParse(form)

  if (!validation.success) {
    error.value = getZodErrorMessage(validation.error, 'Login failed')
    return
  }

  try {
    await loginMutation.mutateAsync(validation.data)
    const redirect = (route.query.redirect as string | undefined) ?? '/app'
    router.push(redirect)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Login failed'
  }
}
</script>

<template>
  <form class="space-y-5" @submit.prevent="handleSubmit">
    <div class="space-y-2">
      <h1 class="text-2xl font-semibold text-slate-900">Log in</h1>
      <p class="text-sm text-slate-600">Sign in with your account to continue.</p>
    </div>

    <Input v-model="form.email" label="Email" name="email" placeholder="you@mail.com" required />
    <Input
      v-model="form.password"
      label="Password"
      name="password"
      type="password"
      placeholder="••••••••"
      required
    />

    <div class="flex items-center justify-between text-sm">
      <RouterLink
        to="/auth/forgot-password"
        class="text-slate-600 transition hover:text-recipe-orange"
      >
        Forgot password?
      </RouterLink>
      <RouterLink
        to="/auth/register"
        class="inline-flex items-center justify-center rounded-full border border-recipe-orange-b8 bg-recipe-orange-w85 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-recipe-orange-b35 shadow-[0_10px_22px_-18px_rgba(238,155,106,0.7)] transition hover:bg-recipe-orange hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-recipe-orange"
      >
        Sign up
      </RouterLink>
    </div>

    <p
      v-if="error"
      class="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
    >
      {{ error }}
    </p>

    <Button class="w-full" :disabled="isSubmitting">
      {{ isSubmitting ? 'Signing in...' : 'Login' }}
    </Button>
  </form>
</template>
