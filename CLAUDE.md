# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project: End of Line

A multiplayer roguelike deckbuilder with asymmetric Corp vs Runner gameplay. Two interconnected layers: Strategic Overworld (hex territory control) and Tactical Scenario missions (instanced card battles).

### Design Context

Design documents in `netrunner-levelsio/` are **reference material, not gospel**. Key docs:
- `gamedesigndoc-final.md` - Core mechanics and faction design
- `typescript-spec.md` - Technical architecture (web stack)
- `CardComponentSystem.md` - Component-based card system
- `web-first-implementation-plan.md` - Performance budgets and mobile requirements

### MVP Scope (Prototype Focus)

- 1 Corp faction (Weyland), 1 Runner faction (Anarch)
- 9 territories (3x3 hex grid)
- 20-30 cards per faction with component-based effects
- Overworld → Scenario interplay loop
- 2-player WebSocket multiplayer
- <5MB initial payload, <3s to interactive

## Tech Stack

| Layer | Technology | Notes |
|-------|------------|-------|
| Frontend | TypeScript, React 19, PixiJS 8 | PixiJS for game canvas, React for UI overlay |
| Backend | TypeScript, Node.js, Hono | Hono for HTTP + WebSocket |
| Database | PostgreSQL, Drizzle ORM | Type-safe, migration-friendly |
| Real-time | WebSocket (native) | JSON message protocol |
| Testing | Vitest, Playwright | Unit + E2E |
| Build | Vite, Turborepo | Monorepo structure |

## Project Structure

```
packages/
├── client/          # React + PixiJS frontend
├── server/          # Hono backend + WebSocket
├── shared/          # Shared types, game logic, card definitions
└── db/              # Drizzle schema and migrations
```

## Commands

```bash
# Development
pnpm dev                    # Start all packages in dev mode
pnpm dev --filter client    # Start only client
pnpm dev --filter server    # Start only server

# Testing
pnpm test                   # Run all tests
pnpm test:unit              # Unit tests only
pnpm test:e2e               # Playwright E2E tests
pnpm test:coverage          # With coverage report

# Database
pnpm db:generate            # Generate Drizzle migrations
pnpm db:migrate             # Run migrations
pnpm db:studio              # Open Drizzle Studio

# Build
pnpm build                  # Build all packages
pnpm typecheck              # TypeScript check all packages

# Quality
pnpm lint                   # Biome lint
pnpm format                 # Biome format
trunk check                 # Full quality check
```

## Architecture Pillars

### 1. Component-Based Card System

Cards are composed of stateless components that execute sequentially:

```typescript
// Components execute in order: Cost → Target → Control → Effect → Conditional → Info
interface CardComponent {
  type: ComponentType;
  execute(context: ExecutionContext): ComponentResult;
}
```

Faction component affinities:
- **Anarch**: DealDamage, TrashCost, RiskReward, ProgressiveEffect (viruses)
- **Criminal**: GainCredits, BypassSecurity, CancelCard, RedirectEffect
- **Shaper**: InstallCard, BoostProgram, ComboEffect
- **Weyland**: AdvanceAgenda, MeatDamage, ResourceGeneration

### 2. Authoritative Server

All game state lives on server. Clients send actions, receive state diffs:

```typescript
// Client → Server
{ type: "PLAY_CARD", payload: { cardId: string, targetId?: string } }

// Server → Clients
{ type: "STATE_DELTA", payload: { territories: [...], hands: [...] } }
```

Client prediction for UX, server reconciliation for truth.

### 3. Overworld ↔ Scenario Interplay

- Overworld state (territory security, corp installations) → Scenario parameters
- Scenario outcomes (success/fail, damage dealt) → Overworld state changes
- This feedback loop is the core innovation to validate

### 4. Performance Budgets

| Metric | Target |
|--------|--------|
| Initial payload | <5MB |
| Time to interactive | <3s |
| Memory (mobile) | <150MB |
| WebSocket latency | <200ms perceived |
| Frame rate | 30+ FPS on mid-range mobile |

## Workflow

### Task Tracking

- **bd (beads)**: Granular tasks, parallelizable work items
- **openspec**: Feature milestones, architectural changes
- **linctl**: External coordination, blockers needing human input

```bash
bd ready              # Find available work
bd update <id> --status=in_progress
bd close <id>
bd sync --from-main   # Before committing
```

### Development Flow

1. Check `bd ready` for available tasks
2. Read relevant design docs if context needed
3. Write failing tests first (TDD)
4. Implement minimal code to pass
5. `trunk check --fix` before commit
6. `bd close <id>` when done

### Creating Features

Use openspec for anything touching architecture:
```bash
openspec list                     # Check active proposals
openspec validate <change> --strict
```

## Key Domain Concepts

| Term | Definition |
|------|------------|
| Overworld | Strategic layer - hex grid territory control, turn-based |
| Scenario | Tactical layer - instanced mission, card-based combat |
| ICE | Intrusion Countermeasures Electronics - corp defenses |
| Icebreaker | Runner programs that bypass ICE |
| Agenda | Corp victory points, stolen by runners |
| Influence | Faction control over territories (0-100%) |
| Credits | Universal currency |
| Clicks/Actions | Action points per turn |

## Agent Guidelines

### Delegation

- Use `gpt-5-deployer` for grunt work with clear review criteria
- Parallelize independent tasks via multiple `bd create` items
- Design pillars must be preserved; implementation details are flexible

### Searching for Solutions

- Check `exa` and `ref` MCP tools for current framework docs
- Prefer battle-tested libraries over custom implementations
- Web-first: every choice must work in browser

### When to Stop and Ask

- Architectural decisions affecting multiple packages
- API contracts between client/server
- Database schema changes
- Anything that "feels wrong" - trust your instincts

### Human Escalation

Create `linctl` ticket for:
- External accounts/API keys needed
- Infrastructure provisioning
- Design decisions requiring product input
- Blockers that can't be resolved autonomously
