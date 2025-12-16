// ABOUTME: GainCredits component implementation
// ABOUTME: Adds credits to the player

import type {
  CardComponent,
  ExecutionContext,
  ComponentResult,
} from "../../types";

/**
 * Creates a GainCredits component that adds credits to the player
 * @param amount - The number of credits to add
 * @returns A CardComponent that adds credits
 */
export function createGainCredits(amount: number): CardComponent {
  return {
    type: "GAIN_CREDITS",
    amount,
    execute: (context: ExecutionContext): ComponentResult => {
      return {
        success: true,
        stateChanges: [
          {
            type: "MODIFY_CREDITS",
            targetId: context.sourcePlayerId,
            amount,
          },
        ],
      };
    },
  };
}
