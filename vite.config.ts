import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'Metronome',
        short_name: 'Metronome',
        description: 'A precise and easy-to-use metronome app.',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'eye-of-horus.svg',
            sizes: '192x192',
            type: 'image/svg+xml'
          },
          {
            src: 'eye-of-horus.svg',
            sizes: '512x512',
            type: 'image/svg+xml'
          }
        ]
      }
    })
  ],
})
