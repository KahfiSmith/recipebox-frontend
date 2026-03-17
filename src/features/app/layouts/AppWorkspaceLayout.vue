<script setup lang="ts">
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'

import AppSidebar from '@/features/app/components/AppSidebar.vue'
import { dashboardMenuItems } from '@/features/app/constants/dashboardMenu'
import type { DashboardMenuKey } from '@/features/app/types'

const route = useRoute()

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
</script>

<template>
  <section class="grid min-h-[70vh] grid-cols-[260px_minmax(0,1fr)] items-start gap-5">
    <AppSidebar
      :active-menu="activeMenu"
      :menu-items="dashboardMenuItems"
      :current-label="currentLabel"
    />
    <RouterView />
  </section>
</template>
