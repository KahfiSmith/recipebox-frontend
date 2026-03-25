<script setup lang="ts">
import { useMutation } from '@tanstack/vue-query'
import { computed, reactive, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'

import { forgotPasswordPayloadSchema } from '@/shared/schemas/authSchemas'
import { authService } from '@/features/auth/services/authService'
import { Button, Input } from '@/shared/components/ui'
import { getZodErrorMessage } from '@/shared/lib/validators'

const form = reactive({
  email: '',
})

const router = useRouter()
const error = ref('')
const success = ref('')
const forgotPasswordMutation = useMutation({
  mutationFn: authService.forgotPassword,
})
const isSubmitting = computed(() => forgotPasswordMutation.isPending.value)

const handleSubmit = async () => {
  error.value = ''
  success.value = ''

  const validation = forgotPasswordPayloadSchema.safeParse(form)

  if (!validation.success) {
    error.value = getZodErrorMessage(validation.error, 'Failed to send reset link')
    return
  }

  try {
    const response = await forgotPasswordMutation.mutateAsync(validation.data)
    success.value = response.message

    window.setTimeout(() => {
      router.push({
        name: 'reset-password',
        query: {
          email: validation.data.email,
        },
      })
    }, 900)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to send reset link'
  }
}
</script>

<template>
  <form class="space-y-5" @submit.prevent="handleSubmit">
    <div class="space-y-2">
      <h1 class="text-2xl font-semibold text-slate-900">Reset password</h1>
      <p class="text-sm text-slate-600">
        Enter your email to receive a reset code, then continue to the reset screen.
      </p>
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
      Continue to the reset screen and paste the code from your email.
    </p>

    <Button class="w-full" :disabled="isSubmitting">
      {{ isSubmitting ? 'Sending code...' : 'Send reset code' }}
    </Button>
  </form>
</template>
