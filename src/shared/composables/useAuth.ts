import { storeToRefs } from 'pinia'

import { useAuthStore } from '@/features/auth/stores/authStore'
import type { LoginPayload } from '@/shared/types/api.types'

export function useAuth() {
  const authStore = useAuthStore()

  const { isAuthenticated, sessionReady, user } = storeToRefs(authStore)

  const login = (payload: LoginPayload) => authStore.login(payload)
  const initializeSession = () => authStore.initializeSession()
  const logout = () => authStore.logout()

  return {
    isAuthenticated,
    sessionReady,
    user,
    initializeSession,
    login,
    logout,
  }
}
