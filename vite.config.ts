import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        clientsClaim: true,
        skipWaiting: true,
      },
      manifest: {
        name: "hoyeol x daeman only festival The After-Class Secret Club",
        short_name: "The After-Class Secret Club",
        theme_color: "#ffffff",
        icons: [
          {
            src: "/maskable_icon_x192.png",
            type: "image/png",
            sizes: "192x192",
          },
          {
            src: "/maskable_icon_x512.png",
            type: "image/png",
            sizes: "512x512",
          },
          {
            src: "/maskable_icon_x512.png",
            type: "image/png",
            sizes: "512x512",
            purpose: "maskable",
          },
        ],
      },
    }),
  ],
  server: {
    proxy: {
      "/api": "http://localhost:3000",
    },
  },
});
