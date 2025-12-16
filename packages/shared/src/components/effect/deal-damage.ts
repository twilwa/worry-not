// ABOUTME: DealDamage component implementation
// ABOUTME: Reduces target health by specified amount

import type {
  CardComponent,
  ExecutionContext,
  ComponentResult,
  DamageType,
} from "../../types";

/**
 * Creates a DealDamage component that reduces target health
 * @param amount - The amount of damage to deal
 * @param damageType - The type of damage (NET, MEAT, or BRAIN)
 * @returns A CardComponent that deals damage
 */
export function createDealDamage(
  amount: number,
  damageType: DamageType,
): CardComponent {
  return {
    type: "DEAL_DAMAGE",
    amount,
    damageType,
    execute: (context: ExecutionContext): ComponentResult => {
      const targetId = context.targets[0];

      if (!targetId) {
        return {
          success: false,
          reason: "No target specified",
          stateChanges: [],
        };
      }

      return {
        success: true,
        stateChanges: [
          {
            type: "DEAL_DAMAGE",
            targetId,
            amount,
            damageType,
          },
        ],
      };
    },
  };
}
