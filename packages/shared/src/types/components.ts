// ABOUTME: Card component type definitions for End of Line
// ABOUTME: Defines execution context, results, and all component types

import type { Card, GameState } from "./game-state";

/**
 * All possible component types in execution order
 */
export type ComponentType =
  // Cost components (execute first)
  | "CREDIT_COST"
  | "ACTION_COST"
  | "TRASH_COST"
  // Target components
  | "SELF_TARGET"
  | "SINGLE_TARGET"
  | "MULTI_TARGET"
  // Effect components
  | "DEAL_DAMAGE"
  | "GAIN_CREDITS"
  | "DRAW_CARDS"
  | "INSTALL_CARD";

/**
 * Damage types in the game
 */
export type DamageType = "NET" | "MEAT" | "BRAIN";

/**
 * State change types that can occur during component execution
 */
export type StateChangeType =
  | "MODIFY_CREDITS"
  | "MODIFY_ACTIONS"
  | "DEAL_DAMAGE"
  | "DRAW_CARD"
  | "INSTALL_CARD"
  | "TRASH_CARD";

/**
 * Represents a change to game state from component execution
 */
export type StateChange = {
  type: StateChangeType;
  targetId: string;
  amount?: number;
  damageType?: DamageType;
  cardId?: string;
};

/**
 * Pause reasons for component execution
 */
export type PauseReason =
  | "AWAITING_TARGET_SELECTION"
  | "AWAITING_USER_INPUT"
  | "AWAITING_RESPONSE";

/**
 * Result of component execution
 */
export type ComponentResult = {
  success?: boolean;
  reason?: string;
  stateChanges: StateChange[];
  pauseReason?: PauseReason;
};

/**
 * Context provided to components during execution
 */
export type ExecutionContext = {
  gameState: GameState;
  sourceCard: Card;
  sourcePlayerId: string;
  targets: string[];
  userInput?: Record<string, unknown>;
};

/**
 * Base card component structure with execute method
 */
export type CardComponent = {
  type: ComponentType;
  execute: (context: ExecutionContext) => ComponentResult;
  amount?: number;
  damageType?: DamageType;
  selectedOption?: string;
};

/**
 * Result of card execution including all accumulated state changes
 */
export type CardExecutionResult = {
  success: boolean;
  reason?: string;
  stateChanges: StateChange[];
};
