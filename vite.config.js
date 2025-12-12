import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { VitePWA } from "vite-plugin-pwa"

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "robots.txt", "logo-192.png", "logo-512.png"],
      manifest: {
        name: "Med-Find Salone",
        short_name: "Med-Find",
        description: "Find hospitals with beds, oxygen & ambulance near you in Sierra Leone",
        theme_color: "#1E88E5",
        background_color: "#FFFFFF",
        display: "standalone",
        scope: "/",
        start_url: "/",
        icons: [
          {
            src: "logo-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "logo-512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,json}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.mapbox\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "mapbox-cache",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
            },
          },
        ],
      },
    }),
  ],
})
