import react from "@vitejs/plugin-react";
// ABOUTME: Vite configuration for client package with React and performance optimizations
// ABOUTME: Configured for <5MB bundle size and <3s time-to-interactive targets
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  build: {
    target: "es2020",
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
          pixi: ["pixi.js"],
        },
      },
    },
  },
  server: {
    port: 3000,
  },
});
