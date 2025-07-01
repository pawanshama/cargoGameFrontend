import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import rollupNodePolyFill from "rollup-plugin-polyfill-node";
import injectBuffer from "./vite-plugin-buffer"; // 👈 nouveau plugin

export default defineConfig({
  plugins: [react(), injectBuffer()],
  define: {
    global: "globalThis",
  },
  optimizeDeps: {
    include: ["buffer"],
  },
  build: {
    rollupOptions: {
      plugins: [rollupNodePolyFill()],
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://ae0e-2402-e280-230d-3ff-945-fd4e-1470-53f8.ngrok-free.app',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
    },
    allowedHosts: [".ngrok-free.app"]
  },
});
