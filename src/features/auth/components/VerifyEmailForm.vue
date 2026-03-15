<script setup lang="ts">
import { useMutation } from '@tanstack/vue-query'
import { computed, reactive, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'

import {
  verifyEmailConfirmPayloadSchema,
  verifyEmailRequestPayloadSchema,
} from '@/features/auth/lib/authSchemas'
import { authService } from '@/features/auth/services/authService'
import { Button, Input } from '@/shared/components/ui'
import { getZodErrorMessage } from '@/shared/lib/validators'

const form = reactive({
  email: '',
  code: '',
})

const error = ref('')
const success = ref('')
const info = ref('')
const route = useRoute()
const router = useRouter()
const verifyEmailMutation = useMutation({
  mutationFn: authService.confirmEmailVerification,
})
const resendVerificationMutation = useMutation({
  mutationFn: authService.requestEmailVerification,
})
const isVerifying = computed(() => verifyEmailMutation.isPending.value)
const isResending = computed(() => resendVerificationMutation.isPending.value)

const emailQuery = route.query.email

if (typeof emailQuery === 'string') {
  form.email = emailQuery
}

const handleSubmit = async () => {
  error.value = ''
  success.value = ''
  info.value = ''

  const validation = verifyEmailConfirmPayloadSchema.safeParse(form)

  if (!validation.success) {
    error.value = getZodErrorMessage(validation.error, 'Email verification failed')
    return
  }

  try {
    const response = await verifyEmailMutation.mutateAsync(validation.data)

    success.value = response.message
    window.setTimeout(() => {
      router.push({
        name: 'login',
        query: { email: form.email.trim() },
      })
    }, 900)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Email verification failed'
  }
}

const handleResend = async () => {
  error.value = ''
  success.value = ''
  info.value = ''

  const validation = verifyEmailRequestPayloadSchema.safeParse({ email: form.email })

  if (!validation.success) {
    error.value = getZodErrorMessage(validation.error, 'Failed to resend verification code')
    return
  }

  try {
    const response = await resendVerificationMutation.mutateAsync(validation.data)
    info.value = response.message
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to resend verification code'
  }
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
      <Button type="button" variant="ghost" size="sm" :disabled="isResending" @click="handleResend">
        {{ isResending ? 'Resending...' : 'Resend code' }}
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

    <Button class="w-full" :disabled="isVerifying">
      {{ isVerifying ? 'Verifying...' : 'Verify email' }}
    </Button>
  </form>
</template>
