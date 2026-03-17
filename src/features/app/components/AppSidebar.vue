<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

import type { DashboardMenuItem, DashboardMenuKey } from '@/features/app/types'

const props = defineProps<{
  activeMenu?: DashboardMenuKey | null
  menuItems: DashboardMenuItem[]
  currentLabel?: string
}>()

const route = useRoute()

const isActive = (key: DashboardMenuKey) => props.activeMenu === key

const currentSectionLabel = computed(() =>
  props.currentLabel
  ?? props.menuItems.find((item) => item.key === props.activeMenu)?.label
  ?? 'Dashboard')

const isProfileRoute = computed(() => route.name === 'profile')
</script>

<template>
  <aside
    class="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto rounded-2xl border border-recipe-sand-b10 bg-white p-4 shadow-sm"
  >
    <div class="mb-4 rounded-xl border border-recipe-sand-b12 bg-recipe-sand-w75 p-3">
      <p class="text-xs font-semibold uppercase tracking-[0.2em] text-recipe-orange">Dashboard</p>
      <p class="mt-1 text-sm font-semibold text-recipe-ink">{{ currentSectionLabel }}</p>
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
          class="block w-full rounded-xl border px-3 py-2.5 text-left transition"
          :class="
            isActive(item.key)
              ? 'border-recipe-orange-b10 text-recipe-ink'
              : 'border-recipe-sand-b10 bg-white text-slate-700 hover:border-recipe-sand hover:bg-recipe-sand-w70'
          "
        >
          <p class="text-sm font-semibold">{{ item.label }}</p>
          <p class="text-xs text-slate-500">{{ item.description }}</p>
        </RouterLink>
      </div>
    </nav>

    <div class="mt-5 space-y-2">
      <p class="px-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
        Account
      </p>
      <RouterLink
        to="/app/profile"
        class="block rounded-xl border px-3 py-2.5 transition"
        :class="
          isProfileRoute
            ? 'border-recipe-orange-b10 text-recipe-ink'
            : 'border-recipe-sand-b10 bg-white text-slate-700 hover:border-recipe-sand hover:bg-recipe-sand-w70'
        "
      >
        <p class="text-sm font-semibold">Profile</p>
        <p class="text-xs text-slate-500">Akun dan preferensi</p>
      </RouterLink>
    </div>
  </aside>
</template>
