// ABOUTME: Vitest configuration for shared package unit tests
// ABOUTME: Configured for TypeScript with coverage reporting
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
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
