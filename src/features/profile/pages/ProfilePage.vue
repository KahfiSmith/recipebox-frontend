<script setup lang="ts">
import { computed, reactive, ref } from 'vue'

import { Button, Input } from '@/shared/components/ui'
import { useAuth } from '@/shared/composables/useAuth'
import { isEmail, isMinLength } from '@/shared/lib/validators'

const { user } = useAuth()

const profileForm = reactive({
  name: user.value?.name ?? 'Demo User',
  email: user.value?.email ?? 'demo@example.com',
  location: '',
})

const preferencesForm = reactive({
  diet: 'none',
  units: 'metric',
  weekStart: 'monday',
  updates: true,
})

const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const profileError = ref('')
const profileSuccess = ref('')
const preferencesSuccess = ref('')
const passwordError = ref('')
const passwordSuccess = ref('')

const initials = computed(() => {
  const name = profileForm.name.trim()
  if (!name) return 'RB'
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
})

const handleProfileSave = () => {
  profileError.value = ''
  profileSuccess.value = ''

  if (!isMinLength(profileForm.name.trim(), 2)) {
    profileError.value = 'Name must be at least 2 characters'
    return
  }

  if (!isEmail(profileForm.email)) {
    profileError.value = 'Invalid email address'
    return
  }

  profileSuccess.value = 'Profile updated successfully.'
}

const handlePreferencesSave = () => {
  preferencesSuccess.value = 'Preferences saved.'
}

const handlePasswordSave = () => {
  passwordError.value = ''
  passwordSuccess.value = ''

  if (!isMinLength(passwordForm.currentPassword, 6)) {
    passwordError.value = 'Current password is required'
    return
  }

  if (!isMinLength(passwordForm.newPassword, 6)) {
    passwordError.value = 'New password must be at least 6 characters'
    return
  }

  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    passwordError.value = 'Passwords do not match'
    return
  }

  passwordSuccess.value = 'Password updated.'
  passwordForm.currentPassword = ''
  passwordForm.newPassword = ''
  passwordForm.confirmPassword = ''
}
</script>

<template>
  <section class="space-y-8">
    <header class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="space-y-2">
        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-recipe-orange">Profile</p>
        <h1 class="text-2xl font-semibold text-recipe-ink">Manage your account</h1>
        <p class="text-sm text-slate-600">Update your profile, preferences, and security.</p>
      </div>
      <div class="flex items-center gap-3 rounded-2xl border border-recipe-sand-b10 bg-white px-4 py-3">
        <div
          class="flex h-12 w-12 items-center justify-center rounded-full bg-recipe-orange text-sm font-semibold text-white"
        >
          {{ initials }}
        </div>
        <div>
          <p class="text-sm font-semibold text-recipe-ink">
            {{ profileForm.name || 'Recipe Box User' }}
          </p>
          <p class="text-xs text-slate-500">{{ profileForm.email }}</p>
        </div>
      </div>
    </header>

    <div class="grid gap-6 lg:grid-cols-[1.4fr,1fr]">
      <div class="rounded-2xl border border-recipe-sand-b10 bg-white p-6 shadow-sm">
        <div class="space-y-1">
          <h2 class="text-lg font-semibold text-recipe-ink">Profile details</h2>
          <p class="text-sm text-slate-600">Keep your account information up to date.</p>
        </div>

        <form class="mt-6 space-y-4" @submit.prevent="handleProfileSave">
          <div class="grid gap-4 sm:grid-cols-2">
            <Input v-model="profileForm.name" label="Full name" name="name" required />
            <Input v-model="profileForm.email" label="Email" name="email" required />
          </div>
          <Input v-model="profileForm.location" label="Location" name="location" placeholder="City" />

          <p
            v-if="profileError"
            class="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
          >
            {{ profileError }}
          </p>
          <p
            v-if="profileSuccess"
            class="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700"
          >
            {{ profileSuccess }}
          </p>

          <div class="flex justify-end">
            <Button class="w-full sm:w-auto">Save changes</Button>
          </div>
        </form>
      </div>

      <div class="rounded-2xl border border-recipe-sand-b10 bg-white p-6 shadow-sm">
        <div class="space-y-1">
          <h2 class="text-lg font-semibold text-recipe-ink">Preferences</h2>
          <p class="text-sm text-slate-600">Tailor your cooking experience.</p>
        </div>

        <form class="mt-6 space-y-4" @submit.prevent="handlePreferencesSave">
          <label class="block text-sm font-medium text-recipe-ink">
            Diet preference
            <select
              v-model="preferencesForm.diet"
              class="mt-2 w-full rounded-lg border border-recipe-sand bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-recipe-mint focus:ring-2 focus:ring-recipe-mint-w60 focus:ring-offset-1"
            >
              <option value="none">No preference</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="pescatarian">Pescatarian</option>
              <option value="low-carb">Low carb</option>
            </select>
          </label>

          <label class="block text-sm font-medium text-recipe-ink">
            Measurement units
            <select
              v-model="preferencesForm.units"
              class="mt-2 w-full rounded-lg border border-recipe-sand bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-recipe-mint focus:ring-2 focus:ring-recipe-mint-w60 focus:ring-offset-1"
            >
              <option value="metric">Metric (g, ml)</option>
              <option value="imperial">Imperial (oz, cups)</option>
            </select>
          </label>

          <label class="block text-sm font-medium text-recipe-ink">
            Week starts on
            <select
              v-model="preferencesForm.weekStart"
              class="mt-2 w-full rounded-lg border border-recipe-sand bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-recipe-mint focus:ring-2 focus:ring-recipe-mint-w60 focus:ring-offset-1"
            >
              <option value="monday">Monday</option>
              <option value="sunday">Sunday</option>
            </select>
          </label>

          <label class="flex items-center gap-2 text-sm text-slate-600">
            <input
              v-model="preferencesForm.updates"
              type="checkbox"
              class="h-4 w-4 rounded border-recipe-sand text-recipe-orange focus:ring-recipe-mint"
            />
            Send me product updates and tips
          </label>

          <p
            v-if="preferencesSuccess"
            class="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700"
          >
            {{ preferencesSuccess }}
          </p>

          <div class="flex justify-end">
            <Button variant="secondary" class="w-full sm:w-auto">Save preferences</Button>
          </div>
        </form>
      </div>
    </div>

    <div class="rounded-2xl border border-recipe-sand-b10 bg-white p-6 shadow-sm">
      <div class="space-y-1">
        <h2 class="text-lg font-semibold text-recipe-ink">Security</h2>
        <p class="text-sm text-slate-600">Update your password regularly.</p>
      </div>

      <form class="mt-6 space-y-4" @submit.prevent="handlePasswordSave">
        <div class="grid gap-4 sm:grid-cols-3">
          <Input
            v-model="passwordForm.currentPassword"
            label="Current password"
            name="currentPassword"
            type="password"
            autocomplete="current-password"
            required
          />
          <Input
            v-model="passwordForm.newPassword"
            label="New password"
            name="newPassword"
            type="password"
            autocomplete="new-password"
            required
          />
          <Input
            v-model="passwordForm.confirmPassword"
            label="Confirm password"
            name="confirmPassword"
            type="password"
            autocomplete="new-password"
            required
          />
        </div>

        <p
          v-if="passwordError"
          class="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {{ passwordError }}
        </p>
        <p
          v-if="passwordSuccess"
          class="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700"
        >
          {{ passwordSuccess }}
        </p>

        <div class="flex justify-end">
          <Button class="w-full sm:w-auto">Update password</Button>
        </div>
      </form>
    </div>
  </section>
</template>
