import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  cacheDir: '.cache/vite',
  server: { host: '127.0.0.1', port: 8080, strictPort: true, proxy: { '/api': 'http://127.0.0.1:3001' } },
  plugins: [
    react(),
    tailwindcss(),
  ],
})
