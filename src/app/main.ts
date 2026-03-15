import { VueQueryPlugin } from '@tanstack/vue-query'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from '@/app/App.vue'
import { queryClient } from '@/app/queryClient'
import router from '@/app/router'
import '@/app/styles/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VueQueryPlugin, { queryClient })

app.mount('#app')

if (import.meta.hot) {
  import.meta.hot.accept()
}
