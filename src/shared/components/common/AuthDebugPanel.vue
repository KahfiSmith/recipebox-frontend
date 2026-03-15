<script setup lang="ts">
import { useMutation } from '@tanstack/vue-query'
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

import { authService } from '@/features/auth/services/authService'
import { useAuthStore } from '@/features/auth/stores/authStore'
import { apiEndpoints } from '@/shared/services/api'
import { apiClient } from '@/shared/services/httpClient'
import { Button } from '@/shared/components/ui'

const isEnabled = import.meta.env.DEV
const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? '').trim()
const hasApiBaseUrl = Boolean(apiBaseUrl)

const authStore = useAuthStore()
const { accessToken, isAuthenticated, sessionReady, user } = storeToRefs(authStore)

const isOpen = ref(false)
const revealAccessToken = ref(false)
const busyAction = ref<string | null>(null)
const logs = ref<string[]>([])
const apiConnectionStatus = ref<'idle' | 'checking' | 'connected' | 'failed'>('idle')
const apiConnectionDetail = ref('Belum ada pengecekan koneksi API.')
const apiConnectionCheckedAt = ref<string | null>(null)

const healthcheckUrl = computed(() => {
  if (!hasApiBaseUrl) {
    return 'VITE_API_BASE_URL belum di-set.'
  }

  return new URL(apiEndpoints.system.healthz, apiBaseUrl).toString()
})

const accessTokenDisplay = computed(() => {
  if (!accessToken.value) {
    return 'No access token in memory.'
  }

  if (revealAccessToken.value || accessToken.value.length <= 24) {
    return accessToken.value
  }

  return `${accessToken.value.slice(0, 12)}...${accessToken.value.slice(-8)}`
})

const refreshTokenStatus = computed(() => {
  if (!hasApiBaseUrl) {
    return 'Mock mode aktif. Tidak ada refresh token cookie dari backend.'
  }

  return 'Refresh token diasumsikan ada di HTTP-only cookie backend. Nilainya tidak bisa dibaca dari JavaScript.'
})

const apiConnectionLabel = computed(() => {
  switch (apiConnectionStatus.value) {
    case 'checking':
      return 'Checking...'
    case 'connected':
      return 'Connected'
    case 'failed':
      return 'Failed'
    default:
      return hasApiBaseUrl ? 'Not checked' : 'Mock mode'
  }
})

const pushLog = (message: string) => {
  const timestamp = new Date().toLocaleTimeString('id-ID', { hour12: false })
  logs.value = [`${timestamp}  ${message}`, ...logs.value].slice(0, 8)
}

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : 'Unknown error'

const initializeSessionMutation = useMutation({
  mutationFn: async () => {
    await authStore.initializeSession()
  },
})

const refreshSessionMutation = useMutation({
  mutationFn: async () => {
    await authStore.refreshSession()
  },
})

const currentUserMutation = useMutation({
  mutationFn: authService.getCurrentUser,
})

const healthcheckMutation = useMutation({
  mutationFn: () =>
    apiClient.get<unknown>(apiEndpoints.system.healthz, {
      skipAuthRefresh: true,
      skipUnauthorizedHandler: true,
    }),
})

const logoutMutation = useMutation({
  mutationFn: async () => {
    await authStore.logout()
  },
})

const runAction = async (name: string, action: () => Promise<void>) => {
  busyAction.value = name

  try {
    await action()
    pushLog(`${name}: success`)
  } catch (error) {
    pushLog(`${name}: ${getErrorMessage(error)}`)
  } finally {
    busyAction.value = null
  }
}

const handleInitialize = () =>
  runAction('initializeSession', async () => {
    await initializeSessionMutation.mutateAsync()
  })

const handleRefresh = () =>
  runAction('refreshSession', async () => {
    await refreshSessionMutation.mutateAsync()
  })

const handleMe = () =>
  runAction('getCurrentUser', async () => {
    const currentUser = await currentUserMutation.mutateAsync()
    pushLog(`current user: ${currentUser.email}`)
  })

const handleHealthcheck = () =>
  runAction('healthz', async () => {
    apiConnectionStatus.value = 'checking'
    apiConnectionCheckedAt.value = new Date().toLocaleTimeString('id-ID', { hour12: false })

    try {
      const response = await healthcheckMutation.mutateAsync()

      apiConnectionStatus.value = 'connected'
      apiConnectionDetail.value =
        typeof response === 'string' && response.trim().length > 0
          ? response.trim()
          : 'Health check endpoint merespons sukses.'
    } catch (error) {
      apiConnectionStatus.value = 'failed'
      apiConnectionDetail.value = getErrorMessage(error)
      throw error
    }
  })

const handleLogout = () =>
  runAction('logout', async () => {
    await logoutMutation.mutateAsync()
  })

const handleCopyAccessToken = async () => {
  if (!accessToken.value) {
    pushLog('copyAccessToken: no access token in memory')
    return
  }

  try {
    await navigator.clipboard.writeText(accessToken.value)
    pushLog('copyAccessToken: copied to clipboard')
  } catch {
    pushLog('copyAccessToken: clipboard access failed')
  }
}

watch(isOpen, (open) => {
  if (!open || !hasApiBaseUrl || apiConnectionStatus.value !== 'idle') {
    return
  }

  void handleHealthcheck()
})
</script>

