// ABOUTME: InstallCard component implementation
// ABOUTME: Moves card from hand to installed area

import type {
  CardComponent,
  ExecutionContext,
  ComponentResult,
} from "../../types";

/**
 * Creates an InstallCard component that moves a card to installed area
 * @returns A CardComponent that installs a card
 */
export function createInstallCard(): CardComponent {
  return {
    type: "INSTALL_CARD",
    execute: (context: ExecutionContext): ComponentResult => {
      return {
        success: true,
        stateChanges: [
          {
            type: "INSTALL_CARD",
            targetId: context.sourcePlayerId,
            cardId: context.sourceCard.id,
          },
        ],
      };
    },
  };
}
