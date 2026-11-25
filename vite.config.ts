import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// The payments API doesn't send CORS headers for localhost, so the browser blocks
// direct calls. In dev/preview, the browser calls /api and Vite forwards it server-side.
const apiProxy = {
  '/api': {
    target: 'https://wpaki0e0gc.execute-api.us-east-1.amazonaws.com/production/v1',
    changeOrigin: true,
    rewrite: (path: string) => path.replace(/^\/api/, ''),
  },
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  server: { proxy: apiProxy }, // npm run dev
  preview: { proxy: apiProxy }, // npm run preview
})
