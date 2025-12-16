// ABOUTME: Tests for game state store
// ABOUTME: Validates state management and server message handling

import { describe, expect, it, beforeEach } from "vitest";
import { useGameStore } from "./game-store.js";

describe("Game Store", () => {
  beforeEach(() => {
    useGameStore.getState().reset();
  });

  describe("connection state", () => {
    it("should start disconnected", () => {
      expect(useGameStore.getState().connectionState).toBe("disconnected");
    });

    it("should update connection state", () => {
      useGameStore.getState().setConnectionState("connected");
      expect(useGameStore.getState().connectionState).toBe("connected");
    });
  });

  describe("game ID", () => {
    it("should start with null game ID", () => {
      expect(useGameStore.getState().gameId).toBeNull();
    });

    it("should set game ID", () => {
      useGameStore.getState().setGameId("test-game-123");
      expect(useGameStore.getState().gameId).toBe("test-game-123");
    });
  });

  describe("applyStateDelta", () => {
    it("should merge players by id", () => {
      const state = useGameStore.getState();

      // Add initial player
      state.applyStateDelta({
        players: [
          {
            id: "p1",
            name: "Player 1",
            factionId: "corp",
            credits: 5,
            actions: 3,
            health: 40,
          },
        ],
      });

      expect(useGameStore.getState().players).toHaveLength(1);
      expect(useGameStore.getState().players[0]!.name).toBe("Player 1");

      // Update same player
      state.applyStateDelta({
        players: [
          {
            id: "p1",
            name: "Player 1",
            factionId: "corp",
            credits: 10,
            actions: 2,
            health: 40,
          },
        ],
      });

      expect(useGameStore.getState().players).toHaveLength(1);
      expect(useGameStore.getState().players[0]!.credits).toBe(10);
    });

    it("should add new players", () => {
      const state = useGameStore.getState();

      state.applyStateDelta({
        players: [
          {
            id: "p1",
            name: "Corp",
            factionId: "corp",
            credits: 5,
            actions: 3,
            health: 40,
          },
        ],
      });

      state.applyStateDelta({
        players: [
          {
            id: "p2",
            name: "Runner",
            factionId: "runner",
            credits: 5,
            actions: 3,
            health: 40,
          },
        ],
      });

      expect(useGameStore.getState().players).toHaveLength(2);
    });
  });

  describe("handleServerMessage", () => {
    it("should handle STATE_DELTA", () => {
      useGameStore.getState().handleServerMessage({
        type: "STATE_DELTA",
        delta: {
          players: [
            {
              id: "p1",
              name: "Test",
              factionId: "corp",
              credits: 5,
              actions: 3,
              health: 40,
            },
          ],
        },
      });

      expect(useGameStore.getState().players).toHaveLength(1);
    });

    it("should handle GAME_CREATED", () => {
      useGameStore.getState().handleServerMessage({
        type: "GAME_CREATED",
        gameId: "new-game-456",
      });

      expect(useGameStore.getState().gameId).toBe("new-game-456");
    });

    it("should handle ACTION_REJECTED without error", () => {
      expect(() => {
        useGameStore.getState().handleServerMessage({
          type: "ACTION_REJECTED",
          reason: "Not your turn",
        });
      }).not.toThrow();
    });
  });

  describe("reset", () => {
    it("should reset to initial state", () => {
      const state = useGameStore.getState();
      state.setConnectionState("connected");
      state.setGameId("test-game");
      state.applyStateDelta({
        players: [
          {
            id: "p1",
            name: "Test",
            factionId: "corp",
            credits: 5,
            actions: 3,
            health: 40,
          },
        ],
      });

      state.reset();

      expect(useGameStore.getState().connectionState).toBe("disconnected");
      expect(useGameStore.getState().gameId).toBeNull();
      expect(useGameStore.getState().players).toHaveLength(0);
    });
  });
});
