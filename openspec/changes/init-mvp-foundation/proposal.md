# Change: Initialize MVP Foundation

## Why

End of Line needs a functioning prototype to validate the core innovation: the feedback loop between Strategic Overworld decisions and Tactical Scenario missions. The MVP must demonstrate 2-player WebSocket gameplay with basic territory control and card-based scenarios.

## What Changes

- **ADDED** Turborepo monorepo with pnpm workspaces (`packages/{client,server,shared,db}`)
- **ADDED** Shared TypeScript types for game state, cards, and WebSocket messages
- **ADDED** Component-based card system with sequential execution
- **ADDED** Hono server with WebSocket support for real-time multiplayer
- **ADDED** React + PixiJS client for hex grid and card rendering
- **ADDED** Hex grid territory system with influence mechanics
- **ADDED** Overworld game loop (strategic layer)
- **ADDED** Scenario mission system (tactical layer)
- **ADDED** Overworld ↔ Scenario interplay mechanics

## Impact

- Affected specs: All new (monorepo, shared-types, card-system, game-server, game-client, territory-system, overworld-layer, scenario-layer)
- Affected code: Entire codebase (greenfield implementation)

## Success Criteria

Per TRI-170 milestone:

- [ ] 2 players can connect via WebSocket
- [ ] 3x3 hex grid rendered with PixiJS
- [ ] Corp can place influence on territories
- [ ] Runner can trigger scenario from territory
- [ ] Scenario outcome affects territory state
- [ ] Round-trip latency <200ms

## MVP Scope

- 1 Corp faction (Weyland): 10-15 cards
- 1 Runner faction (Anarch): 10-15 cards
- Basic component system (CreditCost, GainCredits, DealDamage, InstallCard)
- Minimal UI (functional, not polished)

## Out of Scope

- Additional factions
- Full card sets
- Progression/unlocks
- Mobile optimization
- Matchmaking
- Persistence between sessions
