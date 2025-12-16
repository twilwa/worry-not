// ABOUTME: Zustand store for game state management
// ABOUTME: Handles state synchronization with server via STATE_DELTA messages

import { create } from "zustand";
import type {
  GameState,
  Territory,
  Faction,
  Player,
  Card,
  ServerMessage,
  StateDelta,
} from "@end-of-line/shared";
import type { ConnectionState } from "../websocket/index.js";

export type GameStore = {
  // Connection state
  connectionState: ConnectionState;
  gameId: string | null;
  playerId: string | null;

  // Game state
  territories: Territory[];
  factions: Faction[];
  players: Player[];
  cards: Card[];
  currentTurnPlayerId: string | null;

  // Actions
  setConnectionState: (state: ConnectionState) => void;
  setGameId: (gameId: string | null) => void;
  setPlayerId: (playerId: string | null) => void;
  applyStateDelta: (delta: StateDelta) => void;
  handleServerMessage: (message: ServerMessage) => void;
  reset: () => void;
};

const initialState = {
  connectionState: "disconnected" as ConnectionState,
  gameId: null,
  playerId: null,
  territories: [],
  factions: [],
  players: [],
  cards: [],
  currentTurnPlayerId: null,
};

export const useGameStore = create<GameStore>((set, get) => ({
  ...initialState,

  setConnectionState: (state) => set({ connectionState: state }),

  setGameId: (gameId) => set({ gameId }),

  setPlayerId: (playerId) => set({ playerId }),

  applyStateDelta: (delta) => {
    const state = get();

    // Merge territories by id
    const territories = delta.territories
      ? mergeArrayById(state.territories, delta.territories as Territory[])
      : state.territories;

    // Merge factions by id
    const factions = delta.factions
      ? mergeArrayById(state.factions, delta.factions as Faction[])
      : state.factions;

    // Merge players by id
    const players = delta.players
      ? mergeArrayById(state.players, delta.players as Player[])
      : state.players;

    // Merge cards by id
    const cards = delta.cards
      ? mergeArrayById(state.cards, delta.cards as Card[])
      : state.cards;

    set({ territories, factions, players, cards });
  },

  handleServerMessage: (message) => {
    switch (message.type) {
      case "STATE_DELTA":
        get().applyStateDelta(message.delta);
        break;
      case "ACTION_REJECTED":
        console.warn("Action rejected:", message.reason);
        break;
      case "GAME_CREATED":
        set({ gameId: message.gameId });
        break;
      case "SCENARIO_STARTED":
        console.log("Scenario started:", message.scenarioId);
        break;
      case "SCENARIO_ENDED":
        console.log("Scenario ended:", message.outcome);
        break;
      case "GAME_OVER":
        console.log("Game over:", message.reason);
        break;
    }
  },

  reset: () => set(initialState),
}));

// Helper to merge arrays by id, with new items replacing old ones
function mergeArrayById<T extends { id: string }>(
  existing: T[],
  updates: T[],
): T[] {
  const map = new Map<string, T>();

  for (const item of existing) {
    map.set(item.id, item);
  }

  for (const item of updates) {
    map.set(item.id, item);
  }

  return Array.from(map.values());
}
