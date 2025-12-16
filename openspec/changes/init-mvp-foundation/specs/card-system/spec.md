## ADDED Requirements

### Requirement: Component Execution Pipeline

The system SHALL execute card components in a fixed sequence: Cost, Target, Control, Effect, Conditional, Info.

#### Scenario: Cost components execute first

- **WHEN** a card with CreditCost and DealDamage is played
- **THEN** CreditCost executes before DealDamage

#### Scenario: Failed cost aborts execution

- **WHEN** a Cost component fails (insufficient resources)
- **THEN** subsequent components do not execute and card play is rejected

#### Scenario: Targeting happens before effects

- **WHEN** a card with SingleTarget and DealDamage is played
- **THEN** target is selected before damage is applied

### Requirement: Stateless Components

Card components SHALL be stateless, receiving all necessary context via ExecutionContext and returning changes via ComponentResult.

#### Scenario: No side effects

- **WHEN** a component is executed
- **THEN** it does not modify game state directly; all changes are in the returned result

#### Scenario: Deterministic execution

- **WHEN** the same component executes with identical context
- **THEN** it produces identical results

### Requirement: Basic Cost Components

The system SHALL implement CreditCost and ActionCost components for MVP.

#### Scenario: CreditCost deducts credits

- **WHEN** a card with CreditCost(3) is played by player with 5 credits
- **THEN** player credits become 2 after resolution

#### Scenario: CreditCost fails on insufficient funds

- **WHEN** a card with CreditCost(5) is played by player with 3 credits
- **THEN** component returns failure result

### Requirement: Basic Effect Components

The system SHALL implement GainCredits, DealDamage, and InstallCard components for MVP.

#### Scenario: GainCredits adds credits

- **WHEN** GainCredits(4) executes for player with 2 credits
- **THEN** player credits become 6

#### Scenario: DealDamage reduces target health

- **WHEN** DealDamage(2) executes targeting entity with 5 health
- **THEN** entity health becomes 3

#### Scenario: InstallCard places card

- **WHEN** InstallCard executes with valid card in hand
- **THEN** card moves from hand to installed area
