## ADDED Requirements

### Requirement: Game State Types

The system SHALL define TypeScript types for all game state entities including Territory, Faction, Card, and Player.

#### Scenario: Territory type definition

- **WHEN** a Territory object is created
- **THEN** it includes id, name, type, securityLevel (1-5), resourceValue (1-5), stabilityIndex (0-100), and corporateInfluence (0-100)

#### Scenario: Faction type definition

- **WHEN** a Faction object is created
- **THEN** it includes id, type (CORP or RUNNER), resources, and victoryPoints

#### Scenario: Card type definition

- **WHEN** a Card object is created
- **THEN** it includes id, name, type (OVERWORLD or SCENARIO), faction, cost, and components array

### Requirement: WebSocket Message Protocol

The system SHALL define discriminated union types for WebSocket messages with explicit type field discriminators.

#### Scenario: Client message types

- **WHEN** client sends a message
- **THEN** message type is one of: PLAY_CARD, END_TURN, TRIGGER_SCENARIO, JOIN_GAME, LEAVE_GAME

#### Scenario: Server message types

- **WHEN** server broadcasts a message
- **THEN** message type is one of: STATE_DELTA, ACTION_REJECTED, SCENARIO_STARTED, SCENARIO_ENDED, GAME_OVER

#### Scenario: Type narrowing

- **WHEN** code switches on message.type
- **THEN** TypeScript narrows payload type correctly for each case

### Requirement: Card Component Types

The system SHALL define types for card components with explicit execution context and result types.

#### Scenario: Component interface

- **WHEN** a component is executed
- **THEN** it receives ExecutionContext with gameState, source card, targets, and optional user input

#### Scenario: Component result

- **WHEN** a component executes successfully
- **THEN** it returns ComponentResult with stateChanges array and optional pauseReason

#### Scenario: Component type enumeration

- **WHEN** a component is defined
- **THEN** its type is one of: CREDIT_COST, ACTION_COST, TRASH_COST, SELF_TARGET, SINGLE_TARGET, MULTI_TARGET, DEAL_DAMAGE, GAIN_CREDITS, DRAW_CARDS, INSTALL_CARD