<template>
  <div v-if="isEnabled" class="pointer-events-none fixed bottom-4 right-4 z-[70]">
    <div class="pointer-events-auto flex flex-col items-end gap-3">
      <Button
        type="button"
        size="sm"
        variant="secondary"
        class="border-slate-300 bg-white/95 shadow-lg backdrop-blur"
        @click="isOpen = !isOpen"
      >
        {{ isOpen ? 'Hide Auth Debug' : 'Show Auth Debug' }}
      </Button>

      <section
        v-if="isOpen"
        class="w-[min(92vw,28rem)] rounded-2xl border border-slate-300 bg-slate-950 p-4 text-slate-100 shadow-2xl"
      >
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">Dev Only</p>
            <h2 class="mt-1 text-sm font-semibold text-white">Auth Debug Panel</h2>
          </div>
          <span class="rounded-full bg-slate-800 px-2 py-1 text-[11px] text-slate-300">
            {{ hasApiBaseUrl ? 'API mode' : 'Mock mode' }}
          </span>
        </div>

        <div class="mt-4 space-y-3 text-xs">
          <div class="grid gap-2 rounded-xl bg-slate-900/80 p-3">
            <div class="flex items-center justify-between gap-3">
              <span class="text-slate-400">Session ready</span>
              <span class="font-mono text-slate-100">{{ sessionReady ? 'true' : 'false' }}</span>
            </div>
            <div class="flex items-center justify-between gap-3">
              <span class="text-slate-400">Authenticated</span>
              <span class="font-mono text-slate-100">{{ isAuthenticated ? 'true' : 'false' }}</span>
            </div>
            <div class="flex items-start justify-between gap-3">
              <span class="text-slate-400">Email</span>
              <span class="text-right font-mono text-slate-100">
                {{ user?.email ?? 'No user loaded' }}
              </span>
            </div>
            <div class="flex items-start justify-between gap-3">
              <span class="text-slate-400">Access token</span>
              <span class="max-w-[15rem] break-all text-right font-mono text-slate-100">
                {{ accessTokenDisplay }}
              </span>
            </div>
            <div class="flex items-start justify-between gap-3">
              <span class="text-slate-400">API base URL</span>
              <span class="max-w-[15rem] break-all text-right font-mono text-slate-100">
                {{ hasApiBaseUrl ? apiBaseUrl : 'Not configured' }}
              </span>
            </div>
            <div class="flex items-start justify-between gap-3">
              <span class="text-slate-400">Health check URL</span>
              <span class="max-w-[15rem] break-all text-right font-mono text-slate-100">
                {{ healthcheckUrl }}
              </span>
            </div>
            <div class="flex items-center justify-between gap-3">
              <span class="text-slate-400">API connection</span>
              <span class="font-mono text-slate-100">{{ apiConnectionLabel }}</span>
            </div>
            <div class="flex items-start justify-between gap-3">
              <span class="text-slate-400">API detail</span>
              <span class="max-w-[15rem] text-right text-slate-300">
                {{ apiConnectionDetail }}
              </span>
            </div>
            <div class="flex items-start justify-between gap-3">
              <span class="text-slate-400">Last check</span>
              <span class="text-right font-mono text-slate-100">
                {{ apiConnectionCheckedAt ?? 'Never' }}
              </span>
            </div>
            <div class="flex items-start justify-between gap-3">
              <span class="text-slate-400">Refresh token</span>
              <span class="max-w-[15rem] text-right text-slate-300">
                {{ refreshTokenStatus }}
              </span>
            </div>
          </div>

          <div class="flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              :disabled="busyAction !== null || !hasApiBaseUrl"
              @click="handleHealthcheck"
            >
              Healthz
            </Button>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              :disabled="busyAction !== null"
              @click="handleInitialize"
            >
              Init
            </Button>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              :disabled="busyAction !== null || !hasApiBaseUrl"
              @click="handleRefresh"
            >
              Refresh
            </Button>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              :disabled="busyAction !== null || !hasApiBaseUrl"
              @click="handleMe"
            >
              /me
            </Button>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              :disabled="!accessToken"
              @click="revealAccessToken = !revealAccessToken"
            >
              {{ revealAccessToken ? 'Mask Token' : 'Reveal Token' }}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              :disabled="!accessToken"
              @click="handleCopyAccessToken"
            >
              Copy Token
            </Button>
            <Button
              type="button"
              size="sm"
              :disabled="busyAction !== null"
              @click="handleLogout"
            >
              Logout
            </Button>
          </div>

          <div class="rounded-xl border border-slate-800 bg-black/30 p-3">
            <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">How to verify</p>
            <ol class="mt-2 list-decimal space-y-1 pl-4 text-slate-300">
              <li>Tekan `Healthz`. Status `Connected` berarti FE bisa menjangkau backend.</li>
              <li>Login, lalu cek `Email` dan `Access token` terisi.</li>
              <li>Reload halaman, tekan `Init` bila perlu. Jika token balik, refresh cookie bekerja.</li>
              <li>Tekan `Refresh` untuk uji `/auth/refresh` manual.</li>
              <li>Tekan `/me` untuk memastikan access token baru benar-benar bisa dipakai.</li>
            </ol>
          </div>

          <div class="rounded-xl border border-slate-800 bg-black/30 p-3">
            <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Logs</p>
            <div class="mt-2 space-y-1 font-mono text-[11px] text-slate-300">
              <p v-if="logs.length === 0">Belum ada aksi debug.</p>
              <p v-for="entry in logs" :key="entry">{{ entry }}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
