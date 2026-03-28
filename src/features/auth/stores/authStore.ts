import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import { authService } from '@/features/auth/services/authService'
import { setAccessToken, setAuthHandlers } from '@/shared/services/httpClient'
import type { AuthResponse, LoginPayload, User } from '@/shared/types/api.types'

const hasApiBaseUrl = Boolean(import.meta.env.VITE_API_BASE_URL)
const AUTH_SESSION_STORAGE_KEY = 'recipebox.auth.session'

interface PersistedAuthSession {
  accessToken: string
  user: User
}

const readPersistedSession = (): PersistedAuthSession | null => {
  if (typeof window === 'undefined') return null

  const rawValue = window.sessionStorage.getItem(AUTH_SESSION_STORAGE_KEY)
  if (!rawValue) return null

  try {
    const parsed = JSON.parse(rawValue) as Partial<PersistedAuthSession>

    if (
      typeof parsed.accessToken !== 'string'
      || !parsed.accessToken
      || !parsed.user
      || typeof parsed.user.id !== 'string'
      || typeof parsed.user.name !== 'string'
      || typeof parsed.user.email !== 'string'
    ) {
      window.sessionStorage.removeItem(AUTH_SESSION_STORAGE_KEY)
      return null
    }

    return {
      accessToken: parsed.accessToken,
      user: parsed.user,
    }
  } catch {
    window.sessionStorage.removeItem(AUTH_SESSION_STORAGE_KEY)
    return null
  }
}

const writePersistedSession = (session: PersistedAuthSession) => {
  if (typeof window === 'undefined') return

  window.sessionStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(session))
}

const clearPersistedSession = () => {
  if (typeof window === 'undefined') return

  window.sessionStorage.removeItem(AUTH_SESSION_STORAGE_KEY)
}

export const useAuthStore = defineStore('auth', () => {
  const persistedSession = readPersistedSession()
  const user = ref<User | null>(persistedSession?.user ?? null)
  const accessToken = ref<string | null>(persistedSession?.accessToken ?? null)
  const sessionReady = ref(false)
  let initializationPromise: Promise<void> | null = null
  let refreshPromise: Promise<void> | null = null

  setAccessToken(accessToken.value)

  const isAuthenticated = computed(() => Boolean(accessToken.value && user.value))

  const applySession = async (response: AuthResponse) => {
    accessToken.value = response.accessToken
    setAccessToken(response.accessToken)
    user.value = response.user ?? await authService.getCurrentUser()

    if (user.value) {
      writePersistedSession({
        accessToken: response.accessToken,
        user: user.value,
      })
    }
  }

  const clearSession = () => {
    accessToken.value = null
    user.value = null
    setAccessToken(null)
    clearPersistedSession()
  }

  const redirectToLogin = () => {
    if (typeof window === 'undefined') return

    const currentPath = `${window.location.pathname}${window.location.search}${window.location.hash}`

    if (currentPath.startsWith('/auth/login')) {
      return
    }

    const loginUrl = new URL('/auth/login', window.location.origin)

    if (!currentPath.startsWith('/auth/')) {
      loginUrl.searchParams.set('redirect', currentPath)
    }

    window.location.replace(loginUrl.toString())
  }

  async function refreshSession() {
    if (!hasApiBaseUrl) return
    if (refreshPromise) return refreshPromise

    refreshPromise = (async () => {
      const response = await authService.refresh()
      await applySession(response)
    })().finally(() => {
      refreshPromise = null
    })

    return refreshPromise
  }

  setAuthHandlers({
    refreshAccessToken: refreshSession,
    handleUnauthorized: () => {
      clearSession()
      sessionReady.value = true
      redirectToLogin()
    },
  })

  async function login(payload: LoginPayload): Promise<AuthResponse> {
    const response = await authService.login(payload)
    await applySession(response)
    sessionReady.value = true
    return response
  }

  async function initializeSession() {
    if (sessionReady.value) return
    if (initializationPromise) return initializationPromise

    initializationPromise = (async () => {
      if (!hasApiBaseUrl) {
        sessionReady.value = true
        initializationPromise = null
        return
      }

      try {
        await refreshSession()
      } catch {
        if (!accessToken.value || !user.value) {
          clearSession()
        }
      } finally {
        sessionReady.value = true
        initializationPromise = null
      }
    })()

    return initializationPromise
  }

  async function logout() {
    try {
      await authService.logout()
    } finally {
      clearSession()
      sessionReady.value = true
    }
  }

  return {
    user,
    accessToken,
    isAuthenticated,
    sessionReady,
    initializeSession,
    refreshSession,
    login,
    logout,
  }
})
