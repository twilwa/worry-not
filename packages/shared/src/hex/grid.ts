// ABOUTME: Hex grid utilities using axial coordinates
// ABOUTME: Provides grid generation, neighbor lookup, and coordinate conversion

import type { Territory, TerritoryType } from "../types/index.js";

export type AxialCoord = {
  q: number; // column
  r: number; // row
};

export type HexPosition = {
  x: number;
  y: number;
};

// Axial direction vectors for 6 hex neighbors
const AXIAL_DIRECTIONS: AxialCoord[] = [
  { q: 1, r: 0 }, // East
  { q: 1, r: -1 }, // Northeast
  { q: 0, r: -1 }, // Northwest
  { q: -1, r: 0 }, // West
  { q: -1, r: 1 }, // Southwest
  { q: 0, r: 1 }, // Southeast
];

/**
 * Get axial coordinates for a 3x3 hex grid (9 hexes total)
 */
export function get3x3GridCoords(): AxialCoord[] {
  return [
    // Row 0
    { q: 0, r: 0 },
    { q: 1, r: 0 },
    { q: 2, r: 0 },
    // Row 1 (offset)
    { q: 0, r: 1 },
    { q: 1, r: 1 },
    { q: 2, r: 1 },
    // Row 2
    { q: 0, r: 2 },
    { q: 1, r: 2 },
    { q: 2, r: 2 },
  ];
}

/**
 * Convert axial coordinates to a unique string ID
 */
export function coordToId(coord: AxialCoord): string {
  return `hex-${coord.q}-${coord.r}`;
}

/**
 * Parse a hex ID back to axial coordinates
 */
export function idToCoord(id: string): AxialCoord | null {
  const match = id.match(/^hex-(-?\d+)-(-?\d+)$/);
  if (!match) return null;
  return {
    q: parseInt(match[1]!, 10),
    r: parseInt(match[2]!, 10),
  };
}

/**
 * Get all valid neighbor coordinates for a hex within a 3x3 grid
 */
export function getNeighbors(coord: AxialCoord): AxialCoord[] {
  const neighbors: AxialCoord[] = [];
  const validCoords = get3x3GridCoords();

  for (const dir of AXIAL_DIRECTIONS) {
    const neighbor: AxialCoord = {
      q: coord.q + dir.q,
      r: coord.r + dir.r,
    };

    // Check if neighbor exists in our 3x3 grid
    if (validCoords.some((c) => c.q === neighbor.q && c.r === neighbor.r)) {
      neighbors.push(neighbor);
    }
  }

  return neighbors;
}

/**
 * Get neighbor IDs for a territory
 */
export function getNeighborIds(territoryId: string): string[] {
  const coord = idToCoord(territoryId);
  if (!coord) return [];
  return getNeighbors(coord).map(coordToId);
}

/**
 * Convert axial coordinates to pixel position for rendering
 */
export function axialToPixel(
  coord: AxialCoord,
  hexSize: number,
  offsetX = 0,
  offsetY = 0,
): HexPosition {
  const x = hexSize * (3 / 2) * coord.q + offsetX;
  const y = hexSize * Math.sqrt(3) * (coord.r + coord.q / 2) + offsetY;
  return { x, y };
}

/**
 * Convert pixel position to axial coordinates
 */
export function pixelToAxial(
  pos: HexPosition,
  hexSize: number,
  offsetX = 0,
  offsetY = 0,
): AxialCoord {
  const adjustedX = pos.x - offsetX;
  const adjustedY = pos.y - offsetY;

  const q = ((2 / 3) * adjustedX) / hexSize;
  const r =
    ((-1 / 3) * adjustedX) / hexSize +
    ((Math.sqrt(3) / 3) * adjustedY) / hexSize;

  return axialRound({ q, r });
}

/**
 * Round fractional axial coordinates to nearest hex
 */
export function axialRound(coord: { q: number; r: number }): AxialCoord {
  const s = -coord.q - coord.r;

  let rq = Math.round(coord.q);
  let rr = Math.round(coord.r);
  const rs = Math.round(s);

  const qDiff = Math.abs(rq - coord.q);
  const rDiff = Math.abs(rr - coord.r);
  const sDiff = Math.abs(rs - s);

  if (qDiff > rDiff && qDiff > sDiff) {
    rq = -rr - rs;
  } else if (rDiff > sDiff) {
    rr = -rq - rs;
  }

  return { q: rq, r: rr };
}

/**
 * Get territory type based on position (center vs edge)
 */
function getTerritoryType(coord: AxialCoord): TerritoryType {
  // Center hex is corporate
  if (coord.q === 1 && coord.r === 1) {
    return "CORPORATE";
  }
  // Corners are underground
  const isCorner =
    (coord.q === 0 && coord.r === 0) ||
    (coord.q === 2 && coord.r === 0) ||
    (coord.q === 0 && coord.r === 2) ||
    (coord.q === 2 && coord.r === 2);

  if (isCorner) {
    return "UNDERGROUND";
  }
  // Edges are fringe
  return "FRINGE";
}

/**
 * Generate territory name based on position
 */
function getTerritoryName(coord: AxialCoord): string {
  const names: Record<string, string> = {
    "0-0": "Sector Alpha",
    "1-0": "Northern District",
    "2-0": "Sector Beta",
    "0-1": "Western Reach",
    "1-1": "Central Hub",
    "2-1": "Eastern Reach",
    "0-2": "Sector Gamma",
    "1-2": "Southern District",
    "2-2": "Sector Delta",
  };
  return names[`${coord.q}-${coord.r}`] ?? `Hex ${coord.q}-${coord.r}`;
}

/**
 * Create a new territory with default values
 */
export function createTerritory(coord: AxialCoord): Territory {
  const id = coordToId(coord);
  const neighbors = getNeighbors(coord);

  return {
    id,
    name: getTerritoryName(coord),
    type: getTerritoryType(coord),
    securityLevel: 1,
    resourceValue: 3,
    stabilityIndex: 100,
    corporateInfluence: 50,
    adjacentTerritoryIds: neighbors.map(coordToId),
  };
}

/**
 * Initialize a complete 3x3 hex grid with territories
 */
export function createHexGrid(): Territory[] {
  return get3x3GridCoords().map(createTerritory);
}

/**
 * Check if territory is Corp-controlled (influence >= 60)
 */
export function isCorpControlled(territory: Territory): boolean {
  return territory.corporateInfluence >= 60;
}

/**
 * Check if territory is Runner-controlled (influence <= 40)
 */
export function isRunnerControlled(territory: Territory): boolean {
  return territory.corporateInfluence <= 40;
}

/**
 * Clamp a value to a valid range
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Modify territory attributes with clamping
 */
export function modifyTerritory(
  territory: Territory,
  changes: Partial<{
    securityLevel: number;
    resourceValue: number;
    stabilityIndex: number;
    corporateInfluence: number;
  }>,
): Territory {
  return {
    ...territory,
    securityLevel:
      changes.securityLevel !== undefined
        ? (clamp(changes.securityLevel, 1, 5) as 1 | 2 | 3 | 4 | 5)
        : territory.securityLevel,
    resourceValue:
      changes.resourceValue !== undefined
        ? (clamp(changes.resourceValue, 1, 5) as 1 | 2 | 3 | 4 | 5)
        : territory.resourceValue,
    stabilityIndex:
      changes.stabilityIndex !== undefined
        ? clamp(changes.stabilityIndex, 0, 100)
        : territory.stabilityIndex,
    corporateInfluence:
      changes.corporateInfluence !== undefined
        ? clamp(changes.corporateInfluence, 0, 100)
        : territory.corporateInfluence,
  };
}
