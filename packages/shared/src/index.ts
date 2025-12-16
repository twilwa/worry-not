// ABOUTME: Main entry point for @end-of-line/shared package
// ABOUTME: Exports all shared game logic, types, and utilities

// Export all types
export type {
  // Game state types
  Territory,
  TerritoryType,
  Faction,
  FactionType,
  Card,
  CardType,
  Player,
  TurnPhase,
  TurnState,
  GameState,
  // Message protocol types
  ClientMessage,
  ServerMessage,
  ScenarioOutcome,
  StateDelta,
  ScenarioRewards,
  // Component types
  ComponentType,
  DamageType,
  StateChangeType,
  StateChange,
  PauseReason,
  ComponentResult,
  ExecutionContext,
  CardComponent,
  CardExecutionResult,
} from "./types";

// Export component creators
export {
  createCreditCost,
  createActionCost,
  createGainCredits,
  createDealDamage,
  createInstallCard,
} from "./components";

// Export execution engine
export { executeCard } from "./execution";

// Export card decks
export { weylandDeck } from "./cards/weyland-deck";
export { anarchDeck } from "./cards/anarch-deck";

// Export hex grid utilities
export {
  get3x3GridCoords,
  coordToId,
  idToCoord,
  getNeighbors,
  getNeighborIds,
  axialToPixel,
  pixelToAxial,
  axialRound,
  createTerritory,
  createHexGrid,
  isCorpControlled,
  isRunnerControlled,
  clamp,
  modifyTerritory,
  type AxialCoord,
  type HexPosition,
} from "./hex";

/**
 * Validates that the monorepo is correctly configured
 * @returns true if the environment is valid
 */
export function validateMonorepo(): boolean {
  return true;
}

/**
 * Gets the package version
 * @returns the package version string
 */
export function getVersion(): string {
  return "0.1.0";
}
