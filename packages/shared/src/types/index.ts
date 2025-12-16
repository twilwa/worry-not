// ABOUTME: Barrel export for all shared game types
// ABOUTME: Provides single import point for game state, messages, and components

// Game state types
export type {
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
} from "./game-state";

// Message protocol types
export type {
  ClientMessage,
  ServerMessage,
  ScenarioOutcome,
  StateDelta,
  ScenarioRewards,
} from "./messages";

// Component types
export type {
  ComponentType,
  DamageType,
  StateChangeType,
  StateChange,
  PauseReason,
  ComponentResult,
  ExecutionContext,
  CardComponent,
  CardExecutionResult,
} from "./components";
