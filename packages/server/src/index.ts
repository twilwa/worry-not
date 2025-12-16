// ABOUTME: Server entry point with Hono HTTP and WebSocket setup
// ABOUTME: Validates monorepo by importing from @end-of-line/shared

import { serve } from "@hono/node-server";
import { createNodeWebSocket } from "@hono/node-ws";
import { Hono } from "hono";
import { getVersion, validateMonorepo } from "@end-of-line/shared";
import type { ClientMessage } from "@end-of-line/shared";
import { handleMessage, handleDisconnect } from "./handlers.js";

const app = new Hono();
const { injectWebSocket, upgradeWebSocket } = createNodeWebSocket({ app });

// Validate monorepo setup
if (!validateMonorepo()) {
  throw new Error("Monorepo validation failed");
}

// Track player IDs for WebSocket connections
const connectionPlayerIds = new WeakMap<object, string>();

app.get("/", (c) => {
  return c.json({
    name: "End of Line API",
    version: getVersion(),
  });
});

app.get("/health", (c) => {
  return c.json({ status: "ok" });
});

app.get(
  "/ws",
  upgradeWebSocket(() => {
    const playerId = `player-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    return {
      onOpen(_event, ws) {
        console.log(`Player connected: ${playerId}`);
        // Store player ID for this connection
        connectionPlayerIds.set(ws, playerId);
      },

      onMessage(event, ws) {
        try {
          const message = JSON.parse(event.data.toString()) as ClientMessage;
          const storedPlayerId = connectionPlayerIds.get(ws);
          if (storedPlayerId) {
            handleMessage({ playerId: storedPlayerId, ws }, message);
          }
        } catch (err) {
          console.error("Invalid message format:", err);
          ws.send(
            JSON.stringify({
              type: "ACTION_REJECTED",
              reason: "Invalid message format",
            }),
          );
        }
      },

      onClose(_event, ws) {
        const storedPlayerId = connectionPlayerIds.get(ws);
        if (storedPlayerId) {
          console.log(`Player disconnected: ${storedPlayerId}`);
          handleDisconnect(storedPlayerId);
          connectionPlayerIds.delete(ws);
        }
      },

      onError(event) {
        console.error("WebSocket error:", event);
      },
    };
  }),
);

const port = Number.parseInt(process.env.PORT ?? "3001", 10);

const server = serve(
  {
    fetch: app.fetch,
    port,
  },
  (info) => {
    console.log(`Server running on http://localhost:${info.port}`);
  },
);

injectWebSocket(server);

export { app, server };
