<script setup lang="ts">
import { Eye, EyeOff } from 'lucide-vue-next'
import { computed, ref } from 'vue'

const modelValue = defineModel<string | number | null>({ default: '' })

const props = defineProps<{
  label?: string
  name?: string
  type?: string
  placeholder?: string
  required?: boolean
}>()

const isPasswordVisible = ref(false)
const isPasswordField = computed(() => props.type === 'password')
const inputType = computed(() => {
  if (!isPasswordField.value) {
    return props.type ?? 'text'
  }

  return isPasswordVisible.value ? 'text' : 'password'
})
</script>

<template>
  <label class="block">
    <span v-if="label" class="mb-2 block text-sm font-medium text-recipe-ink">
      {{ label }}
    </span>
    <div class="relative">
      <input
        v-model="modelValue"
        class="w-full rounded-lg border border-recipe-sand bg-white px-3 py-2 text-sm shadow-sm outline-none transition placeholder:text-slate-400 focus:border-recipe-mint focus:ring-2 focus:ring-recipe-mint-w60 focus:ring-offset-1"
        :class="{ 'pr-11': isPasswordField }"
        :type="inputType"
        :name="name"
        :placeholder="placeholder"
        :required="required"
        v-bind="$attrs"
      />
      <button
        v-if="isPasswordField"
        type="button"
        class="absolute inset-y-0 right-0 inline-flex w-11 items-center justify-center text-slate-500 transition hover:text-recipe-ink focus:outline-none"
        :aria-label="isPasswordVisible ? 'Hide password' : 'Show password'"
        @click="isPasswordVisible = !isPasswordVisible"
      >
        <EyeOff v-if="isPasswordVisible" class="h-4 w-4" />
        <Eye v-else class="h-4 w-4" />
      </button>
    </div>
  </label>
</template>
