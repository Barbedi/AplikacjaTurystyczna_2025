import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  envDir: "../", // szuka .env w folderze nadrzędnym
  server: {
    host: true,
    port: 3000,
    strictPort: true,
    hmr: {
      port: 3000,
      clientPort: 3000,
    },
    watch: {
      usePolling: true,
    },
  },
});