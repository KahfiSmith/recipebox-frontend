<script setup lang="ts">
import { RouterLink } from 'vue-router'

import type { DashboardMenuItem, DashboardMenuKey } from '@/features/app/types'

const props = defineProps<{
  activeMenu: DashboardMenuKey
  menuItems: DashboardMenuItem[]
}>()

const emit = defineEmits<{
  (e: 'change-menu', menu: DashboardMenuKey): void
}>()

const isActive = (key: DashboardMenuKey) => props.activeMenu === key
</script>

<template>
  <aside
    class="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto rounded-2xl border border-recipe-sand-b10 bg-white p-4 shadow-sm"
  >
    <div class="mb-4 rounded-xl border border-recipe-sand-b12 bg-recipe-sand-w75 p-3">
      <p class="text-xs font-semibold uppercase tracking-[0.2em] text-recipe-orange">Dashboard</p>
      <p class="mt-1 text-sm font-semibold text-recipe-ink">
        {{ menuItems.find((item) => item.key === activeMenu)?.label }}
      </p>
    </div>

    <nav class="space-y-2">
      <p class="px-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Main Menu</p>
      <div class="space-y-4">
        <button
          v-for="item in menuItems"
          :key="item.key"
          type="button"
          class="block w-full rounded-xl border px-3 py-2.5 text-left transition"
          :class="
            isActive(item.key)
              ? 'border-recipe-orange-b10 bg-recipe-orange-w85 text-recipe-ink'
              : 'border-recipe-sand-b10 bg-white text-slate-700 hover:border-recipe-sand hover:bg-recipe-sand-w70'
          "
          @click="emit('change-menu', item.key)"
        >
          <p class="text-sm font-semibold">{{ item.label }}</p>
          <p class="text-xs text-slate-500">{{ item.description }}</p>
        </button>
      </div>
    </nav>

    <div class="mt-5 space-y-2">
      <p class="px-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Account</p>
      <RouterLink
        to="/app/profile"
        class="block rounded-xl border border-recipe-sand-b10 bg-white px-3 py-2.5 text-slate-700 transition hover:border-recipe-sand hover:bg-recipe-sand-w70"
      >
        <p class="text-sm font-semibold">Profile</p>
        <p class="text-xs text-slate-500">Akun dan preferensi</p>
      </RouterLink>
    </div>
  </aside>
</template>
