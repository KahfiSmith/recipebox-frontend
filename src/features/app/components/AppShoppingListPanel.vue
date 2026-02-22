<script setup lang="ts">
import { computed, reactive, ref } from 'vue'

import type { ShoppingItem, ShoppingPayload } from '@/features/app/types'
import { Button, Input } from '@/shared/components/ui'
import { isMinLength } from '@/shared/lib/validators'

const props = defineProps<{
  items: ShoppingItem[]
  menuOptions: string[]
}>()

const emit = defineEmits<{
  (e: 'save-item', payload: ShoppingPayload): void
  (e: 'delete-item', id: string): void
  (e: 'toggle-item', id: string): void
  (e: 'clear-checked'): void
}>()

const form = reactive({
  selectedMenu: '',
  newMenuName: '',
  name: '',
  qty: '',
})

const editingId = ref<string | null>(null)
const error = ref('')
const expandedGroups = ref<Record<string, boolean>>({})

const checkedCount = computed(() => props.items.filter((item) => item.checked).length)
const groupedItems = computed(() => {
  const groups = new Map<string, ShoppingItem[]>()

  props.items.forEach((item) => {
    const groupName = item.sourceLabel?.trim() || (item.source === 'meal-plan' ? 'Meal Plan' : 'General')
    const bucket = groups.get(groupName) ?? []
    bucket.push(item)
    groups.set(groupName, bucket)
  })

  return Array.from(groups.entries()).map(([groupName, items]) => ({
    groupName,
    items,
    checked: items.filter((item) => item.checked).length,
  }))
})

const resetForm = () => {
  form.selectedMenu = props.menuOptions[0] ?? 'General'
  form.newMenuName = ''
  form.name = ''
  form.qty = ''
  editingId.value = null
  error.value = ''
}

resetForm()

const handleSubmit = () => {
  error.value = ''

  if (!isMinLength(form.name.trim(), 2)) {
    error.value = 'Nama item minimal 2 karakter.'
    return
  }

  if (!isMinLength(form.qty.trim(), 1)) {
    error.value = 'Quantity wajib diisi.'
    return
  }

  const sourceLabel =
    form.selectedMenu === '__new__' ? form.newMenuName.trim() : form.selectedMenu.trim()

  if (!isMinLength(sourceLabel, 2)) {
    error.value = 'Pilih menu atau isi nama menu baru minimal 2 karakter.'
    return
  }

  emit('save-item', {
    id: editingId.value ?? undefined,
    name: form.name.trim(),
    qty: form.qty.trim(),
    sourceLabel,
  })
  resetForm()
}

const handleEdit = (item: ShoppingItem) => {
  editingId.value = item.id
  const sourceLabel = item.sourceLabel ?? 'General'
  if (props.menuOptions.includes(sourceLabel)) {
    form.selectedMenu = sourceLabel
    form.newMenuName = ''
  } else {
    form.selectedMenu = '__new__'
    form.newMenuName = sourceLabel
  }
  form.name = item.name
  form.qty = item.qty
  error.value = ''
}

const isExpanded = (groupName: string) => expandedGroups.value[groupName] ?? true

const toggleGroup = (groupName: string) => {
  expandedGroups.value[groupName] = !isExpanded(groupName)
}
</script>

