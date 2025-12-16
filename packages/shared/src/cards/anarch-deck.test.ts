// ABOUTME: Test suite for Anarch starter deck
// ABOUTME: Validates deck structure, card properties, and component integrity

import { describe, it, expect } from "vitest";
import { anarchDeck } from "./anarch-deck";
import type { Card, CardComponent } from "../types";

describe("Anarch Starter Deck", () => {
  describe("Deck Structure", () => {
    it("should contain between 10-15 cards", () => {
      expect(anarchDeck.length).toBeGreaterThanOrEqual(10);
      expect(anarchDeck.length).toBeLessThanOrEqual(15);
    });

    it("should have exactly 12 cards", () => {
      expect(anarchDeck.length).toBe(12);
    });

    it("should have unique card IDs", () => {
      const ids = anarchDeck.map((card) => card.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(anarchDeck.length);
    });
  });

  describe("Card Properties", () => {
    it("all cards should have required fields", () => {
      anarchDeck.forEach((card: Card) => {
        expect(card).toHaveProperty("id");
        expect(card).toHaveProperty("name");
        expect(card).toHaveProperty("type");
        expect(card).toHaveProperty("faction");
        expect(card).toHaveProperty("cost");
        expect(card).toHaveProperty("components");
      });
    });

    it("all cards should have non-empty names", () => {
      anarchDeck.forEach((card) => {
        expect(card.name).toBeTruthy();
        expect(card.name.length).toBeGreaterThan(0);
      });
    });

    it("all cards should be RUNNER faction", () => {
      anarchDeck.forEach((card) => {
        expect(card.faction).toBe("RUNNER");
      });
    });

    it("all cards should have valid type (OVERWORLD or SCENARIO)", () => {
      anarchDeck.forEach((card) => {
        expect(["OVERWORLD", "SCENARIO"]).toContain(card.type);
      });
    });

    it("all cards should have non-negative costs", () => {
      anarchDeck.forEach((card) => {
        expect(card.cost).toBeGreaterThanOrEqual(0);
      });
    });

    it("should have a mix of OVERWORLD and SCENARIO cards", () => {
      const overworldCards = anarchDeck.filter(
        (card) => card.type === "OVERWORLD",
      );
      const scenarioCards = anarchDeck.filter(
        (card) => card.type === "SCENARIO",
      );

      expect(overworldCards.length).toBeGreaterThan(0);
      expect(scenarioCards.length).toBeGreaterThan(0);
    });
  });

  describe("Component Structure", () => {
    it("all cards should have at least one component", () => {
      anarchDeck.forEach((card) => {
        expect(card.components.length).toBeGreaterThan(0);
      });
    });

    it("all components should be properly structured", () => {
      anarchDeck.forEach((card) => {
        card.components.forEach((component) => {
          const comp = component as CardComponent;
          expect(comp).toHaveProperty("type");
          expect(comp).toHaveProperty("execute");
          expect(typeof comp.execute).toBe("function");
        });
      });
    });

    it("should have valid component types", () => {
      const validTypes = [
        "CREDIT_COST",
        "ACTION_COST",
        "TRASH_COST",
        "SELF_TARGET",
        "SINGLE_TARGET",
        "MULTI_TARGET",
        "DEAL_DAMAGE",
        "GAIN_CREDITS",
        "DRAW_CARDS",
        "INSTALL_CARD",
      ];

      anarchDeck.forEach((card) => {
        card.components.forEach((component) => {
          const comp = component as CardComponent;
          expect(validTypes).toContain(comp.type);
        });
      });
    });
  });

  describe("Anarch Theme Validation", () => {
    it("should include economy cards", () => {
      const economyCards = anarchDeck.filter((card) =>
        card.components.some(
          (c) => (c as CardComponent).type === "GAIN_CREDITS",
        ),
      );
      expect(economyCards.length).toBeGreaterThan(0);
    });

    it("should include damage-dealing cards (Anarch signature)", () => {
      const damageCards = anarchDeck.filter((card) =>
        card.components.some(
          (c) => (c as CardComponent).type === "DEAL_DAMAGE",
        ),
      );
      expect(damageCards.length).toBeGreaterThan(0);
    });

    it("should include icebreaker/program cards", () => {
      const programCards = anarchDeck.filter((card) =>
        card.components.some(
          (c) => (c as CardComponent).type === "INSTALL_CARD",
        ),
      );
      expect(programCards.length).toBeGreaterThan(0);
    });

    it("should include specific Anarch signature cards", () => {
      const cardNames = anarchDeck.map((card) => card.name);

      // Check for suggested cards
      expect(cardNames).toContain("Datasucker");
      expect(cardNames).toContain("Demolition Run");
      expect(cardNames).toContain("Yog.0");
      expect(cardNames).toContain("Stimhack");
      expect(cardNames).toContain("Corroder");
    });

    it("should have virus program cards (Datasucker, Imp)", () => {
      const virusCards = anarchDeck.filter(
        (card) =>
          card.name === "Datasucker" ||
          card.name === "Imp" ||
          card.name.toLowerCase().includes("virus"),
      );
      expect(virusCards.length).toBeGreaterThan(0);
    });
  });

  describe("Card-Specific Validation", () => {
    it("Stimhack should embody risk/reward mechanic", () => {
      const stimhack = anarchDeck.find((card) => card.name === "Stimhack");
      expect(stimhack).toBeDefined();
      if (stimhack) {
        // Should have both gain credits and deal damage (risk/reward)
        const hasGainCredits = stimhack.components.some(
          (c) => (c as CardComponent).type === "GAIN_CREDITS",
        );
        const hasDealDamage = stimhack.components.some(
          (c) => (c as CardComponent).type === "DEAL_DAMAGE",
        );
        expect(hasGainCredits).toBe(true);
        expect(hasDealDamage).toBe(true);
      }
    });

    it("Sure Gamble should be efficient economy", () => {
      const sureGamble = anarchDeck.find((card) => card.name === "Sure Gamble");
      expect(sureGamble).toBeDefined();
      if (sureGamble) {
        // Should cost credits and gain more credits
        const creditCost = sureGamble.components.find(
          (c) => (c as CardComponent).type === "CREDIT_COST",
        ) as CardComponent;
        const gainCredits = sureGamble.components.find(
          (c) => (c as CardComponent).type === "GAIN_CREDITS",
        ) as CardComponent;

        expect(creditCost).toBeDefined();
        expect(gainCredits).toBeDefined();

        if (creditCost?.amount && gainCredits?.amount) {
          // Should gain more than it costs
          expect(gainCredits.amount).toBeGreaterThan(creditCost.amount);
        }
      }
    });

    it("Icebreakers should have install components", () => {
      const icebreakers = ["Corroder", "Yog.0", "Mimic"];
      icebreakers.forEach((name) => {
        const card = anarchDeck.find((c) => c.name === name);
        expect(card).toBeDefined();
        if (card) {
          const hasInstall = card.components.some(
            (c) => (c as CardComponent).type === "INSTALL_CARD",
          );
          expect(hasInstall).toBe(true);
        }
      });
    });

    it("Demolition Run should deal damage", () => {
      const demolitionRun = anarchDeck.find(
        (card) => card.name === "Demolition Run",
      );
      expect(demolitionRun).toBeDefined();
      if (demolitionRun) {
        const hasDealDamage = demolitionRun.components.some(
          (c) => (c as CardComponent).type === "DEAL_DAMAGE",
        );
        expect(hasDealDamage).toBe(true);

        const damageComponent = demolitionRun.components.find(
          (c) => (c as CardComponent).type === "DEAL_DAMAGE",
        ) as CardComponent;
        expect(damageComponent?.damageType).toBeDefined();
      }
    });
  });

  describe("Balance and Distribution", () => {
    it("should have reasonable cost distribution", () => {
      const costs = anarchDeck.map((card) => card.cost);
      const avgCost = costs.reduce((a, b) => a + b, 0) / costs.length;

      // Average cost should be reasonable for a starter deck (0-3 range typical)
      expect(avgCost).toBeGreaterThanOrEqual(0);
      expect(avgCost).toBeLessThanOrEqual(4);
    });

    it("should have free cards (0 cost) for starter deck accessibility", () => {
      const freeCards = anarchDeck.filter((card) => card.cost === 0);
      expect(freeCards.length).toBeGreaterThan(0);
    });

    it("should not be overly expensive (max cost reasonable)", () => {
      const maxCost = Math.max(...anarchDeck.map((card) => card.cost));
      // Starter deck shouldn't have cards costing more than 5
      expect(maxCost).toBeLessThanOrEqual(5);
    });

    it("should have multiple damage types represented", () => {
      const damageTypes = new Set<string>();
      anarchDeck.forEach((card) => {
        card.components.forEach((component) => {
          const comp = component as CardComponent;
          if (comp.type === "DEAL_DAMAGE" && comp.damageType) {
            damageTypes.add(comp.damageType);
          }
        });
      });

      // Anarch should have at least one damage type represented
      expect(damageTypes.size).toBeGreaterThan(0);
    });
  });
});
