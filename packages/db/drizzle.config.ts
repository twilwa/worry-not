// ABOUTME: Drizzle Kit configuration for database migrations
// ABOUTME: Points to schema and migration directories
import type { Config } from "drizzle-kit";

export default {
  schema: "./src/schema/index.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "postgresql://localhost:5432/endofline",
  },
} satisfies Config;
