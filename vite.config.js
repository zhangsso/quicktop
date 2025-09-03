import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://api.quickso.top',
        changeOrigin: true,
        rewrite: (path) => path
      }
    }
  }
})