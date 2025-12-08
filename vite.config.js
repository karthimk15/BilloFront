import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": "/src",
    },
  },

  // 👇 server must be OUTSIDE resolve
  server: {
    port: 1420,       // Tauri default
    strictPort: true, // Force this port
  },
});
