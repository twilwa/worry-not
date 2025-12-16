// ABOUTME: ActionCost component implementation
// ABOUTME: Deducts actions from the player, fails if insufficient

import type {
  CardComponent,
  ExecutionContext,
  ComponentResult,
} from "../../types";

/**
 * Creates an ActionCost component that deducts actions from the player
 * @param amount - The number of actions to deduct
 * @returns A CardComponent that deducts actions
 */
export function createActionCost(amount: number): CardComponent {
  return {
    type: "ACTION_COST",
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

      if (player.actions < amount) {
        return {
          success: false,
          reason: "Insufficient actions",
          stateChanges: [],
        };
      }

      return {
        success: true,
        stateChanges: [
          {
            type: "MODIFY_ACTIONS",
            targetId: context.sourcePlayerId,
            amount: -amount,
          },
        ],
      };
    },
  };
}
