import { reactRouter } from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [tailwindcss(), reactRouter()],
  // Inline (empty) config stops Vite from picking up the Vue site's postcss.config.js (Tailwind 3) in the parent folder.
  css: { postcss: {} },
  // Same .env as the Vue site (VITE_WEB3FORMS_KEY, VITE_GA_MEASUREMENT_ID, survey URLs).
  envDir: '..',
})
