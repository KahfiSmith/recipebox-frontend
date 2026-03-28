<script setup lang="ts">
import { useMutation } from '@tanstack/vue-query'
import { computed, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

import { authService } from '@/features/auth/services/authService'
import { Button } from '@/shared/components/ui'
import { getZodErrorMessage } from '@/shared/lib/validators'
import { verifyEmailRequestPayloadSchema } from '@/shared/schemas/authSchemas'

type VerificationStatus = 'pending' | 'verifying' | 'success' | 'error'

const route = useRoute()
const info = ref('')
const error = ref('')
const confirmMessage = ref('')
const attemptedToken = ref('')

const email = computed(() => {
  const emailQuery = route.query.email
  return typeof emailQuery === 'string' ? emailQuery.trim() : ''
})

const token = computed(() => {
  const tokenQuery = route.query.token
  return typeof tokenQuery === 'string' ? tokenQuery.trim() : ''
})

const confirmVerificationMutation = useMutation({
  mutationFn: authService.confirmEmailVerification,
})
const resendVerificationMutation = useMutation({
  mutationFn: authService.requestEmailVerification,
})

watch(
  token,
  async (nextToken) => {
    if (!nextToken || nextToken === attemptedToken.value) {
      return
    }

    attemptedToken.value = nextToken
    error.value = ''
    info.value = ''
    confirmMessage.value = ''

    try {
      const response = await confirmVerificationMutation.mutateAsync({ token: nextToken })
      confirmMessage.value = response.message
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Email verification failed'
    }
  },
  { immediate: true },
)

const status = computed<VerificationStatus>(() => {
  if (confirmVerificationMutation.isPending.value) {
    return 'verifying'
  }

  if (confirmVerificationMutation.isSuccess.value) {
    return 'success'
  }

  if (confirmVerificationMutation.isError.value || Boolean(error.value && token.value)) {
    return 'error'
  }

  return 'pending'
})

const title = computed(() => {
  if (status.value === 'success') return 'Email verified'
  if (status.value === 'verifying') return 'Verifying your email'
  if (status.value === 'error') return 'Verification link problem'
  return 'Check your inbox'
})

const description = computed(() => {
  if (status.value === 'success') {
    return confirmMessage.value || 'Your email has been verified. You can continue to login now.'
  }

  if (status.value === 'verifying') {
    return 'We are confirming your verification link now. This should only take a moment.'
  }

  if (status.value === 'error') {
    return 'This verification link is invalid or expired. Request a new link to continue.'
  }

  return 'We sent a verification link to your email. Open it from your inbox to activate your account.'
})

const toneClass = computed(() => {
  if (status.value === 'success') {
    return 'border-emerald-200 bg-emerald-50 text-emerald-700'
  }

  if (status.value === 'verifying') {
    return 'border-amber-200 bg-amber-50 text-amber-800'
  }

  if (status.value === 'error') {
    return 'border-red-200 bg-red-50 text-red-700'
  }

  return 'border-blue-200 bg-blue-50 text-blue-700'
})

const isResending = computed(() => resendVerificationMutation.isPending.value)
const canResend = computed(() => Boolean(email.value))

const handleResend = async () => {
  error.value = ''
  info.value = ''

  if (!canResend.value) {
    error.value = 'Email context is missing. Go back to register or login and request a new verification link.'
    return
  }

  const validation = verifyEmailRequestPayloadSchema.safeParse({ email: email.value })

  if (!validation.success) {
    error.value = getZodErrorMessage(validation.error, 'Failed to resend verification link')
    return
  }

  try {
    const response = await resendVerificationMutation.mutateAsync(validation.data)
    info.value = response.message
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to resend verification link'
  }
}
</script>

<template>
  <section class="space-y-5">
    <div class="rounded-2xl border px-5 py-5 shadow-sm" :class="toneClass">
      <div class="space-y-2">
        <h2 class="text-xl font-semibold">{{ title }}</h2>
        <p class="text-sm leading-6">
          {{ description }}
        </p>
        <p v-if="email" class="text-xs font-medium tracking-[0.08em] opacity-80">
          {{ email }}
        </p>
      </div>
    </div>

    <div class="space-y-3 rounded-2xl border border-recipe-sand bg-white p-5 shadow-sm">
      <p class="text-sm text-slate-600">
        {{
          status === 'success'
            ? 'Use the button below to continue to the login page.'
            : status === 'verifying'
              ? 'Please wait while we confirm your email.'
            : 'If you did not receive the email, request a new verification link.'
        }}
      </p>

      <p
        v-if="error"
        class="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
      >
        {{ error }}
      </p>
      <p
        v-if="info"
        class="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-700"
      >
        {{ info }}
      </p>

      <div class="flex flex-col gap-3 sm:flex-row">
        <RouterLink
          class="flex-1"
          :to="{ name: 'login', query: email ? { email } : undefined }"
        >
          <Button class="w-full" :disabled="status === 'verifying'">
            {{ status === 'success' ? 'Continue to login' : 'Back to login' }}
          </Button>
        </RouterLink>

        <Button
          v-if="status !== 'success' && status !== 'verifying'"
          type="button"
          variant="ghost"
          class="flex-1"
          :disabled="isResending || !canResend"
          @click="handleResend"
        >
          {{ isResending ? 'Sending...' : 'Resend verification link' }}
        </Button>
      </div>
    </div>
  </section>
</template>
