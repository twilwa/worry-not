// ABOUTME: Tests for shared game types including game state, messages, and components
// ABOUTME: Validates type narrowing, discriminated unions, and all required properties

import { describe, test, expect, assertType } from "vitest";
import type {
  Territory,
  TerritoryType,
  Faction,
  FactionType,
  Card,
  CardType,
  Player,
  ClientMessage,
  ServerMessage,
  ExecutionContext,
  ComponentResult,
  ComponentType,
  CardComponent,
} from "../types";

describe("Game State Types", () => {
  describe("Territory", () => {
    test("should have all required properties", () => {
      const territory: Territory = {
        id: "territory-1",
        name: "Corporate Plaza",
        type: "CORPORATE",
        securityLevel: 3,
        resourceValue: 4,
        stabilityIndex: 75,
        corporateInfluence: 80,
        adjacentTerritoryIds: ["territory-2", "territory-3"],
      };

      expect(territory.id).toBe("territory-1");
      expect(territory.name).toBe("Corporate Plaza");
      expect(territory.type).toBe("CORPORATE");
      expect(territory.securityLevel).toBe(3);
      expect(territory.resourceValue).toBe(4);
      expect(territory.stabilityIndex).toBe(75);
      expect(territory.corporateInfluence).toBe(80);
      expect(territory.adjacentTerritoryIds).toHaveLength(2);
    });

    test("should enforce security level range 1-5", () => {
      const validLevels: Array<1 | 2 | 3 | 4 | 5> = [1, 2, 3, 4, 5];

      for (const level of validLevels) {
        const territory: Territory = {
          id: "test",
          name: "Test",
          type: "CORPORATE",
          securityLevel: level,
          resourceValue: 3,
          stabilityIndex: 50,
          corporateInfluence: 50,
          adjacentTerritoryIds: [],
        };
        expect(territory.securityLevel).toBeGreaterThanOrEqual(1);
        expect(territory.securityLevel).toBeLessThanOrEqual(5);
      }
    });

    test("should enforce resource value range 1-5", () => {
      const validValues: Array<1 | 2 | 3 | 4 | 5> = [1, 2, 3, 4, 5];

      for (const value of validValues) {
        const territory: Territory = {
          id: "test",
          name: "Test",
          type: "FRINGE",
          securityLevel: 3,
          resourceValue: value,
          stabilityIndex: 50,
          corporateInfluence: 50,
          adjacentTerritoryIds: [],
        };
        expect(territory.resourceValue).toBeGreaterThanOrEqual(1);
        expect(territory.resourceValue).toBeLessThanOrEqual(5);
      }
    });

    test("should accept all territory types", () => {
      const types: TerritoryType[] = ["CORPORATE", "FRINGE", "UNDERGROUND"];

      for (const type of types) {
        const territory: Territory = {
          id: "test",
          name: "Test",
          type,
          securityLevel: 3,
          resourceValue: 3,
          stabilityIndex: 50,
          corporateInfluence: 50,
          adjacentTerritoryIds: [],
        };
        expect(territory.type).toBe(type);
      }
    });
  });

  describe("Faction", () => {
    test("should have all required properties", () => {
      const faction: Faction = {
        id: "faction-weyland",
        type: "CORP",
        resources: 10,
        victoryPoints: 3,
      };

      expect(faction.id).toBe("faction-weyland");
      expect(faction.type).toBe("CORP");
      expect(faction.resources).toBe(10);
      expect(faction.victoryPoints).toBe(3);
    });

    test("should accept both CORP and RUNNER types", () => {
      const corpFaction: Faction = {
        id: "corp-1",
        type: "CORP",
        resources: 5,
        victoryPoints: 0,
      };

      const runnerFaction: Faction = {
        id: "runner-1",
        type: "RUNNER",
        resources: 8,
        victoryPoints: 2,
      };

      expect(corpFaction.type).toBe("CORP");
      expect(runnerFaction.type).toBe("RUNNER");
    });
  });

  describe("Card", () => {
    test("should have all required properties", () => {
      const card: Card = {
        id: "card-hedge-fund",
        name: "Hedge Fund",
        type: "OVERWORLD",
        faction: "CORP",
        cost: 5,
        components: [],
      };

      expect(card.id).toBe("card-hedge-fund");
      expect(card.name).toBe("Hedge Fund");
      expect(card.type).toBe("OVERWORLD");
      expect(card.faction).toBe("CORP");
      expect(card.cost).toBe(5);
      expect(card.components).toEqual([]);
    });

    test("should accept both OVERWORLD and SCENARIO card types", () => {
      const overworldCard: Card = {
        id: "card-1",
        name: "Test Card",
        type: "OVERWORLD",
        faction: "CORP",
        cost: 3,
        components: [],
      };

      const scenarioCard: Card = {
        id: "card-2",
        name: "Test Card 2",
        type: "SCENARIO",
        faction: "RUNNER",
        cost: 2,
        components: [],
      };

      expect(overworldCard.type).toBe("OVERWORLD");
      expect(scenarioCard.type).toBe("SCENARIO");
    });

    test("should support components array", () => {
      const card: Card = {
        id: "card-with-components",
        name: "Complex Card",
        type: "SCENARIO",
        faction: "CORP",
        cost: 4,
        components: [
          { type: "CREDIT_COST", amount: 2 },
          { type: "DEAL_DAMAGE", damageType: "NET", amount: 1 },
        ],
      };

      expect(card.components).toHaveLength(2);
      expect(card.components[0]?.type).toBe("CREDIT_COST");
      expect(card.components[1]?.type).toBe("DEAL_DAMAGE");
    });
  });

  describe("Player", () => {
    test("should have all required properties", () => {
      const player: Player = {
        id: "player-1",
        name: "Test Player",
        factionId: "faction-weyland",
      };

      expect(player.id).toBe("player-1");
      expect(player.name).toBe("Test Player");
      expect(player.factionId).toBe("faction-weyland");
    });
  });
});

