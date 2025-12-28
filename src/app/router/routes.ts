import type { RouteRecordRaw } from 'vue-router'

const baseRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/app/layouts/DefaultLayout.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('@/features/home/pages/HomePage.vue'),
        meta: { title: 'Recipe Manager' },
      },
    ],
  },
  {
    path: '/app',
    component: () => import('@/app/layouts/DefaultLayout.vue'),
    children: [
      {
        path: '',
        name: 'app',
        component: () => import('@/features/app/pages/AppPage.vue'),
        meta: { title: 'App' },
      },
      {
        path: 'profile',
        name: 'profile',
        component: () => import('@/features/profile/pages/ProfilePage.vue'),
        meta: { title: 'Profile', requiresAuth: true },
      },
    ],
  },
  {
    path: '/auth',
    component: () => import('@/app/layouts/AuthLayout.vue'),
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('@/features/auth/pages/LoginPage.vue'),
        meta: { title: 'Login', guestOnly: true },
      },
      {
        path: 'register',
        name: 'register',
        component: () => import('@/features/auth/pages/RegisterPage.vue'),
        meta: { title: 'Register', guestOnly: true },
      },
      {
        path: 'forgot-password',
        name: 'forgot-password',
        component: () => import('@/features/auth/pages/ForgotPasswordPage.vue'),
        meta: { title: 'Forgot Password', guestOnly: true },
      },
      {
        path: 'verify-email',
        name: 'verify-email',
        component: () => import('@/features/auth/pages/VerifyEmailPage.vue'),
        meta: { title: 'Verify Email', guestOnly: true },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/features/misc/pages/NotFoundPage.vue'),
    meta: { title: 'Page Not Found' },
  },
]

export const routes: RouteRecordRaw[] = baseRoutes
