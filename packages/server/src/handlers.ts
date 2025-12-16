// ABOUTME: WebSocket message handlers for game actions
// ABOUTME: Routes incoming messages to appropriate game logic

import type { ClientMessage, ServerMessage } from "@end-of-line/shared";
import type { WSContext } from "hono/ws";
import {
  createSession,
  joinSession,
  getSessionByPlayer,
  removePlayer,
  broadcastToSession,
  isPlayerTurn,
  type GameSession,
} from "./sessions.js";

export type HandlerContext = {
  playerId: string;
  ws: WSContext;
};

function sendMessage(ws: WSContext, message: ServerMessage): void {
  ws.send(JSON.stringify(message));
}

function sendError(ws: WSContext, reason: string): void {
  sendMessage(ws, { type: "ACTION_REJECTED", reason });
}

function handleJoinGame(
  ctx: HandlerContext,
  gameId?: string,
): GameSession | null {
  const { playerId, ws } = ctx;

  if (gameId) {
    const result = joinSession(gameId, playerId, ws);
    if (result.error) {
      sendError(ws, result.error);
      return null;
    }

    // Notify all players of state including territories
    broadcastToSession(result.session, {
      type: "STATE_DELTA",
      delta: {
        players: result.session.state.players,
        factions: result.session.state.factions,
        territories: result.session.state.territories,
      },
    });

    return result.session;
  }

  // Create new game
  const session = createSession(playerId, ws);
  sendMessage(ws, {
    type: "STATE_DELTA",
    delta: {
      players: session.state.players,
      factions: session.state.factions,
      territories: session.state.territories,
    },
  });

  // Send game ID so second player can join
  ws.send(JSON.stringify({ type: "GAME_CREATED", gameId: session.id }));
  return session;
}

function handlePlayCard(
  ctx: HandlerContext,
  cardId: string,
  targetId?: string,
): void {
  const { playerId, ws } = ctx;
  const session = getSessionByPlayer(playerId);

  if (!session) {
    sendError(ws, "Not in a game");
    return;
  }

  if (!isPlayerTurn(session, playerId)) {
    sendError(ws, "Not your turn");
    return;
  }

  const player = session.state.players.find((p) => p.id === playerId);
  if (!player || player.actions <= 0) {
    sendError(ws, "No actions remaining");
    return;
  }

  // For MVP, just deduct action and broadcast
  // Full card execution will use the card executor from shared package
  player.actions -= 1;

  broadcastToSession(session, {
    type: "STATE_DELTA",
    delta: {
      players: session.state.players,
    },
  });
}

function handleEndTurn(ctx: HandlerContext): void {
  const { playerId, ws } = ctx;
  const session = getSessionByPlayer(playerId);

  if (!session) {
    sendError(ws, "Not in a game");
    return;
  }

  if (!isPlayerTurn(session, playerId)) {
    sendError(ws, "Not your turn");
    return;
  }

  // Find next player
  const currentIdx = session.state.players.findIndex((p) => p.id === playerId);
  const nextIdx = (currentIdx + 1) % session.state.players.length;
  const nextPlayer = session.state.players[nextIdx];

  if (nextPlayer) {
    session.state.currentTurn = {
      playerId: nextPlayer.id,
      phase: "ACTION",
      actionsRemaining: 3,
    };
    nextPlayer.actions = 3;
  }

  broadcastToSession(session, {
    type: "STATE_DELTA",
    delta: {
      players: session.state.players,
    },
  });
}

function handleTriggerScenario(ctx: HandlerContext, territoryId: string): void {
  const { playerId, ws } = ctx;
  const session = getSessionByPlayer(playerId);

  if (!session) {
    sendError(ws, "Not in a game");
    return;
  }

  // MVP: Just acknowledge scenario start
  // Full implementation will instantiate scenario layer
  const scenarioId = `scenario-${Date.now()}`;

  broadcastToSession(session, {
    type: "SCENARIO_STARTED",
    scenarioId,
    territoryId,
  });
}

function handleLeaveGame(ctx: HandlerContext): void {
  const { playerId } = ctx;
  const session = removePlayer(playerId);

  if (session && session.players.length > 0) {
    broadcastToSession(session, {
      type: "STATE_DELTA",
      delta: {
        players: session.state.players,
      },
    });
  }
}

export function handleMessage(
  ctx: HandlerContext,
  message: ClientMessage,
): void {
  switch (message.type) {
    case "JOIN_GAME":
      handleJoinGame(ctx, message.gameId);
      break;
    case "PLAY_CARD":
      handlePlayCard(ctx, message.cardId, message.targetId);
      break;
    case "END_TURN":
      handleEndTurn(ctx);
      break;
    case "TRIGGER_SCENARIO":
      handleTriggerScenario(ctx, message.territoryId);
      break;
    case "LEAVE_GAME":
      handleLeaveGame(ctx);
      break;
  }
}

export function handleDisconnect(playerId: string): void {
  const session = removePlayer(playerId);
  if (session && session.players.length > 0) {
    broadcastToSession(session, {
      type: "STATE_DELTA",
      delta: {
        players: session.state.players,
      },
    });
  }
}