<template>
  <div class="min-w-0 space-y-6">
    <header class="rounded-2xl border border-recipe-sand-b10 bg-white p-6 shadow-sm">
      <p class="text-xs font-semibold uppercase tracking-[0.2em] text-recipe-orange">Shopping List</p>
      <h1 class="mt-2 text-2xl font-semibold text-recipe-ink">Smart shopping list</h1>
      <p class="mt-2 max-w-2xl text-sm text-slate-600">
        Tambah item manual atau terima ingredient dari Meal Planner.
      </p>
      <div class="mt-4 flex flex-wrap gap-2 text-xs">
        <span class="rounded-full border border-recipe-sand-b10 bg-recipe-sand-w75 px-3 py-1">
          {{ items.length }} total items
        </span>
        <span class="rounded-full border border-recipe-sand-b10 bg-recipe-mint-w88 px-3 py-1">
          {{ checkedCount }} checked
        </span>
      </div>
    </header>

    <section class="rounded-2xl border border-recipe-sand-b10 bg-white p-6 shadow-sm">
      <h2 class="text-lg font-semibold text-recipe-ink">
        {{ editingId ? 'Edit item' : 'Add item' }}
      </h2>
      <form class="mt-4 grid gap-4 sm:grid-cols-2" @submit.prevent="handleSubmit">
        <label class="block text-sm font-medium text-recipe-ink">
          Menu / Group
          <select
            v-model="form.selectedMenu"
            class="mt-2 w-full rounded-lg border border-recipe-sand bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-recipe-mint focus:ring-2 focus:ring-recipe-mint-w60 focus:ring-offset-1"
          >
            <option v-for="option in menuOptions" :key="option" :value="option">{{ option }}</option>
            <option value="__new__">+ Buat menu baru</option>
          </select>
        </label>
        <Input
          v-if="form.selectedMenu === '__new__'"
          v-model="form.newMenuName"
          label="Nama menu baru"
          name="new-menu-name"
          placeholder="Pasta Primavera"
          required
        />
        <div v-else class="hidden sm:block"></div>
        <Input v-model="form.name" label="Item name" name="item-name" placeholder="Chicken breast" required />
        <Input v-model="form.qty" label="Quantity" name="item-qty" placeholder="500 g" required />

        <p
          v-if="error"
          class="sm:col-span-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {{ error }}
        </p>

        <div class="sm:col-span-2 flex flex-wrap gap-3">
          <Button>{{ editingId ? 'Update item' : 'Add item' }}</Button>
          <Button type="button" variant="ghost" @click="resetForm">Reset</Button>
          <Button
            v-if="checkedCount > 0"
            type="button"
            variant="secondary"
            @click="emit('clear-checked')"
          >
            Clear checked
          </Button>
        </div>
      </form>
    </section>

    <section class="rounded-2xl border border-recipe-sand-b10 bg-white p-6 shadow-sm">
      <h2 class="text-lg font-semibold text-recipe-ink">Items by menu</h2>

      <div v-if="items.length" class="mt-4 space-y-4">
        <article
          v-for="group in groupedItems"
          :key="group.groupName"
          class="overflow-hidden rounded-xl border border-recipe-sand-b10 bg-recipe-sand-w75"
        >
          <button
            type="button"
            class="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
            @click="toggleGroup(group.groupName)"
          >
            <div>
              <p class="text-sm font-semibold text-recipe-ink">{{ group.groupName }}</p>
              <p class="text-xs text-slate-600">{{ group.checked }} / {{ group.items.length }} checked</p>
            </div>
            <span class="rounded-full border border-recipe-orange-b8 bg-white px-2 py-1 text-[11px] font-semibold text-slate-700">
              {{ isExpanded(group.groupName) ? 'Hide' : 'Show' }}
            </span>
          </button>

          <div v-if="isExpanded(group.groupName)" class="space-y-2 border-t border-recipe-sand-b10 bg-white p-3">
            <article
              v-for="item in group.items"
              :key="item.id"
              class="rounded-lg border border-recipe-sand-b10 bg-white p-3"
            >
              <div class="flex flex-wrap items-start justify-between gap-3">
                <label class="flex items-start gap-3">
                  <input
                    :checked="item.checked"
                    type="checkbox"
                    class="mt-0.5 h-4 w-4 rounded border-recipe-sand text-recipe-orange focus:ring-recipe-mint"
                    @change="emit('toggle-item', item.id)"
                  />
                  <span>
                    <p
                      class="text-sm font-semibold text-recipe-ink"
                      :class="{ 'line-through text-slate-400': item.checked }"
                    >
                      {{ item.name }}
                    </p>
                    <p class="text-xs text-slate-600">{{ item.qty }}</p>
                  </span>
                </label>
                <span
                  class="rounded-full border border-recipe-orange-b8 bg-white px-2 py-1 text-[11px] font-semibold text-slate-700 shadow-[0_8px_16px_-14px_rgba(56,52,48,0.55)]"
                >
                  {{ item.source === 'meal-plan' ? 'From Meal Plan' : 'Manual' }}
                </span>
              </div>

              <div class="mt-3 flex flex-wrap gap-2">
                <Button size="sm" variant="secondary" @click="handleEdit(item)">Edit</Button>
                <Button size="sm" variant="ghost" @click="emit('delete-item', item.id)">Delete</Button>
              </div>
            </article>
          </div>
        </article>
      </div>

      <p v-else class="mt-4 text-sm text-slate-500">Belum ada item belanja.</p>
    </section>
  </div>
</template>