describe("WebSocket Message Protocol", () => {
  describe("Client Messages", () => {
    test("should support PLAY_CARD message", () => {
      const message: ClientMessage = {
        type: "PLAY_CARD",
        cardId: "card-1",
        targetId: "target-1",
      };

      expect(message.type).toBe("PLAY_CARD");
      if (message.type === "PLAY_CARD") {
        expect(message.cardId).toBe("card-1");
        expect(message.targetId).toBe("target-1");
      }
    });

    test("should support PLAY_CARD without optional targetId", () => {
      const message: ClientMessage = {
        type: "PLAY_CARD",
        cardId: "card-1",
      };

      expect(message.type).toBe("PLAY_CARD");
      if (message.type === "PLAY_CARD") {
        expect(message.cardId).toBe("card-1");
        expect(message.targetId).toBeUndefined();
      }
    });

    test("should support END_TURN message", () => {
      const message: ClientMessage = {
        type: "END_TURN",
      };

      expect(message.type).toBe("END_TURN");
    });

    test("should support TRIGGER_SCENARIO message", () => {
      const message: ClientMessage = {
        type: "TRIGGER_SCENARIO",
        territoryId: "territory-1",
      };

      expect(message.type).toBe("TRIGGER_SCENARIO");
      if (message.type === "TRIGGER_SCENARIO") {
        expect(message.territoryId).toBe("territory-1");
      }
    });

    test("should support JOIN_GAME message with optional gameId", () => {
      const withGameId: ClientMessage = {
        type: "JOIN_GAME",
        gameId: "game-123",
      };

      const withoutGameId: ClientMessage = {
        type: "JOIN_GAME",
      };

      expect(withGameId.type).toBe("JOIN_GAME");
      if (withGameId.type === "JOIN_GAME") {
        expect(withGameId.gameId).toBe("game-123");
      }

      expect(withoutGameId.type).toBe("JOIN_GAME");
      if (withoutGameId.type === "JOIN_GAME") {
        expect(withoutGameId.gameId).toBeUndefined();
      }
    });

    test("should support LEAVE_GAME message", () => {
      const message: ClientMessage = {
        type: "LEAVE_GAME",
      };

      expect(message.type).toBe("LEAVE_GAME");
    });

    test("should narrow types correctly in switch statement", () => {
      const messages: ClientMessage[] = [
        { type: "PLAY_CARD", cardId: "card-1" },
        { type: "END_TURN" },
        { type: "TRIGGER_SCENARIO", territoryId: "territory-1" },
        { type: "JOIN_GAME", gameId: "game-1" },
        { type: "LEAVE_GAME" },
      ];

      for (const message of messages) {
        switch (message.type) {
          case "PLAY_CARD":
            expect(message.cardId).toBeDefined();
            break;
          case "END_TURN":
            expect(message.type).toBe("END_TURN");
            break;
          case "TRIGGER_SCENARIO":
            expect(message.territoryId).toBeDefined();
            break;
          case "JOIN_GAME":
            expect(message.type).toBe("JOIN_GAME");
            break;
          case "LEAVE_GAME":
            expect(message.type).toBe("LEAVE_GAME");
            break;
        }
      }
    });
  });

  describe("Server Messages", () => {
    test("should support STATE_DELTA message", () => {
      const message: ServerMessage = {
        type: "STATE_DELTA",
        delta: {
          territories: [{ id: "territory-1", stabilityIndex: 60 }],
          factions: [{ id: "faction-1", resources: 15 }],
        },
      };

      expect(message.type).toBe("STATE_DELTA");
      if (message.type === "STATE_DELTA") {
        expect(message.delta).toBeDefined();
        expect(message.delta.territories).toHaveLength(1);
      }
    });

    test("should support ACTION_REJECTED message", () => {
      const message: ServerMessage = {
        type: "ACTION_REJECTED",
        reason: "Insufficient credits",
      };

      expect(message.type).toBe("ACTION_REJECTED");
      if (message.type === "ACTION_REJECTED") {
        expect(message.reason).toBe("Insufficient credits");
      }
    });

    test("should support SCENARIO_STARTED message", () => {
      const message: ServerMessage = {
        type: "SCENARIO_STARTED",
        scenarioId: "scenario-1",
        territoryId: "territory-1",
      };

      expect(message.type).toBe("SCENARIO_STARTED");
      if (message.type === "SCENARIO_STARTED") {
        expect(message.scenarioId).toBe("scenario-1");
        expect(message.territoryId).toBe("territory-1");
      }
    });

    test("should support SCENARIO_ENDED message", () => {
      const message: ServerMessage = {
        type: "SCENARIO_ENDED",
        scenarioId: "scenario-1",
        outcome: "RUNNER_WIN",
        rewards: { credits: 5, victoryPoints: 1 },
      };

      expect(message.type).toBe("SCENARIO_ENDED");
      if (message.type === "SCENARIO_ENDED") {
        expect(message.scenarioId).toBe("scenario-1");
        expect(message.outcome).toBe("RUNNER_WIN");
        expect(message.rewards).toBeDefined();
      }
    });

    test("should support GAME_OVER message", () => {
      const message: ServerMessage = {
        type: "GAME_OVER",
        winnerId: "player-1",
        reason: "Victory points reached",
      };

      expect(message.type).toBe("GAME_OVER");
      if (message.type === "GAME_OVER") {
        expect(message.winnerId).toBe("player-1");
        expect(message.reason).toBe("Victory points reached");
      }
    });

    test("should narrow types correctly in switch statement", () => {
      const messages: ServerMessage[] = [
        { type: "STATE_DELTA", delta: { territories: [], factions: [] } },
        { type: "ACTION_REJECTED", reason: "Invalid action" },
        {
          type: "SCENARIO_STARTED",
          scenarioId: "scenario-1",
          territoryId: "territory-1",
        },
        {
          type: "SCENARIO_ENDED",
          scenarioId: "scenario-1",
          outcome: "CORP_WIN",
          rewards: {},
        },
        {
          type: "GAME_OVER",
          winnerId: "player-1",
          reason: "Win condition met",
        },
      ];

      for (const message of messages) {
        switch (message.type) {
          case "STATE_DELTA":
            expect(message.delta).toBeDefined();
            break;
          case "ACTION_REJECTED":
            expect(message.reason).toBeDefined();
            break;
          case "SCENARIO_STARTED":
            expect(message.scenarioId).toBeDefined();
            expect(message.territoryId).toBeDefined();
            break;
          case "SCENARIO_ENDED":
            expect(message.scenarioId).toBeDefined();
            expect(message.outcome).toBeDefined();
            break;
          case "GAME_OVER":
            expect(message.winnerId).toBeDefined();
            expect(message.reason).toBeDefined();
            break;
        }
      }
    });
  });
});

