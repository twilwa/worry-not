# Card Component System Implementation

## Overview

Implemented the core card component system for End of Line, providing a stateless, composable architecture for card effects.

## Implementation Details

### Components Implemented

#### Cost Components

- **CreditCost**: Deducts credits from player, fails if insufficient
- **ActionCost**: Deducts actions from player, fails if insufficient

#### Effect Components

- **GainCredits**: Adds credits to player
- **DealDamage**: Reduces target health (supports NET, MEAT, BRAIN damage types)
- **InstallCard**: Moves card from hand to installed area

### Execution Pipeline

The card executor enforces a strict execution order:

1. **Cost Components** (0-2): Execute first, failure aborts execution
2. **Target Components** (10-12): Target selection
3. **Effect Components** (20-23): Card effects

### Key Features

- **Stateless Components**: All components are pure functions receiving ExecutionContext
- **Deterministic Execution**: Same input always produces same output
- **Failure Handling**: Cost failures abort execution before effects apply
- **State Changes**: Components return state changes, never mutate directly

### File Structure

```
packages/shared/src/
├── components/
│   ├── cost/
│   │   ├── credit-cost.ts
│   │   └── action-cost.ts
│   ├── effect/
│   │   ├── gain-credits.ts
│   │   ├── deal-damage.ts
│   │   └── install-card.ts
│   └── index.ts
├── execution/
│   ├── card-executor.ts
│   └── index.ts
└── types/
    ├── components.ts (updated)
    └── game-state.ts (updated)
```

### Type Updates

- Added `credits`, `actions`, `health` to `Player` type
- Added `sourcePlayerId` to `ExecutionContext`
- Added `success` and `reason` to `ComponentResult`
- Added `MODIFY_ACTIONS` to `StateChangeType`
- Added `execute` method to `CardComponent`
- Created `CardExecutionResult` type

### Tests

All 9 test scenarios pass:

- Component execution order
- Cost failure abortion
- CreditCost deduction and failure
- ActionCost deduction and failure
- GainCredits addition
- DealDamage with damage types
- InstallCard placement

### Usage Example

```typescript
import {
  createCreditCost,
  createGainCredits,
  executeCard,
} from "@end-of-line/shared";

// Create a card that costs 2 credits and gains 5
const card: Card = {
  id: "hedge-fund",
  name: "Hedge Fund",
  type: "SCENARIO",
  faction: "CORP",
  cost: 2,
  components: [createCreditCost(2), createGainCredits(5)],
};

// Execute the card
const result = await executeCard({
  gameState,
  sourceCard: card,
  sourcePlayerId: "player1",
  targets: [],
});

if (result.success) {
  // Apply state changes
  applyStateChanges(result.stateChanges);
}
```

## Next Steps

This implementation unblocks:

- worry-not-4ph: Create Weyland starter deck
- worry-not-b2f: Create Anarch starter deck
- worry-not-4mx: Implement Overworld game loop

## Files Changed

- `/Users/anon/Projects/worry-not/packages/shared/src/types/game-state.ts`
- `/Users/anon/Projects/worry-not/packages/shared/src/types/components.ts`
- `/Users/anon/Projects/worry-not/packages/shared/src/types/index.ts`
- `/Users/anon/Projects/worry-not/packages/shared/src/index.ts`
- `/Users/anon/Projects/worry-not/packages/shared/src/components/cost/credit-cost.ts` (new)
- `/Users/anon/Projects/worry-not/packages/shared/src/components/cost/action-cost.ts` (new)
- `/Users/anon/Projects/worry-not/packages/shared/src/components/effect/gain-credits.ts` (new)
- `/Users/anon/Projects/worry-not/packages/shared/src/components/effect/deal-damage.ts` (new)
- `/Users/anon/Projects/worry-not/packages/shared/src/components/effect/install-card.ts` (new)
- `/Users/anon/Projects/worry-not/packages/shared/src/components/index.ts` (new)
- `/Users/anon/Projects/worry-not/packages/shared/src/execution/card-executor.ts` (new)
- `/Users/anon/Projects/worry-not/packages/shared/src/execution/index.ts` (new)
- `/Users/anon/Projects/worry-not/packages/shared/src/__tests__/card-executor.test.ts` (new)
