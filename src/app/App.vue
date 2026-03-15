<script setup lang="ts">
import { RouterView } from 'vue-router'

import AuthDebugPanel from '@/shared/components/common/AuthDebugPanel.vue'
</script>

<template>
  <RouterView />
  <AuthDebugPanel />
</template>
