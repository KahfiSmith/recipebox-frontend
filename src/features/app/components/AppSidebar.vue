<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'

import type { DashboardMenuItem, DashboardMenuKey } from '@/features/app/types'
import { Button } from '@/shared/components/ui'
import { useAuth } from '@/shared/composables/useAuth'

const props = defineProps<{
  activeMenu?: DashboardMenuKey | null
  menuItems: DashboardMenuItem[]
  currentLabel?: string
}>()

const route = useRoute()
const router = useRouter()
const { logout } = useAuth()
const isLoggingOut = ref(false)
const logoutError = ref('')
const showLogoutDialog = ref(false)

const isActive = (key: DashboardMenuKey) => props.activeMenu === key

const currentSectionLabel = computed(() =>
  props.currentLabel
  ?? props.menuItems.find((item) => item.key === props.activeMenu)?.label
  ?? 'Dashboard')

const isProfileRoute = computed(() => route.name === 'profile')

const openLogoutDialog = () => {
  logoutError.value = ''
  showLogoutDialog.value = true
}

const closeLogoutDialog = () => {
  if (isLoggingOut.value) return
  showLogoutDialog.value = false
}

const handleLogout = async () => {
  logoutError.value = ''
  isLoggingOut.value = true

  try {
    await logout()
    showLogoutDialog.value = false
    await router.push({ name: 'login' })
  } catch (error) {
    logoutError.value = error instanceof Error ? error.message : 'Logout failed'
  } finally {
    isLoggingOut.value = false
  }
}

watch(showLogoutDialog, (isOpen) => {
  if (typeof document === 'undefined') return
  document.body.style.overflow = isOpen ? 'hidden' : ''
})

onBeforeUnmount(() => {
  if (typeof document === 'undefined') return
  document.body.style.overflow = ''
})
</script>

<template>
  <aside
    class="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto rounded-[28px] border border-recipe-sand-b10 bg-white p-4 shadow-sm"
  >
    <div class="mb-4 rounded-[22px] border border-recipe-sand-b12 bg-linear-to-br from-recipe-sand-w75 via-white to-recipe-orange-w85 p-4">
      <p class="text-[11px] font-semibold uppercase tracking-[0.22em] text-recipe-orange">
        Workspace
      </p>
      <p class="mt-1 text-base font-semibold text-recipe-ink">{{ currentSectionLabel }}</p>
      <p class="mt-2 text-xs leading-5 text-slate-600">
        Keep recipes, planning, and your account settings in one place.
      </p>
    </div>

    <nav class="space-y-2">
      <p class="px-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
        Main Menu
      </p>
      <div class="space-y-4">
        <RouterLink
          v-for="item in menuItems"
          :key="item.key"
          :to="{ name: 'app', query: { menu: item.key } }"
          class="block w-full rounded-[20px] border px-3 py-3 text-left transition"
          :class="
            isActive(item.key)
              ? 'border-recipe-orange-b10 bg-recipe-orange-w85 text-recipe-ink shadow-[0_16px_30px_-24px_rgba(238,155,106,0.95)]'
              : 'border-recipe-sand-b10 bg-white text-slate-700 hover:border-recipe-sand hover:bg-recipe-sand-w70'
          "
        >
          <p class="text-sm font-semibold">{{ item.label }}</p>
          <p class="text-xs text-slate-500">{{ item.description }}</p>
        </RouterLink>
      </div>
    </nav>

    <div class="mt-5 space-y-3">
      <p class="px-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
        Account
      </p>
      <RouterLink
        to="/app/profile"
        class="block rounded-[20px] border px-3 py-3 transition"
        :class="
          isProfileRoute
            ? 'border-recipe-orange-b10 text-recipe-ink'
            : 'border-recipe-sand-b10 bg-white text-slate-700 hover:border-recipe-sand hover:bg-recipe-sand-w70'
        "
      >
        <p class="text-sm font-semibold">Profile</p>
        <p class="text-xs text-slate-500">Account settings and preferences</p>
      </RouterLink>

      <button
        type="button"
        class="flex w-full items-center justify-between rounded-[20px] border px-3 py-3 text-left transition hover:border-red-100 hover:bg-red-50/80"
        :disabled="isLoggingOut"
        @click="openLogoutDialog"
      >
        <div>
          <p class="text-sm font-semibold text-recipe-ink">
            {{ isLoggingOut ? 'Signing out...' : 'Logout' }}
          </p>
        </div>
        <span class="text-sm font-semibold text-red-500">Exit</span>
      </button>

      <p
        v-if="logoutError"
        class="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
      >
        {{ logoutError }}
      </p>
    </div>
  </aside>

  <Teleport to="body">
    <div
      v-if="showLogoutDialog"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 backdrop-blur-[2px]"
      @click.self="closeLogoutDialog"
    >
      <div
        class="w-full max-w-md rounded-[28px] border border-recipe-sand-b10 bg-white p-6 shadow-[0_28px_80px_-32px_rgba(15,23,42,0.45)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="logout-dialog-title"
      >
        <div class="inline-flex rounded-full border border-red-100 bg-red-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-red-500">
          Confirm Logout
        </div>
        <h2 id="logout-dialog-title" class="mt-4 text-2xl font-semibold text-recipe-ink">
          End this session?
        </h2>
        <p class="mt-2 text-sm leading-6 text-slate-600">
          You will be redirected to the login form and need to sign in again to access your workspace.
        </p>

        <div class="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            variant="secondary"
            class="w-full sm:w-auto"
            :disabled="isLoggingOut"
            @click="closeLogoutDialog"
          >
            Stay here
          </Button>
          <Button
            class="w-full bg-red-500 text-white hover:opacity-95 sm:w-auto"
            :disabled="isLoggingOut"
            @click="handleLogout"
          >
            {{ isLoggingOut ? 'Signing out...' : 'Yes, logout' }}
          </Button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
