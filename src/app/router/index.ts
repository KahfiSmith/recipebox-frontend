import { createRouter, createWebHistory } from 'vue-router'

import { routes } from '@/app/router/routes'
import { setupRouterGuards } from '@/app/router/guards'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    }
    return { left: 0, top: 0 }
  },
})

setupRouterGuards(router)

export default router
