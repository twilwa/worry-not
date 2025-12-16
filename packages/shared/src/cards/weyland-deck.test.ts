// ABOUTME: Test suite for Weyland starter deck
// ABOUTME: Validates card structure, components, and deck composition

import { describe, it, expect } from "vitest";
import { weylandDeck } from "./weyland-deck";
import type { Card } from "../types";

describe("Weyland Deck", () => {
  it("should have between 10-15 cards", () => {
    expect(weylandDeck.length).toBeGreaterThanOrEqual(10);
    expect(weylandDeck.length).toBeLessThanOrEqual(15);
  });

  it("should have all required card fields", () => {
    weylandDeck.forEach((card: Card) => {
      expect(card).toHaveProperty("id");
      expect(card).toHaveProperty("name");
      expect(card).toHaveProperty("type");
      expect(card).toHaveProperty("faction");
      expect(card).toHaveProperty("cost");
      expect(card).toHaveProperty("components");

      expect(typeof card.id).toBe("string");
      expect(typeof card.name).toBe("string");
      expect(["OVERWORLD", "SCENARIO"]).toContain(card.type);
      expect(card.faction).toBe("CORP");
      expect(typeof card.cost).toBe("number");
      expect(Array.isArray(card.components)).toBe(true);
    });
  });

  it("should have properly structured components", () => {
    weylandDeck.forEach((card: Card) => {
      expect(card.components.length).toBeGreaterThan(0);

      card.components.forEach((component: any) => {
        expect(component).toHaveProperty("type");
        expect(component).toHaveProperty("execute");
        expect(typeof component.execute).toBe("function");
      });
    });
  });

  it("should have unique card IDs", () => {
    const ids = weylandDeck.map((card) => card.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(weylandDeck.length);
  });

  it("should have non-negative costs", () => {
    weylandDeck.forEach((card: Card) => {
      expect(card.cost).toBeGreaterThanOrEqual(0);
    });
  });

  it("should include cards of both OVERWORLD and SCENARIO types", () => {
    const overworldCards = weylandDeck.filter(
      (card) => card.type === "OVERWORLD",
    );
    const scenarioCards = weylandDeck.filter(
      (card) => card.type === "SCENARIO",
    );

    expect(overworldCards.length).toBeGreaterThan(0);
    expect(scenarioCards.length).toBeGreaterThan(0);
  });

  it("should include resource generation cards", () => {
    const resourceCards = weylandDeck.filter((card: Card) =>
      card.components.some((c: any) => c.type === "GAIN_CREDITS"),
    );
    expect(resourceCards.length).toBeGreaterThan(0);
  });

  it("should include damage-dealing cards", () => {
    const damageCards = weylandDeck.filter((card: Card) =>
      card.components.some((c: any) => c.type === "DEAL_DAMAGE"),
    );
    expect(damageCards.length).toBeGreaterThan(0);
  });
});
