import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // Phase 2: proxy /api to the FastAPI service during local dev.
    // proxy: { '/api': 'http://localhost:8000' },
  },
})
