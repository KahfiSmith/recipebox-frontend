<script setup lang="ts">
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'

import AppSidebar from '@/features/app/components/AppSidebar.vue'
import { dashboardMenuItems } from '@/features/app/constants/dashboardMenu'
import type { DashboardMenuKey } from '@/features/app/types'
import { useAuth } from '@/shared/composables/useAuth'

const route = useRoute()
const { user } = useAuth()

const isDashboardMenuKey = (value: unknown): value is DashboardMenuKey =>
  value === 'overview'
  || value === 'recipes'
  || value === 'meal-planner'
  || value === 'shopping-list'

const activeMenu = computed<DashboardMenuKey | null>(() => {
  if (route.name === 'profile') {
    return null
  }

  const rawValue = route.query.menu

  if (typeof rawValue === 'string' && isDashboardMenuKey(rawValue)) {
    return rawValue
  }

  return 'overview'
})

const currentLabel = computed(() => {
  if (route.name === 'profile') {
    return 'Profile'
  }

  return undefined
})

const currentSectionTitle = computed(() => currentLabel.value ?? 'Dashboard')

const currentSectionDescription = computed(() =>
  route.name === 'profile'
    ? 'Manage your account details, preferences, and security settings.'
    : 'Keep recipes, planning, and shopping activity organized from one workspace.',
)

const showWorkspaceHeader = computed(() => route.name === 'profile')

const userDisplayName = computed(() => user.value?.name?.trim() || 'Recipe Box User')
const userDisplayEmail = computed(() => user.value?.email?.trim() || 'Signed in user')
const userInitials = computed(() =>
  userDisplayName.value
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
  || 'RB')
</script>

<template>
  <section class="grid min-h-[70vh] w-full items-start gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
    <div class="self-start lg:sticky lg:top-8">
      <AppSidebar
        :active-menu="activeMenu"
        :menu-items="dashboardMenuItems"
        :current-label="currentLabel"
      />
    </div>
    <div class="min-w-0 w-full self-start space-y-6">
      <header
        v-if="showWorkspaceHeader"
        class="rounded-[28px] border border-recipe-sand-b10 bg-white/90 p-5 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.35)] backdrop-blur"
      >
        <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div class="space-y-2">
            <p class="text-[11px] font-semibold uppercase tracking-[0.22em] text-recipe-orange">
              Workspace
            </p>
            <div>
              <h1 class="text-2xl font-semibold text-recipe-ink">{{ currentSectionTitle }}</h1>
              <p class="mt-1 max-w-2xl text-sm leading-6 text-slate-600">
                {{ currentSectionDescription }}
              </p>
            </div>
          </div>

          <div class="flex items-center gap-3 rounded-[22px] border border-recipe-sand-b10 bg-recipe-sand-w80 px-4 py-3">
            <div
              class="flex h-12 w-12 items-center justify-center rounded-full bg-recipe-orange text-sm font-semibold text-white shadow-[0_14px_28px_-18px_rgba(238,155,106,0.85)]"
            >
              {{ userInitials }}
            </div>
            <div class="min-w-0">
              <p class="truncate text-sm font-semibold text-recipe-ink">{{ userDisplayName }}</p>
              <p class="truncate text-xs text-slate-500">{{ userDisplayEmail }}</p>
            </div>
          </div>
        </div>
      </header>

      <RouterView />
    </div>
  </section>
</template>
