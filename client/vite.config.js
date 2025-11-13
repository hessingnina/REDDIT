import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default {
  plugins: [react()],
  server: {
    proxy: {
      '/top-redditor': 'http://localhost:3000'
    }
  }
}
