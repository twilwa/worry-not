# Design: MVP Foundation Architecture

## Context

End of Line is a multiplayer roguelike deckbuilder with asymmetric Corp vs Runner gameplay. The core innovation is a dual-layer system where Overworld (strategic) decisions influence Scenario (tactical) missions, and vice versa.

This design establishes the foundational architecture to validate this interplay loop with minimal complexity.

## Goals / Non-Goals

**Goals:**

- Establish monorepo structure for code sharing
- Define authoritative server architecture
- Implement component-based card execution
- Enable real-time multiplayer via WebSocket
- Validate Overworld ↔ Scenario feedback loop

**Non-Goals:**

- Production-ready polish
- Scalability beyond 2 concurrent players
- Mobile optimization
- Persistent progression
- AI opponents

## Decisions

### 1. Monorepo Structure

**Decision**: Use Turborepo with pnpm workspaces

```
packages/
├── client/          # React + PixiJS frontend
├── server/          # Hono backend + WebSocket
├── shared/          # Types, game logic, card definitions
└── db/              # Drizzle schema (post-MVP persistence)
```

**Rationale**: Enables type sharing between client/server, simplifies builds, supports parallel development streams.

### 2. Authoritative Server

**Decision**: All game state lives on server; clients receive state diffs

```
Client Action → Server Validation → State Update → Broadcast Diff
```

**Rationale**: Prevents cheating, ensures consistency, simplifies conflict resolution.

**Trade-off**: Higher latency than client-side prediction, acceptable for turn-based gameplay.

### 3. Component-Based Card System

**Decision**: Cards composed of stateless components executing sequentially

```typescript
// Execution order
Cost → Target → Control → Effect → Conditional → Info

interface CardComponent {
  type: ComponentType;
  execute(context: ExecutionContext): ComponentResult;
}
```

**Rationale**: Enables composable card effects, predictable execution, easier balancing.

### 4. WebSocket Protocol

**Decision**: JSON messages with discriminated union types

```typescript
// Client → Server
type ClientMessage =
  | { type: "PLAY_CARD"; cardId: string; targetId?: string }
  | { type: "END_TURN" }
  | { type: "TRIGGER_SCENARIO"; territoryId: string };

// Server → Client
type ServerMessage =
  | { type: "STATE_DELTA"; payload: GameStateDelta }
  | { type: "ACTION_REJECTED"; reason: string }
  | { type: "SCENARIO_STARTED"; scenarioId: string };
```

**Rationale**: Type-safe, debuggable, extensible.

### 5. Rendering Stack

**Decision**: PixiJS for game canvas, React for UI overlay

**Rationale**: PixiJS handles high-performance 2D rendering (hex grid, cards), React manages UI state (hand, HUD, menus).

## Risks / Trade-offs

| Risk                   | Mitigation                                            |
| ---------------------- | ----------------------------------------------------- |
| WebSocket complexity   | Use native WebSocket, avoid Socket.IO overhead        |
| State sync bugs        | Comprehensive integration tests for state transitions |
| Card effect edge cases | TDD for component execution                           |
| Performance budget     | Profile early, establish budgets in CI                |

## Migration Plan

N/A - Greenfield implementation

## Open Questions

1. Should card definitions live in YAML/JSON or TypeScript? (Leaning TypeScript for type safety)
2. How granular should state diffs be? (Start with full state, optimize later)
3. What authentication for MVP? (Anonymous sessions, defer auth)
