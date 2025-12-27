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
  <label class="block">
    <span v-if="label" class="mb-2 block text-sm font-medium text-recipe-ink">
      {{ label }}
    </span>
    <input
      v-model="modelValue"
      class="w-full rounded-lg border border-recipe-sand bg-white px-3 py-2 text-sm shadow-sm outline-none transition placeholder:text-slate-400 focus:border-recipe-mint focus:ring-2 focus:ring-recipe-mint-w60 focus:ring-offset-1"
      :type="type ?? 'text'"
      :name="name"
      :placeholder="placeholder"
      :required="required"
      v-bind="$attrs"
    />
  </label>
</template>
