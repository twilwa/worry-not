// ABOUTME: Tests for card component execution pipeline
// ABOUTME: Validates execution order, cost failures, and component behavior

import { describe, it, expect } from "vitest";
import type {
  GameState,
  Card,
  ExecutionContext,
  ComponentResult,
} from "../types";
import { executeCard } from "../execution/card-executor";
import { createCreditCost } from "../components/cost/credit-cost";
import { createActionCost } from "../components/cost/action-cost";
import { createGainCredits } from "../components/effect/gain-credits";
import { createDealDamage } from "../components/effect/deal-damage";
import { createInstallCard } from "../components/effect/install-card";

describe("Card Executor", () => {
  describe("Component Execution Pipeline", () => {
    it("executes cost components before effect components", async () => {
      const executionLog: string[] = [];

      const mockCreditCost = {
        type: "CREDIT_COST" as const,
        execute: (ctx: ExecutionContext): ComponentResult => {
          executionLog.push("CREDIT_COST");
          return {
            stateChanges: [
              {
                type: "MODIFY_CREDITS",
                targetId: ctx.sourcePlayerId,
                amount: -2,
              },
            ],
          };
        },
      };

      const mockGainCredits = {
        type: "GAIN_CREDITS" as const,
        execute: (ctx: ExecutionContext): ComponentResult => {
          executionLog.push("GAIN_CREDITS");
          return {
            stateChanges: [
              {
                type: "MODIFY_CREDITS",
                targetId: ctx.sourcePlayerId,
                amount: 3,
              },
            ],
          };
        },
      };

      const card: Card = {
        id: "test-card",
        name: "Test Card",
        type: "SCENARIO",
        faction: "RUNNER",
        cost: 2,
        components: [mockGainCredits, mockCreditCost], // Deliberately out of order
      };

      const gameState: GameState = {
        territories: [],
        factions: [
          {
            id: "runner-faction",
            type: "RUNNER",
            resources: 10,
            victoryPoints: 0,
          },
        ],
        players: [
          {
            id: "player1",
            name: "Test Player",
            factionId: "runner-faction",
            credits: 5,
            actions: 3,
            health: 10,
          },
        ],
        cards: [card],
        currentTurn: {
          playerId: "player1",
          phase: "ACTION",
          actionsRemaining: 3,
        },
      };

      await executeCard({
        gameState,
        sourceCard: card,
        sourcePlayerId: "player1",
        targets: [],
      });

      expect(executionLog).toEqual(["CREDIT_COST", "GAIN_CREDITS"]);
    });

    it("aborts execution when cost component fails", async () => {
      const card: Card = {
        id: "expensive-card",
        name: "Expensive Card",
        type: "SCENARIO",
        faction: "RUNNER",
        cost: 10,
        components: [createCreditCost(10), createGainCredits(5)],
      };

      const gameState: GameState = {
        territories: [],
        factions: [
          {
            id: "runner-faction",
            type: "RUNNER",
            resources: 10,
            victoryPoints: 0,
          },
        ],
        players: [
          {
            id: "player1",
            name: "Test Player",
            factionId: "runner-faction",
            credits: 3, // Not enough credits
            actions: 3,
            health: 10,
          },
        ],
        cards: [card],
        currentTurn: {
          playerId: "player1",
          phase: "ACTION",
          actionsRemaining: 3,
        },
      };

      const result = await executeCard({
        gameState,
        sourceCard: card,
        sourcePlayerId: "player1",
        targets: [],
      });

      expect(result.success).toBe(false);
      expect(result.reason).toBe("Insufficient credits");
      expect(result.stateChanges).toEqual([]);
    });
  });

  describe("CreditCost Component", () => {
    it("deducts credits from player", async () => {
      const card: Card = {
        id: "card-1",
        name: "Card 1",
        type: "SCENARIO",
        faction: "RUNNER",
        cost: 3,
        components: [createCreditCost(3)],
      };

      const gameState: GameState = {
        territories: [],
        factions: [
          {
            id: "runner-faction",
            type: "RUNNER",
            resources: 10,
            victoryPoints: 0,
          },
        ],
        players: [
          {
            id: "player1",
            name: "Test Player",
            factionId: "runner-faction",
            credits: 5,
            actions: 3,
            health: 10,
          },
        ],
        cards: [card],
        currentTurn: {
          playerId: "player1",
          phase: "ACTION",
          actionsRemaining: 3,
        },
      };

      const result = await executeCard({
        gameState,
        sourceCard: card,
        sourcePlayerId: "player1",
        targets: [],
      });

      expect(result.success).toBe(true);
      const creditChange = result.stateChanges.find(
        (c) => c.type === "MODIFY_CREDITS",
      );
      expect(creditChange).toBeDefined();
      expect(creditChange?.targetId).toBe("player1");
      expect(creditChange?.amount).toBe(-3);
    });

    it("fails when player has insufficient credits", async () => {
      const card: Card = {
        id: "card-1",
        name: "Card 1",
        type: "SCENARIO",
        faction: "RUNNER",
        cost: 5,
        components: [createCreditCost(5)],
      };

      const gameState: GameState = {
        territories: [],
        factions: [
          {
            id: "runner-faction",
            type: "RUNNER",
            resources: 10,
            victoryPoints: 0,
          },
        ],
        players: [
          {
            id: "player1",
            name: "Test Player",
            factionId: "runner-faction",
            credits: 3,
            actions: 3,
            health: 10,
          },
        ],
        cards: [card],
        currentTurn: {
          playerId: "player1",
          phase: "ACTION",
          actionsRemaining: 3,
        },
      };

      const result = await executeCard({
        gameState,
        sourceCard: card,
        sourcePlayerId: "player1",
        targets: [],
      });

      expect(result.success).toBe(false);
      expect(result.reason).toBe("Insufficient credits");
    });
  });

  describe("ActionCost Component", () => {
    it("deducts actions from player", async () => {
      const card: Card = {
        id: "card-1",
        name: "Card 1",
        type: "SCENARIO",
        faction: "RUNNER",
        cost: 0,
        components: [createActionCost(2)],
      };

      const gameState: GameState = {
        territories: [],
        factions: [
          {
            id: "runner-faction",
            type: "RUNNER",
            resources: 10,
            victoryPoints: 0,
          },
        ],
        players: [
          {
            id: "player1",
            name: "Test Player",
            factionId: "runner-faction",
            credits: 5,
            actions: 3,
            health: 10,
          },
        ],
        cards: [card],
        currentTurn: {
          playerId: "player1",
          phase: "ACTION",
          actionsRemaining: 3,
        },
      };

      const result = await executeCard({
        gameState,
        sourceCard: card,
        sourcePlayerId: "player1",
        targets: [],
      });

      expect(result.success).toBe(true);
      const actionChange = result.stateChanges.find(
        (c) => c.type === "MODIFY_ACTIONS",
      );
      expect(actionChange).toBeDefined();
      expect(actionChange?.targetId).toBe("player1");
      expect(actionChange?.amount).toBe(-2);
    });

    it("fails when player has insufficient actions", async () => {
      const card: Card = {
        id: "card-1",
        name: "Card 1",
        type: "SCENARIO",
        faction: "RUNNER",
        cost: 0,
        components: [createActionCost(3)],
      };

      const gameState: GameState = {
        territories: [],
        factions: [
          {
            id: "runner-faction",
            type: "RUNNER",
            resources: 10,
            victoryPoints: 0,
          },
        ],
        players: [
          {
            id: "player1",
            name: "Test Player",
            factionId: "runner-faction",
            credits: 5,
            actions: 1,
            health: 10,
          },
        ],
        cards: [card],
        currentTurn: {
          playerId: "player1",
          phase: "ACTION",
          actionsRemaining: 1,
        },
      };

      const result = await executeCard({
        gameState,
        sourceCard: card,
        sourcePlayerId: "player1",
        targets: [],
      });

      expect(result.success).toBe(false);
      expect(result.reason).toBe("Insufficient actions");
    });
  });

  describe("GainCredits Component", () => {
    it("adds credits to player", async () => {
      const card: Card = {
        id: "card-1",
        name: "Card 1",
        type: "SCENARIO",
        faction: "RUNNER",
        cost: 0,
        components: [createGainCredits(4)],
      };

      const gameState: GameState = {
        territories: [],
        factions: [
          {
            id: "runner-faction",
            type: "RUNNER",
            resources: 10,
            victoryPoints: 0,
          },
        ],
        players: [
          {
            id: "player1",
            name: "Test Player",
            factionId: "runner-faction",
            credits: 2,
            actions: 3,
            health: 10,
          },
        ],
        cards: [card],
        currentTurn: {
          playerId: "player1",
          phase: "ACTION",
          actionsRemaining: 3,
        },
      };

      const result = await executeCard({
        gameState,
        sourceCard: card,
        sourcePlayerId: "player1",
        targets: [],
      });

      expect(result.success).toBe(true);
      const creditChange = result.stateChanges.find(
        (c) => c.type === "MODIFY_CREDITS",
      );
      expect(creditChange).toBeDefined();
      expect(creditChange?.targetId).toBe("player1");
      expect(creditChange?.amount).toBe(4);
    });
  });

  describe("DealDamage Component", () => {
    it("reduces target health", async () => {
      const card: Card = {
        id: "card-1",
        name: "Card 1",
        type: "SCENARIO",
        faction: "CORP",
        cost: 0,
        components: [createDealDamage(2, "NET")],
      };

      const gameState: GameState = {
        territories: [],
        factions: [
          {
            id: "corp-faction",
            type: "CORP",
            resources: 10,
            victoryPoints: 0,
          },
        ],
        players: [
          {
            id: "player1",
            name: "Corp Player",
            factionId: "corp-faction",
            credits: 5,
            actions: 3,
            health: 10,
          },
          {
            id: "player2",
            name: "Runner Player",
            factionId: "runner-faction",
            credits: 5,
            actions: 3,
            health: 5,
          },
        ],
        cards: [card],
        currentTurn: {
          playerId: "player1",
          phase: "ACTION",
          actionsRemaining: 3,
        },
      };

      const result = await executeCard({
        gameState,
        sourceCard: card,
        sourcePlayerId: "player1",
        targets: ["player2"],
      });

      expect(result.success).toBe(true);
      const damageChange = result.stateChanges.find(
        (c) => c.type === "DEAL_DAMAGE",
      );
      expect(damageChange).toBeDefined();
      expect(damageChange?.targetId).toBe("player2");
      expect(damageChange?.amount).toBe(2);
      expect(damageChange?.damageType).toBe("NET");
    });
  });

  describe("InstallCard Component", () => {
    it("moves card from hand to installed area", async () => {
      const card: Card = {
        id: "card-1",
        name: "Card 1",
        type: "SCENARIO",
        faction: "RUNNER",
        cost: 0,
        components: [createInstallCard()],
      };

      const gameState: GameState = {
        territories: [],
        factions: [
          {
            id: "runner-faction",
            type: "RUNNER",
            resources: 10,
            victoryPoints: 0,
          },
        ],
        players: [
          {
            id: "player1",
            name: "Test Player",
            factionId: "runner-faction",
            credits: 5,
            actions: 3,
            health: 10,
          },
        ],
        cards: [card],
        currentTurn: {
          playerId: "player1",
          phase: "ACTION",
          actionsRemaining: 3,
        },
      };

      const result = await executeCard({
        gameState,
        sourceCard: card,
        sourcePlayerId: "player1",
        targets: [],
      });

      expect(result.success).toBe(true);
      const installChange = result.stateChanges.find(
        (c) => c.type === "INSTALL_CARD",
      );
      expect(installChange).toBeDefined();
      expect(installChange?.cardId).toBe("card-1");
      expect(installChange?.targetId).toBe("player1");
    });
  });
});
