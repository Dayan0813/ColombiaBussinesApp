import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // Registra el service worker automáticamente
      registerType: "autoUpdate",
      // Incluir assets adicionales en el precache
      includeAssets: ["icons/*.svg", "vite.svg"],
      manifest: {
        name: "Colombia Business News",
        short_name: "CO News",
        description: "Explora noticias de negocios de Colombia con The News API",
        theme_color: "#1a1a2e",
        background_color: "#0f172a",
        display: "standalone",
        orientation: "portrait-primary",
        scope: "/",
        start_url: "/",
        lang: "es",
        categories: ["news", "business"],
        icons: [
          {
            src: "icons/icon-72x72.svg",
            sizes: "72x72",
            type: "image/svg+xml",
          },
          {
            src: "icons/icon-96x96.svg",
            sizes: "96x96",
            type: "image/svg+xml",
          },
          {
            src: "icons/icon-128x128.svg",
            sizes: "128x128",
            type: "image/svg+xml",
          },
          {
            src: "icons/icon-144x144.svg",
            sizes: "144x144",
            type: "image/svg+xml",
          },
          {
            src: "icons/icon-152x152.svg",
            sizes: "152x152",
            type: "image/svg+xml",
          },
          {
            src: "icons/icon-192x192.svg",
            sizes: "192x192",
            type: "image/svg+xml",
          },
          {
            src: "icons/icon-384x384.svg",
            sizes: "384x384",
            type: "image/svg+xml",
          },
          {
            src: "icons/icon-512x512.svg",
            sizes: "512x512",
            type: "image/svg+xml",
          },
          {
            src: "icons/maskable-512x512.svg",
            sizes: "512x512",
            type: "image/svg+xml",
            purpose: "maskable",
          },
        ],
      },
      // Configuración del service worker (Workbox)
      workbox: {
        // Cachear todos los assets del build
        globPatterns: ["**/*.{js,css,html,svg,png,ico,woff,woff2}"],
        // Estrategia: Network First para las peticiones a la API
        runtimeCaching: [
          {
            // Cache para la API de noticias
            urlPattern: /^https:\/\/api\.thenewsapi\.com\/.*/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "news-api-cache",
              expiration: {
                maxEntries: 50,
                // Caché válido por 5 minutos
                maxAgeSeconds: 60 * 5,
              },
              networkTimeoutSeconds: 10,
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            // Cache para imágenes externas de artículos
            urlPattern: /^https:\/\/.+\.(png|jpg|jpeg|svg|gif|webp)/i,
            handler: "CacheFirst",
            options: {
              cacheName: "article-images-cache",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24, // 24 horas
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
      // Mostrar en DevTools
      devOptions: {
        enabled: true,
        type: "module",
      },
    }),
  ],
});
