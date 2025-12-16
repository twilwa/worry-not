## ADDED Requirements

### Requirement: HTTP Server

The system SHALL provide an HTTP server using Hono framework with a health check endpoint.

#### Scenario: Health check response

- **WHEN** GET /health is called
- **THEN** server responds with 200 OK and JSON body { status: "ok" }

#### Scenario: Server startup

- **WHEN** server starts
- **THEN** it listens on configured port (default 3000)

### Requirement: WebSocket Support

The system SHALL support WebSocket connections for real-time game communication.

#### Scenario: Connection upgrade

- **WHEN** client sends WebSocket upgrade request
- **THEN** server upgrades connection and assigns session ID

#### Scenario: Message routing

- **WHEN** client sends JSON message with type field
- **THEN** server routes to appropriate handler based on type

#### Scenario: Connection cleanup

- **WHEN** WebSocket connection closes
- **THEN** server removes player from game session and notifies other players

### Requirement: Authoritative Game State

The system SHALL maintain authoritative game state on server, validating all client actions before applying.

#### Scenario: Invalid action rejection

- **WHEN** client sends action that violates game rules
- **THEN** server responds with ACTION_REJECTED and does not modify state

#### Scenario: State broadcast

- **WHEN** valid action modifies game state
- **THEN** server broadcasts STATE_DELTA to all connected players in game

#### Scenario: Turn validation

- **WHEN** player attempts action during opponent's turn
- **THEN** server rejects with "Not your turn" reason

### Requirement: Game Session Management

The system SHALL manage game sessions allowing 2 players to join and play.

#### Scenario: Create game

- **WHEN** first player connects with JOIN_GAME
- **THEN** new game session is created and player assigned Corp role

#### Scenario: Join existing game

- **WHEN** second player connects with JOIN_GAME and game ID
- **THEN** player joins as Runner and game begins

#### Scenario: Game full rejection

- **WHEN** third player attempts to join 2-player game
- **THEN** server rejects with "Game full" reason
