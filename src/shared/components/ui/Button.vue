<script setup lang="ts">
import { computed, toRefs } from 'vue'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

const props = withDefaults(
  defineProps<{
    as?: 'button' | 'a'
    variant?: Variant
    size?: Size
  }>(),
  {
    as: 'button',
    variant: 'primary',
    size: 'md',
  },
)

const { as, variant, size } = toRefs(props)

const classes = computed(() => [
  'inline-flex items-center justify-center rounded-lg font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60',
  {
    'bg-[color:var(--recipe-orange)] text-white hover:opacity-90 focus-visible:ring-[color:var(--recipe-mint)]':
      variant.value === 'primary',
    'border border-[color:var(--recipe-sand)] bg-white text-[color:var(--recipe-ink)] hover:bg-[color:color-mix(in_oklab,var(--recipe-sand),white_60%)] focus-visible:ring-[color:var(--recipe-mint)]':
      variant.value === 'secondary',
    'text-[color:var(--recipe-ink)] hover:bg-[color:color-mix(in_oklab,var(--recipe-sand),white_65%)] focus-visible:ring-[color:var(--recipe-mint)]':
      variant.value === 'ghost',
  },
  {
    'px-3 py-1.5 text-sm': size.value === 'sm',
    'px-4 py-2 text-sm': size.value === 'md',
    'px-5 py-2.5 text-base': size.value === 'lg',
  },
])
</script>

<template>
  <component :is="as" :class="classes" v-bind="$attrs">
    <slot />
  </component>
</template>