describe("Card Component Types", () => {
  describe("ExecutionContext", () => {
    test("should have all required properties", () => {
      const context: ExecutionContext = {
        gameState: {
          territories: [],
          factions: [],
          players: [],
          cards: [],
          currentTurn: {
            playerId: "player-1",
            phase: "ACTION",
            actionsRemaining: 3,
          },
        },
        sourceCard: {
          id: "card-1",
          name: "Test Card",
          type: "SCENARIO",
          faction: "CORP",
          cost: 2,
          components: [],
        },
        targets: [],
      };

      expect(context.gameState).toBeDefined();
      expect(context.sourceCard).toBeDefined();
      expect(context.targets).toEqual([]);
      expect(context.userInput).toBeUndefined();
    });

    test("should support optional userInput", () => {
      const context: ExecutionContext = {
        gameState: {
          territories: [],
          factions: [],
          players: [],
          cards: [],
          currentTurn: {
            playerId: "player-1",
            phase: "ACTION",
            actionsRemaining: 3,
          },
        },
        sourceCard: {
          id: "card-1",
          name: "Test Card",
          type: "SCENARIO",
          faction: "CORP",
          cost: 2,
          components: [],
        },
        targets: [],
        userInput: { selectedOption: "option-a" },
      };

      expect(context.userInput).toBeDefined();
      expect(context.userInput.selectedOption).toBe("option-a");
    });
  });

  describe("ComponentResult", () => {
    test("should have stateChanges array", () => {
      const result: ComponentResult = {
        stateChanges: [
          { type: "MODIFY_CREDITS", targetId: "faction-1", amount: 5 },
          {
            type: "DEAL_DAMAGE",
            targetId: "player-1",
            damageType: "NET",
            amount: 2,
          },
        ],
      };

      expect(result.stateChanges).toHaveLength(2);
      expect(result.pauseReason).toBeUndefined();
    });

    test("should support optional pauseReason", () => {
      const result: ComponentResult = {
        stateChanges: [],
        pauseReason: "AWAITING_TARGET_SELECTION",
      };

      expect(result.stateChanges).toEqual([]);
      expect(result.pauseReason).toBe("AWAITING_TARGET_SELECTION");
    });
  });

  describe("Component Types", () => {
    test("should support all component types", () => {
      const componentTypes: ComponentType[] = [
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

      for (const type of componentTypes) {
        expect(type).toBeDefined();
      }
    });

    test("should create typed components", () => {
      const creditCost: CardComponent = {
        type: "CREDIT_COST",
        amount: 3,
      };

      const dealDamage: CardComponent = {
        type: "DEAL_DAMAGE",
        damageType: "NET",
        amount: 2,
      };

      const drawCards: CardComponent = {
        type: "DRAW_CARDS",
        amount: 3,
      };

      expect(creditCost.type).toBe("CREDIT_COST");
      expect(dealDamage.type).toBe("DEAL_DAMAGE");
      expect(drawCards.type).toBe("DRAW_CARDS");
    });
  });
});
