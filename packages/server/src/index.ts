import { getVersion, validateMonorepo } from "@end-of-line/shared";
// ABOUTME: Server entry point with Hono HTTP and WebSocket setup
// ABOUTME: Validates monorepo by importing from @end-of-line/shared
import { Hono } from "hono";

const app = new Hono();

// Validate monorepo setup
if (!validateMonorepo()) {
  throw new Error("Monorepo validation failed");
}

app.get("/", (c) => {
  return c.json({
    name: "End of Line API",
    version: getVersion(),
  });
});

app.get("/health", (c) => {
  return c.json({ status: "ok" });
});

const port = Number.parseInt(process.env.PORT ?? "3001", 10);

console.log(`Server running on port ${port}`);

export default {
  port,
  fetch: app.fetch,
};
