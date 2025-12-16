# End of Line

A multiplayer roguelike deckbuilder with asymmetric Corp vs Runner gameplay. Strategic hex-based Overworld meets tactical card-based Scenarios in this web-first, mobile-friendly experience.

## Architecture

This is a Turborepo monorepo with pnpm workspaces containing four packages:

```
packages/
├── client/          # React 19 + PixiJS 8 frontend
├── server/          # Hono backend with WebSocket support
├── shared/          # Shared game logic, types, and card definitions
└── db/              # PostgreSQL with Drizzle ORM
```

## Tech Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Frontend | React + PixiJS | 19.x + 8.x |
| Backend | Node.js + Hono | 20+ + 4.x |
| Database | PostgreSQL + Drizzle ORM | Latest |
| Build | Vite + Turborepo | 6.x + 2.x |
| Testing | Vitest + Playwright | 2.x |
| Quality | Biome + Trunk | Latest |

## Quick Start

### Prerequisites

- Node.js >= 20.0.0
- pnpm >= 9.0.0
- PostgreSQL (for database features)

### Installation

```bash
pnpm install
```

### Development

```bash
# Start all packages in dev mode
pnpm dev

# Start specific package
pnpm dev --filter client
pnpm dev --filter server
```

### Building

```bash
# Build all packages
pnpm build

# Build specific package
pnpm build --filter shared
```

### Testing

```bash
# Run all tests
pnpm test

# Run only unit tests
pnpm test:unit

# Run with coverage
pnpm test:coverage

# Run E2E tests (when implemented)
pnpm test:e2e
```

### Code Quality

```bash
# Lint code
pnpm lint

# Format code
pnpm format

# Type check
pnpm typecheck

# Full quality check with Trunk
trunk check
```

### Database

```bash
# Generate migrations
pnpm db:generate

# Run migrations
pnpm db:migrate

# Open Drizzle Studio
pnpm db:studio
```

## Package Details

### @end-of-line/shared

Core game logic and type definitions. Other packages depend on this.

**Key exports:**
- Game state types
- Card component system
- Validation utilities

### @end-of-line/client

React frontend with PixiJS canvas for game rendering.

**Performance targets:**
- Initial payload: <5MB
- Time to interactive: <3s
- Frame rate: 30+ FPS on mid-range mobile
- Memory: <150MB on mobile

### @end-of-line/server

Hono-based HTTP + WebSocket server with authoritative game state.

**Features:**
- RESTful API for game metadata
- WebSocket for real-time gameplay
- Server-side state validation

### @end-of-line/db

Database schema and migrations using Drizzle ORM.

**Tables (planned):**
- Users and authentication
- Game sessions
- Territory state
- Card collections

## Project Structure

```
.
├── packages/
│   ├── client/
│   │   ├── src/
│   │   │   ├── main.tsx          # Entry point
│   │   │   └── App.tsx            # Main component
│   │   ├── index.html
│   │   ├── vite.config.ts
│   │   └── package.json
│   ├── server/
│   │   ├── src/
│   │   │   └── index.ts           # Server entry
│   │   └── package.json
│   ├── shared/
│   │   ├── src/
│   │   │   └── index.ts           # Shared exports
│   │   └── package.json
│   └── db/
│       ├── src/
│       │   ├── schema/            # Drizzle schemas
│       │   └── index.ts
│       ├── drizzle.config.ts
│       └── package.json
├── turbo.json                     # Turborepo config
├── pnpm-workspace.yaml            # pnpm workspaces
├── biome.json                     # Linter/formatter config
├── tsconfig.json                  # Root TypeScript config
└── package.json                   # Root package

```

## Development Workflow

### Adding Dependencies

```bash
# Add to specific package
pnpm add <package> --filter @end-of-line/client

# Add to root (dev dependencies)
pnpm add -D <package> -w
```

### Creating New Features

1. Check `bd ready` for available tasks
2. Read relevant design docs in `netrunner-levelsio/`
3. Write failing tests first (TDD)
4. Implement minimal code to pass
5. Run `trunk check --fix` before committing
6. Close task with `bd close <id>`

### Git Workflow

This project uses GitButler. Check for `gitbutler/workspace` branch before performing git operations.

## Configuration

### TypeScript

All packages use strict mode:
- `strict: true`
- `noUncheckedIndexedAccess: true`

### Biome

Consistent formatting across all packages:
- 2 space indentation
- Single quotes
- 100 character line width
- ES5 trailing commas

### Turborepo

Build pipeline automatically handles dependencies. Packages build in correct order based on workspace references.

## Performance Budgets

| Metric | Target | Notes |
|--------|--------|-------|
| Initial payload | <5MB | Including all chunks |
| Time to interactive | <3s | On 4G connection |
| WebSocket latency | <200ms | Perceived user latency |
| Frame rate | 30+ FPS | On mid-range mobile |
| Memory usage | <150MB | Mobile devices |

## Testing Strategy

- **Unit tests:** Vitest for all packages
- **Integration tests:** Testing package interactions
- **E2E tests:** Playwright (coming soon)
- **Coverage target:** TBD

## Documentation

- [Project Spec](/openspec/project.md) - High-level architecture
- [CLAUDE.md](/CLAUDE.md) - Development guidelines
- [Design Docs](/netrunner-levelsio/) - Game design reference

## License

See [LICENSE](LICENSE) for details.
