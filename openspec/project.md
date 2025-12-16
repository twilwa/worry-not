# Project Context

## Purpose

**End of Line** is a browser-based multiplayer roguelike deckbuilder with asymmetric Corp vs Runner gameplay, inspired by Android: Netrunner. The core innovation is a dual-layer gameplay system where Strategic Overworld decisions (hex territory control) directly influence Tactical Scenario missions (instanced card battles), and vice versa.

**MVP Goal**: Validate the Overworld ↔ Scenario interplay loop with minimal viable factions, cards, and UI.

## Tech Stack

- **Language**: TypeScript (shared across client/server)
- **Frontend**: React 19 + PixiJS 8 (canvas rendering)
- **Backend**: Node.js + Hono (HTTP/WebSocket)
- **Database**: PostgreSQL + Drizzle ORM
- **Build**: Vite + Turborepo (monorepo)
- **Testing**: Vitest (unit) + Playwright (E2E)
- **Quality**: Biome (lint/format) + Trunk (orchestration)

## Project Conventions

### Code Style

- Biome for formatting and linting (configured in biome.json)
- Strict TypeScript (`strict: true`, `noUncheckedIndexedAccess: true`)
- Prefer `type` over `interface` unless extending
- Named exports only (no default exports)
- Barrel files (`index.ts`) for package public APIs

### Architecture Patterns

- **Monorepo**: `packages/{client,server,shared,db}`
- **Shared Types**: All game types in `packages/shared/src/types/`
- **Component System**: Cards composed of stateless, sequentially-executed components
- **Authoritative Server**: Game state lives on server; clients receive diffs
- **Message Protocol**: JSON over WebSocket with discriminated union types

### Testing Strategy

- TDD: Write failing test → implement → refactor
- Unit tests colocated with source (`*.test.ts`)
- Integration tests in `__tests__/` directories
- E2E tests in `packages/client/e2e/`
- Coverage target: 80% for shared, 70% for client/server

### Git Workflow

- Main branch: `main`
- Feature branches: `feat/<change-id>` matching openspec change IDs
- Commits: Conventional Commits (`feat:`, `fix:`, `refactor:`, etc.)
- No force push to main
- Squash merge PRs

## Domain Context

### Core Game Loop

```
OVERWORLD (Strategic)          SCENARIO (Tactical)
┌─────────────────────┐        ┌─────────────────────┐
│ Hex Grid Territory  │        │ Instanced Mission   │
│ - Place Influence   │───────▶│ - Play Cards        │
│ - Install Assets    │ TRIGGER│ - Break ICE         │
│ - Advance Agendas   │        │ - Achieve Objective │
└─────────────────────┘        └──────────┬──────────┘
         ▲                                │
         │ OUTCOME                        │
         └────────────────────────────────┘
```

### Faction Design (MVP)

| Faction | Type   | Role      | Key Mechanic                                |
| ------- | ------ | --------- | ------------------------------------------- |
| Weyland | Corp   | Commander | Resource generation, meat damage, barriers  |
| Anarch  | Runner | Soldier   | Viruses, destruction, high-risk/high-reward |

### Card Component System

Components execute in fixed order:

1. **Cost** (CreditCost, ActionCost, TrashCost, HealthCost)
2. **Target** (SelfTarget, SingleEntityTarget, MultiEntityTarget)
3. **Control** (PauseQueue, CancelCard)
4. **Effect** (DealDamage, GainCredits, DrawCards, InstallCard)
5. **Conditional** (KeywordSynergy, RiskReward, ComboEffect)
6. **Info** (RevealCard, ScanEntity)

### Territory Attributes

- `securityLevel`: 1-5, affects scenario difficulty
- `resourceValue`: 1-5, credits generated per turn
- `stabilityIndex`: 0-100, civil unrest level
- `corporateInfluence`: 0-100%, who controls the territory

## Important Constraints

### Performance Budgets

| Metric               | Target  | Rationale                    |
| -------------------- | ------- | ---------------------------- |
| Initial payload      | <5MB    | Mobile data concerns         |
| Time to interactive  | <3s     | User retention               |
| Memory (mobile)      | <150MB  | Low-end device support       |
| State update latency | <200ms  | Responsive feel              |
| Frame rate           | 30+ FPS | Playable on mid-range mobile |

### Browser Compatibility

- Modern browsers only (Chrome 90+, Firefox 88+, Safari 14+)
- WebSocket required (no long-polling fallback for MVP)
- WebGL 2 required for PixiJS
- IndexedDB for client-side caching

### Design Decisions (Locked)

1. TypeScript everywhere (no JavaScript, no WASM for MVP)
2. PostgreSQL (not MongoDB, not SQLite)
3. Monorepo with Turborepo (not Nx, not Lerna)
4. React for UI (not Vue, not Svelte)
5. PixiJS for canvas (not Phaser, not raw Canvas API)

## External Dependencies

### Required Services

| Service          | Purpose                 | Status             |
| ---------------- | ----------------------- | ------------------ |
| PostgreSQL       | Game state persistence  | Needs provisioning |
| WebSocket server | Real-time communication | Part of backend    |

### Optional Services (Post-MVP)

| Service       | Purpose                |
| ------------- | ---------------------- |
| Redis         | Session state, caching |
| S3-compatible | Asset storage          |
| Analytics     | Telemetry              |
