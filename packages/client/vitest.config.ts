import react from "@vitejs/plugin-react";
// ABOUTME: Vitest configuration for client package unit tests
// ABOUTME: Configured for React testing with jsdom environment
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "**/*.test.ts",
        "**/*.spec.ts",
        "**/dist/**",
        "**/node_modules/**",
      ],
    },
  },
});
