// ABOUTME: CreditCost component implementation
// ABOUTME: Deducts credits from the player, fails if insufficient

import type {
  CardComponent,
  ExecutionContext,
  ComponentResult,
} from "../../types";

/**
 * Creates a CreditCost component that deducts credits from the player
 * @param amount - The number of credits to deduct
 * @returns A CardComponent that deducts credits
 */
export function createCreditCost(amount: number): CardComponent {
  return {
    type: "CREDIT_COST",
    amount,
    execute: (context: ExecutionContext): ComponentResult => {
      const player = context.gameState.players.find(
        (p) => p.id === context.sourcePlayerId,
      );

      if (!player) {
        return {
          success: false,
          reason: "Player not found",
          stateChanges: [],
        };
      }

      if (player.credits < amount) {
        return {
          success: false,
          reason: "Insufficient credits",
          stateChanges: [],
        };
      }

      return {
        success: true,
        stateChanges: [
          {
            type: "MODIFY_CREDITS",
            targetId: context.sourcePlayerId,
            amount: -amount,
          },
        ],
      };
    },
  };
}
