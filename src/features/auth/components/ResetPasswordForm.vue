<script setup lang="ts">
import { useMutation } from '@tanstack/vue-query'
import { computed, reactive, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'

import { resetPasswordFormSchema } from '@/shared/schemas/authSchemas'
import { authService } from '@/features/auth/services/authService'
import { Button, Input } from '@/shared/components/ui'
import { getZodErrorMessage } from '@/shared/lib/validators'

const route = useRoute()
const router = useRouter()
const emailHint = typeof route.query.email === 'string' ? route.query.email : ''

const form = reactive({
  token: typeof route.query.token === 'string' ? route.query.token : '',
  password: '',
  confirmPassword: '',
})

const error = ref('')
const success = ref('')
const resetPasswordMutation = useMutation({
  mutationFn: authService.resetPassword,
})
const isSubmitting = computed(() => resetPasswordMutation.isPending.value)

const tokenHint = computed(() =>
  form.token
    ? 'Reset code loaded from the URL. You can replace it if needed.'
    : 'Paste the reset code from your email.',
)

const handleSubmit = async () => {
  error.value = ''
  success.value = ''

  const validation = resetPasswordFormSchema.safeParse(form)

  if (!validation.success) {
    error.value = getZodErrorMessage(validation.error, 'Password reset failed')
    return
  }

  try {
    const payload = {
      token: validation.data.token,
      password: validation.data.password,
    }
    const response = await resetPasswordMutation.mutateAsync(payload)

    success.value = response.message
    form.password = ''
    form.confirmPassword = ''

    window.setTimeout(() => {
      router.push({ name: 'login' })
    }, 900)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Password reset failed'
  }
}
</script>

<template>
  <form class="space-y-5" @submit.prevent="handleSubmit">
    <div class="space-y-2">
      <h1 class="text-2xl font-semibold text-slate-900">Set a new password</h1>
      <p class="text-sm text-slate-600">
        Paste the reset code from your email, then choose a new password.
      </p>
    </div>

    <p v-if="emailHint" class="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-700">
      Reset code sent to {{ emailHint }}.
    </p>

    <Input
      v-model="form.token"
      label="Reset code"
      name="token"
      placeholder="Paste your reset code"
      required
    />
    <p class="text-xs text-slate-500">{{ tokenHint }}</p>

    <Input
      v-model="form.password"
      label="New password"
      name="password"
      type="password"
      placeholder="••••••••"
      autocomplete="new-password"
      required
    />
    <Input
      v-model="form.confirmPassword"
      label="Confirm new password"
      name="confirmPassword"
      type="password"
      placeholder="••••••••"
      autocomplete="new-password"
      required
    />

    <div class="flex items-center justify-between text-sm">
      <RouterLink to="/auth/login" class="text-slate-600 transition hover:text-recipe-orange">
        Back to login
      </RouterLink>
      <RouterLink
        to="/auth/forgot-password"
        class="text-slate-600 transition hover:text-recipe-orange"
      >
        Need a new reset link?
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
      {{ isSubmitting ? 'Updating password...' : 'Update password' }}
    </Button>
  </form>
</template>
