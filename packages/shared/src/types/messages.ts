// ABOUTME: WebSocket message protocol type definitions for End of Line
// ABOUTME: Defines client-to-server and server-to-client message types

/**
 * Messages sent from client to server
 */
export type ClientMessage =
  | {
      type: "PLAY_CARD";
      cardId: string;
      targetId?: string;
    }
  | {
      type: "END_TURN";
    }
  | {
      type: "TRIGGER_SCENARIO";
      territoryId: string;
    }
  | {
      type: "JOIN_GAME";
      gameId?: string;
    }
  | {
      type: "LEAVE_GAME";
    };

/**
 * Scenario outcome types
 */
export type ScenarioOutcome = "CORP_WIN" | "RUNNER_WIN" | "DRAW";

/**
 * Partial state delta for efficient updates
 */
export type StateDelta = {
  territories?: Array<{ id: string; [key: string]: unknown }>;
  factions?: Array<{ id: string; [key: string]: unknown }>;
  players?: Array<{ id: string; [key: string]: unknown }>;
  cards?: Array<{ id: string; [key: string]: unknown }>;
};

/**
 * Scenario rewards
 */
export type ScenarioRewards = {
  credits?: number;
  victoryPoints?: number;
  cards?: string[];
  [key: string]: unknown;
};

/**
 * Messages sent from server to clients
 */
export type ServerMessage =
  | {
      type: "STATE_DELTA";
      delta: StateDelta;
    }
  | {
      type: "ACTION_REJECTED";
      reason: string;
    }
  | {
      type: "GAME_CREATED";
      gameId: string;
    }
  | {
      type: "SCENARIO_STARTED";
      scenarioId: string;
      territoryId: string;
    }
  | {
      type: "SCENARIO_ENDED";
      scenarioId: string;
      outcome: ScenarioOutcome;
      rewards: ScenarioRewards;
    }
  | {
      type: "GAME_OVER";
      winnerId: string;
      reason: string;
    };
