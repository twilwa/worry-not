## ADDED Requirements

### Requirement: React Application Shell

The system SHALL provide a React 19 application with PixiJS canvas integration for game rendering.

#### Scenario: Application bootstrap

- **WHEN** user navigates to application URL
- **THEN** React application mounts and PixiJS canvas initializes

#### Scenario: Hot module replacement

- **WHEN** source code changes during development
- **THEN** application updates without full page reload

### Requirement: WebSocket Client

The system SHALL maintain WebSocket connection to game server with automatic reconnection.

#### Scenario: Initial connection

- **WHEN** application loads
- **THEN** WebSocket connects to server within 1 second

#### Scenario: Reconnection on disconnect

- **WHEN** WebSocket connection drops
- **THEN** client attempts reconnection with exponential backoff

#### Scenario: Message handling

- **WHEN** server sends message
- **THEN** client deserializes and dispatches to appropriate handler

### Requirement: Game State Store

The system SHALL maintain client-side game state synchronized with server authoritative state.

#### Scenario: State initialization

- **WHEN** client receives initial STATE_DELTA
- **THEN** local game state is populated with territories, factions, and hands

#### Scenario: State update

- **WHEN** client receives subsequent STATE_DELTA
- **THEN** local state merges changes without full replacement

#### Scenario: Optimistic updates

- **WHEN** player performs action
- **THEN** UI reflects expected change immediately before server confirmation

### Requirement: Card Rendering

The system SHALL render player's hand and played cards using PixiJS sprites.

#### Scenario: Hand display

- **WHEN** player has cards in hand
- **THEN** cards render in a horizontal row at bottom of screen

#### Scenario: Card interaction

- **WHEN** player clicks/taps a card in hand
- **THEN** card highlights and available targets are shown

#### Scenario: Card play animation

- **WHEN** card is played
- **THEN** card animates from hand to play area
