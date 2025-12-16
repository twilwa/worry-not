// ABOUTME: Card execution engine
// ABOUTME: Executes card components in fixed order: Cost → Target → Control → Effect

import type {
  ExecutionContext,
  CardExecutionResult,
  CardComponent,
  ComponentType,
  StateChange,
} from "../types";

/**
 * Component execution order priority
 * Lower numbers execute first
 */
const COMPONENT_ORDER: Record<ComponentType, number> = {
  // Cost components execute first
  CREDIT_COST: 0,
  ACTION_COST: 1,
  TRASH_COST: 2,
  // Target components
  SELF_TARGET: 10,
  SINGLE_TARGET: 11,
  MULTI_TARGET: 12,
  // Effect components
  DEAL_DAMAGE: 20,
  GAIN_CREDITS: 21,
  DRAW_CARDS: 22,
  INSTALL_CARD: 23,
};

/**
 * Sorts components by execution order
 * @param components - Array of card components
 * @returns Sorted array of components
 */
function sortComponentsByOrder(components: CardComponent[]): CardComponent[] {
  return [...components].sort((a, b) => {
    const orderA = COMPONENT_ORDER[a.type] ?? 999;
    const orderB = COMPONENT_ORDER[b.type] ?? 999;
    return orderA - orderB;
  });
}

/**
 * Executes a card with its components
 * @param context - Execution context containing game state and card
 * @returns Result with success status and accumulated state changes
 */
export async function executeCard(
  context: ExecutionContext,
): Promise<CardExecutionResult> {
  const components = context.sourceCard.components as CardComponent[];
  const sortedComponents = sortComponentsByOrder(components);
  const accumulatedChanges: StateChange[] = [];

  for (const component of sortedComponents) {
    const result = component.execute(context);

    // If a component fails, abort execution
    if (result.success === false) {
      return {
        success: false,
        reason: result.reason,
        stateChanges: [],
      };
    }

    // Accumulate state changes
    accumulatedChanges.push(...result.stateChanges);

    // If a component pauses execution, return early with accumulated changes
    if (result.pauseReason) {
      return {
        success: true,
        stateChanges: accumulatedChanges,
      };
    }
  }

  return {
    success: true,
    stateChanges: accumulatedChanges,
  };
}
