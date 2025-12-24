<script setup lang="ts">
const modelValue = defineModel<string | number | null>({ default: '' })

defineProps<{
  label?: string
  name?: string
  type?: string
  placeholder?: string
  required?: boolean
}>()
</script>

<template>
  <label class="block space-y-1.5">
    <span v-if="label" class="text-sm font-medium text-[color:var(--recipe-ink)]">{{ label }}</span>
    <input
      v-model="modelValue"
      class="w-full rounded-lg border border-[color:var(--recipe-sand)] bg-white px-3 py-2 text-sm shadow-sm outline-none transition placeholder:text-slate-400 focus:border-[color:var(--recipe-mint)] focus:ring-2 focus:ring-[color:color-mix(in_oklab,var(--recipe-mint),white_60%)] focus:ring-offset-1"
      :type="type ?? 'text'"
      :name="name"
      :placeholder="placeholder"
      :required="required"
      v-bind="$attrs"
    />
  </label>
</template>
