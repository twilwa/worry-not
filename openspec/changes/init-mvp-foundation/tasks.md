# Tasks: MVP Foundation

## Dependency Graph

```
[1.1 Monorepo]
     │
     v
[2.1 Shared Types] ────────────────────┐
     │                                 │
     ├──────────────┬──────────────────┤
     v              v                  v
[3.1 Card System] [3.2 Server] [3.3 Client]
     │              │                  │
     │              └───────┬──────────┘
     v                      v
[4.1 Weyland Deck]   [4.2 Territory System]
[4.3 Anarch Deck]           │
                            v
                    [5.1 Overworld Loop]
                            │
                            v
                    [5.2 Scenario System]
                            │
                            v
                    [6.1 Interplay Integration]
```

## 1. Foundation (Serial - Critical Path)

- [x] 1.1 Initialize monorepo with Turborepo + pnpm workspaces
  - Create `packages/{client,server,shared,db}` structure
  - Configure TypeScript with strict mode
  - Set up Biome for lint/format
  - Add Vitest for testing
  - **Validation**: `pnpm build` succeeds, `pnpm test` runs
  - **Completed**: worry-not-bom closed

## 2. Shared Types (Serial - Unlocks parallel work)

- [x] 2.1 Define shared game types and message protocol
  - Game state types (Territory, Faction, Card, Player)
  - WebSocket message types (ClientMessage, ServerMessage)
  - Card component types (Cost, Target, Effect, etc.)
  - **Validation**: Types compile, no `any` escape hatches
  - **Completed**: worry-not-b2r closed, 32 tests passing

## 3. Core Systems (Parallel - 3 streams)

### Stream A: Card System

- [ ] 3.1 Implement card component system core (IN PROGRESS: worry-not-o38)
  - Component interface and execution context
  - Basic components: CreditCost, GainCredits, DealDamage
  - Card execution service with sequential processing
  - **Validation**: Unit tests pass for component execution

### Stream B: Server

- [ ] 3.2 Set up Hono server with WebSocket support (IN PROGRESS: worry-not-xp7)
  - HTTP server with health endpoint
  - WebSocket upgrade and connection management
  - Message routing and validation
  - Game session state management
  - **Validation**: WebSocket echo test passes

### Stream C: Client

- [ ] 3.3 Create React + PixiJS client scaffold (IN PROGRESS: worry-not-1dc)
  - Vite + React setup
  - PixiJS canvas integration
  - WebSocket client with reconnection
  - Basic game state store (Zustand or similar)
  - **Validation**: Client connects to server

## 4. Game Content (Parallel - 3 streams)

### Stream A: Faction Decks (depends on 3.1)

- [ ] 4.1 Create Weyland starter deck (10-15 cards)
  - Infrastructure cards (walls, barriers)
  - Economy cards (resource generation)
  - Damage cards (meat damage)
  - **Validation**: Deck validates, cards execute correctly

- [ ] 4.3 Create Anarch starter deck (10-15 cards)
  - Virus programs (progressive effects)
  - Icebreakers (bypass components)
  - Destruction events (high-risk/high-reward)
  - **Validation**: Deck validates, cards execute correctly

### Stream B: Territory System (depends on 3.2, 3.3)

- [ ] 4.2 Implement hex grid territory system
  - Hex grid data structure (3x3 for MVP)
  - Territory attributes (security, resources, influence)
  - PixiJS hex grid renderer
  - Click-to-select interaction
  - **Validation**: Grid renders, clicks detected

## 5. Game Layers (Serial)

- [ ] 5.1 Implement Overworld game loop
  - Turn structure (upkeep, action, resolution)
  - Influence placement mechanics
  - Resource generation from territories
  - **Validation**: Complete Corp + Runner turns

- [ ] 5.2 Implement Scenario mission system
  - Scenario trigger from Overworld action
  - Scenario state machine (setup, action, resolution)
  - Basic ICE encounters
  - Success/failure determination
  - **Validation**: Complete scenario run

## 6. Integration (Serial - Final validation)

- [ ] 6.1 Implement Overworld ↔ Scenario interplay
  - Territory state → Scenario parameters (security level)
  - Scenario outcome → Overworld state (influence shift)
  - End-to-end flow test
  - **Validation**: TRI-170 success criteria met

## 7. Polish (Optional - Time permitting)

- [ ] 7.1 Add basic card animations
- [ ] 7.2 Improve error handling and reconnection
- [ ] 7.3 Add game state persistence (optional)
