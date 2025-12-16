// ABOUTME: Game session manager for multiplayer games
// ABOUTME: Handles player connections, role assignment, and session lifecycle

import type { GameState, Player, FactionType } from "@end-of-line/shared";
import { createHexGrid } from "@end-of-line/shared";
import type { WSContext } from "hono/ws";

export type PlayerConnection = {
  playerId: string;
  ws: WSContext;
  role: FactionType;
};

export type GameSession = {
  id: string;
  players: PlayerConnection[];
  state: GameState;
  createdAt: number;
};

const sessions = new Map<string, GameSession>();
const playerToSession = new Map<string, string>();

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

function createInitialGameState(): GameState {
  return {
    territories: createHexGrid(),
    factions: [
      { id: "corp", type: "CORP", resources: 5, victoryPoints: 0 },
      { id: "runner", type: "RUNNER", resources: 5, victoryPoints: 0 },
    ],
    players: [],
    cards: [],
    currentTurn: {
      playerId: "",
      phase: "ACTION",
      actionsRemaining: 3,
    },
  };
}

export function createSession(playerId: string, ws: WSContext): GameSession {
  const sessionId = generateId();
  const player: Player = {
    id: playerId,
    name: `Player ${playerId.substring(0, 4)}`,
    factionId: "corp",
    credits: 5,
    actions: 3,
    health: 40,
  };

  const session: GameSession = {
    id: sessionId,
    players: [{ playerId, ws, role: "CORP" }],
    state: {
      ...createInitialGameState(),
      players: [player],
      currentTurn: {
        playerId,
        phase: "ACTION",
        actionsRemaining: 3,
      },
    },
    createdAt: Date.now(),
  };

  sessions.set(sessionId, session);
  playerToSession.set(playerId, sessionId);

  return session;
}

export function joinSession(
  sessionId: string,
  playerId: string,
  ws: WSContext,
): { session: GameSession; error?: string } {
  const session = sessions.get(sessionId);

  if (!session) {
    return { session: null as unknown as GameSession, error: "Game not found" };
  }

  if (session.players.length >= 2) {
    return { session, error: "Game full" };
  }

  const player: Player = {
    id: playerId,
    name: `Player ${playerId.substring(0, 4)}`,
    factionId: "runner",
    credits: 5,
    actions: 3,
    health: 40,
  };

  session.players.push({ playerId, ws, role: "RUNNER" });
  session.state.players.push(player);
  playerToSession.set(playerId, sessionId);

  return { session };
}

export function getSessionByPlayer(playerId: string): GameSession | undefined {
  const sessionId = playerToSession.get(playerId);
  return sessionId ? sessions.get(sessionId) : undefined;
}

export function getSession(sessionId: string): GameSession | undefined {
  return sessions.get(sessionId);
}

export function removePlayer(playerId: string): GameSession | undefined {
  const sessionId = playerToSession.get(playerId);
  if (!sessionId) return undefined;

  const session = sessions.get(sessionId);
  if (!session) return undefined;

  session.players = session.players.filter((p) => p.playerId !== playerId);
  session.state.players = session.state.players.filter(
    (p) => p.id !== playerId,
  );
  playerToSession.delete(playerId);

  // Clean up empty sessions
  if (session.players.length === 0) {
    sessions.delete(sessionId);
  }

  return session;
}

export function broadcastToSession(
  session: GameSession,
  message: unknown,
  excludePlayerId?: string,
): void {
  const messageStr = JSON.stringify(message);
  for (const player of session.players) {
    if (player.playerId !== excludePlayerId) {
      player.ws.send(messageStr);
    }
  }
}

export function isPlayerTurn(session: GameSession, playerId: string): boolean {
  return session.state.currentTurn.playerId === playerId;
}

export function getPlayerRole(
  session: GameSession,
  playerId: string,
): FactionType | undefined {
  const conn = session.players.find((p) => p.playerId === playerId);
  return conn?.role;
}

// For testing
export function clearAllSessions(): void {
  sessions.clear();
  playerToSession.clear();
}
