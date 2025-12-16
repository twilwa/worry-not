// ABOUTME: Game state type definitions for End of Line
// ABOUTME: Includes Territory, Faction, Card, Player, and GameState types

/**
 * Territory types representing different areas of control
 */
export type TerritoryType = "CORPORATE" | "FRINGE" | "UNDERGROUND";

/**
 * Represents a territory on the overworld hex grid
 */
export type Territory = {
  id: string;
  name: string;
  type: TerritoryType;
  securityLevel: 1 | 2 | 3 | 4 | 5;
  resourceValue: 1 | 2 | 3 | 4 | 5;
  stabilityIndex: number; // 0-100
  corporateInfluence: number; // 0-100
  adjacentTerritoryIds: string[];
};

/**
 * Faction types in the game
 */
export type FactionType = "CORP" | "RUNNER";

/**
 * Represents a faction (Corp or Runner)
 */
export type Faction = {
  id: string;
  type: FactionType;
  resources: number;
  victoryPoints: number;
};

/**
 * Card types indicating where they can be played
 */
export type CardType = "OVERWORLD" | "SCENARIO";

/**
 * Represents a game card with component-based effects
 */
export type Card = {
  id: string;
  name: string;
  type: CardType;
  faction: FactionType;
  cost: number;
  components: unknown[]; // Will be typed as CardComponent[] when components.ts is imported
};

/**
 * Represents a player in the game
 */
export type Player = {
  id: string;
  name: string;
  factionId: string;
  credits: number;
  actions: number;
  health: number;
};

/**
 * Turn phase indicator
 */
export type TurnPhase = "ACTION" | "DISCARD" | "DRAW";

/**
 * Current turn state
 */
export type TurnState = {
  playerId: string;
  phase: TurnPhase;
  actionsRemaining: number;
};

/**
 * Complete game state
 */
export type GameState = {
  territories: Territory[];
  factions: Faction[];
  players: Player[];
  cards: Card[];
  currentTurn: TurnState;
};
