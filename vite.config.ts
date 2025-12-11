import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // Memastikan Vue compiler mengoptimalkan untuk HMR
          isCustomElement: (tag) => tag.includes('-')
        }
      }
    }),
    vueJsx(),
    tailwindcss(),
    vueDevTools(),
  ],
  server: {
    hmr: {
      overlay: true
    },
    watch: {
      // Memastikan file watching bekerja dengan baik
      usePolling: false,
      interval: 100
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  optimizeDeps: {
    include: ['vue', 'vue-router', 'pinia']
  }
})
