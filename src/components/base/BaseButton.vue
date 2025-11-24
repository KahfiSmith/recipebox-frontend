<script setup lang="ts">
import { computed } from 'vue'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'
type ButtonTag = 'button' | 'a'

const props = withDefaults(
  defineProps<{
    variant?: ButtonVariant
    block?: boolean
    as?: ButtonTag
  }>(),
  {
    variant: 'primary',
    block: false,
    as: 'button',
  },
)

const tagName = computed<ButtonTag>(() => props.as)

const classes = computed(() => [
  'base-button',
  `base-button--${props.variant}`,
  { 'base-button--block': props.block },
])
</script>

<template>
  <component :is="tagName" :class="classes" v-bind="$attrs">
    <slot />
  </component>
</template>

<style scoped>
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.75rem 1.2rem;
  border-radius: 12px;
  border: 1px solid transparent;
  background: transparent;
  color: inherit;
  font-weight: 600;
  letter-spacing: 0.01em;
  transition: transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease,
    background-color 160ms ease;
  cursor: pointer;
}

.base-button--primary {
  background: linear-gradient(135deg, #7c3aed 0%, #2563eb 100%);
  color: #f8fafc;
  box-shadow: 0 10px 30px rgba(59, 130, 246, 0.35);
}

.base-button--primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 14px 35px rgba(59, 130, 246, 0.4);
}

.base-button--secondary {
  background: #0f172a;
  border-color: #1f2937;
}

.base-button--secondary:hover {
  border-color: #334155;
  transform: translateY(-1px);
}

.base-button--ghost {
  background: transparent;
  border-color: #243b53;
  color: #cbd5e1;
}

.base-button--ghost:hover {
  background: rgba(148, 163, 184, 0.1);
}

.base-button--block {
  width: 100%;
}

button:focus-visible {
  outline: 2px solid #38bdf8;
  outline-offset: 2px;
}
</style>
