// ABOUTME: Tests for hex grid utilities
// ABOUTME: Validates coordinate systems, neighbor lookup, and territory creation

import { describe, expect, it } from "vitest";
import {
  get3x3GridCoords,
  coordToId,
  idToCoord,
  getNeighbors,
  getNeighborIds,
  axialToPixel,
  pixelToAxial,
  createTerritory,
  createHexGrid,
  isCorpControlled,
  isRunnerControlled,
  modifyTerritory,
} from "./grid.js";

describe("Hex Grid Utilities", () => {
  describe("get3x3GridCoords", () => {
    it("should return 9 coordinates", () => {
      const coords = get3x3GridCoords();
      expect(coords).toHaveLength(9);
    });

    it("should include center hex at (1,1)", () => {
      const coords = get3x3GridCoords();
      expect(coords.some((c) => c.q === 1 && c.r === 1)).toBe(true);
    });
  });

  describe("coordToId / idToCoord", () => {
    it("should convert coord to id and back", () => {
      const coord = { q: 1, r: 2 };
      const id = coordToId(coord);
      expect(id).toBe("hex-1-2");

      const parsed = idToCoord(id);
      expect(parsed).toEqual(coord);
    });

    it("should handle negative coordinates", () => {
      const coord = { q: -1, r: 3 };
      const id = coordToId(coord);
      const parsed = idToCoord(id);
      expect(parsed).toEqual(coord);
    });

    it("should return null for invalid id", () => {
      expect(idToCoord("invalid")).toBeNull();
      expect(idToCoord("hex-abc-def")).toBeNull();
    });
  });

  describe("getNeighbors", () => {
    it("should return all valid neighbors for center hex", () => {
      const neighbors = getNeighbors({ q: 1, r: 1 });
      // Center hex has neighbors at all 4 cardinal directions within 3x3
      expect(neighbors.length).toBeGreaterThanOrEqual(4);
    });

    it("should return fewer neighbors for corner hex", () => {
      const neighbors = getNeighbors({ q: 0, r: 0 });
      // Corner should have 2 neighbors in a 3x3 grid
      expect(neighbors.length).toBe(2);
    });

    it("should return valid neighbor IDs", () => {
      const neighborIds = getNeighborIds("hex-1-1");
      expect(neighborIds.length).toBeGreaterThanOrEqual(4);
      expect(neighborIds.every((id) => id.startsWith("hex-"))).toBe(true);
    });
  });

  describe("axialToPixel / pixelToAxial", () => {
    it("should convert coordinates round-trip", () => {
      const hexSize = 50;
      const coord = { q: 1, r: 1 };

      const pixel = axialToPixel(coord, hexSize);
      const backToAxial = pixelToAxial(pixel, hexSize);

      expect(backToAxial.q).toBe(coord.q);
      expect(backToAxial.r).toBe(coord.r);
    });

    it("should apply offset correctly", () => {
      const hexSize = 50;
      const coord = { q: 0, r: 0 };
      const offset = 100;

      const pixel = axialToPixel(coord, hexSize, offset, offset);
      expect(pixel.x).toBe(offset);
      expect(pixel.y).toBe(offset);
    });
  });

  describe("createTerritory", () => {
    it("should create territory with default values", () => {
      const territory = createTerritory({ q: 0, r: 0 });

      expect(territory.id).toBe("hex-0-0");
      expect(territory.securityLevel).toBe(1);
      expect(territory.resourceValue).toBe(3);
      expect(territory.stabilityIndex).toBe(100);
      expect(territory.corporateInfluence).toBe(50);
    });

    it("should set correct territory type for center", () => {
      const territory = createTerritory({ q: 1, r: 1 });
      expect(territory.type).toBe("CORPORATE");
    });

    it("should set correct territory type for corner", () => {
      const territory = createTerritory({ q: 0, r: 0 });
      expect(territory.type).toBe("UNDERGROUND");
    });

    it("should set correct territory type for edge", () => {
      const territory = createTerritory({ q: 1, r: 0 });
      expect(territory.type).toBe("FRINGE");
    });

    it("should include adjacent territory IDs", () => {
      const territory = createTerritory({ q: 1, r: 1 });
      expect(territory.adjacentTerritoryIds.length).toBeGreaterThan(0);
    });
  });

  describe("createHexGrid", () => {
    it("should create 9 territories", () => {
      const grid = createHexGrid();
      expect(grid).toHaveLength(9);
    });

    it("should have unique IDs for all territories", () => {
      const grid = createHexGrid();
      const ids = grid.map((t) => t.id);
      expect(new Set(ids).size).toBe(9);
    });

    it("should have valid territory types", () => {
      const grid = createHexGrid();
      const validTypes = ["CORPORATE", "FRINGE", "UNDERGROUND"];
      expect(grid.every((t) => validTypes.includes(t.type))).toBe(true);
    });
  });

  describe("control checks", () => {
    it("should identify Corp-controlled territory", () => {
      const territory = createTerritory({ q: 0, r: 0 });
      territory.corporateInfluence = 60;
      expect(isCorpControlled(territory)).toBe(true);

      territory.corporateInfluence = 59;
      expect(isCorpControlled(territory)).toBe(false);
    });

    it("should identify Runner-controlled territory", () => {
      const territory = createTerritory({ q: 0, r: 0 });
      territory.corporateInfluence = 40;
      expect(isRunnerControlled(territory)).toBe(true);

      territory.corporateInfluence = 41;
      expect(isRunnerControlled(territory)).toBe(false);
    });
  });

  describe("modifyTerritory", () => {
    it("should modify attributes", () => {
      const territory = createTerritory({ q: 0, r: 0 });
      const modified = modifyTerritory(territory, {
        securityLevel: 3,
        corporateInfluence: 75,
      });

      expect(modified.securityLevel).toBe(3);
      expect(modified.corporateInfluence).toBe(75);
      expect(modified.resourceValue).toBe(territory.resourceValue);
    });

    it("should clamp values to valid ranges", () => {
      const territory = createTerritory({ q: 0, r: 0 });

      const modified = modifyTerritory(territory, {
        securityLevel: 10,
        corporateInfluence: 150,
        stabilityIndex: -50,
      });

      expect(modified.securityLevel).toBe(5);
      expect(modified.corporateInfluence).toBe(100);
      expect(modified.stabilityIndex).toBe(0);
    });
  });
});
