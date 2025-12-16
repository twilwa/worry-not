// ABOUTME: Tests for game session management
// ABOUTME: Validates session creation, joining, and player management

import { describe, expect, it, beforeEach } from "vitest";
import type { WSContext } from "hono/ws";
import {
  createSession,
  joinSession,
  getSessionByPlayer,
  getSession,
  removePlayer,
  isPlayerTurn,
  getPlayerRole,
  clearAllSessions,
} from "./sessions.js";

// Mock WSContext for testing
function createMockWS(): WSContext {
  return {
    send: () => {},
    close: () => {},
    readyState: 1,
  } as unknown as WSContext;
}

describe("Session Management", () => {
  beforeEach(() => {
    clearAllSessions();
  });

  describe("createSession", () => {
    it("should create a new session with first player as Corp", () => {
      const ws = createMockWS();
      const session = createSession("player1", ws);

      expect(session.id).toBeDefined();
      expect(session.players).toHaveLength(1);
      expect(session.players[0]!.playerId).toBe("player1");
      expect(session.players[0]!.role).toBe("CORP");
    });

    it("should initialize game state with first player", () => {
      const ws = createMockWS();
      const session = createSession("player1", ws);

      expect(session.state.players).toHaveLength(1);
      expect(session.state.players[0]!.id).toBe("player1");
      expect(session.state.players[0]!.factionId).toBe("corp");
      expect(session.state.players[0]!.credits).toBe(5);
      expect(session.state.players[0]!.actions).toBe(3);
    });

    it("should set first player as current turn", () => {
      const ws = createMockWS();
      const session = createSession("player1", ws);

      expect(session.state.currentTurn.playerId).toBe("player1");
      expect(session.state.currentTurn.phase).toBe("ACTION");
    });
  });

  describe("joinSession", () => {
    it("should allow second player to join as Runner", () => {
      const ws1 = createMockWS();
      const ws2 = createMockWS();
      const session = createSession("player1", ws1);

      const result = joinSession(session.id, "player2", ws2);

      expect(result.error).toBeUndefined();
      expect(result.session.players).toHaveLength(2);
      expect(result.session.players[1]!.role).toBe("RUNNER");
    });

    it("should reject third player", () => {
      const ws1 = createMockWS();
      const ws2 = createMockWS();
      const ws3 = createMockWS();
      const session = createSession("player1", ws1);
      joinSession(session.id, "player2", ws2);

      const result = joinSession(session.id, "player3", ws3);

      expect(result.error).toBe("Game full");
    });

    it("should return error for non-existent game", () => {
      const ws = createMockWS();
      const result = joinSession("invalid-id", "player1", ws);

      expect(result.error).toBe("Game not found");
    });
  });

  describe("getSessionByPlayer", () => {
    it("should find session by player ID", () => {
      const ws = createMockWS();
      const session = createSession("player1", ws);

      const found = getSessionByPlayer("player1");

      expect(found).toBeDefined();
      expect(found?.id).toBe(session.id);
    });

    it("should return undefined for unknown player", () => {
      const found = getSessionByPlayer("unknown");
      expect(found).toBeUndefined();
    });
  });

  describe("removePlayer", () => {
    it("should remove player from session", () => {
      const ws1 = createMockWS();
      const ws2 = createMockWS();
      const session = createSession("player1", ws1);
      joinSession(session.id, "player2", ws2);

      removePlayer("player1");

      const updated = getSession(session.id);
      expect(updated?.players).toHaveLength(1);
      expect(updated?.players[0]!.playerId).toBe("player2");
    });

    it("should delete empty session", () => {
      const ws = createMockWS();
      const session = createSession("player1", ws);

      removePlayer("player1");

      const found = getSession(session.id);
      expect(found).toBeUndefined();
    });
  });

  describe("isPlayerTurn", () => {
    it("should return true for current player", () => {
      const ws = createMockWS();
      const session = createSession("player1", ws);

      expect(isPlayerTurn(session, "player1")).toBe(true);
    });

    it("should return false for non-current player", () => {
      const ws1 = createMockWS();
      const ws2 = createMockWS();
      const session = createSession("player1", ws1);
      joinSession(session.id, "player2", ws2);

      expect(isPlayerTurn(session, "player2")).toBe(false);
    });
  });

  describe("getPlayerRole", () => {
    it("should return CORP for first player", () => {
      const ws = createMockWS();
      const session = createSession("player1", ws);

      expect(getPlayerRole(session, "player1")).toBe("CORP");
    });

    it("should return RUNNER for second player", () => {
      const ws1 = createMockWS();
      const ws2 = createMockWS();
      const session = createSession("player1", ws1);
      joinSession(session.id, "player2", ws2);

      expect(getPlayerRole(session, "player2")).toBe("RUNNER");
    });
  });
});
