## ADDED Requirements

### Requirement: Scenario State Machine

The Scenario layer SHALL operate as a state machine: Setup, Action, Resolution.

#### Scenario: Setup phase

- **WHEN** scenario is triggered from Overworld
- **THEN** scenario parameters are set from territory state (security level, installed ICE)

#### Scenario: Action phase

- **WHEN** Runner has actions
- **THEN** Runner may play Scenario cards, advance, or jack out

#### Scenario: Resolution phase

- **WHEN** Runner reaches objective or is defeated
- **THEN** scenario outcome is determined and control returns to Overworld

### Requirement: ICE Encounters

Corp defenses (ICE) SHALL challenge the Runner during scenarios based on territory installations.

#### Scenario: ICE reveal

- **WHEN** Runner advances past ICE position
- **THEN** ICE is revealed and subroutines fire

#### Scenario: Icebreaker interaction

- **WHEN** Runner has appropriate icebreaker installed
- **THEN** Runner may spend credits to break ICE subroutines

#### Scenario: Unbroken ICE effect

- **WHEN** ICE subroutine is not broken
- **THEN** ICE effect applies (damage, end run, etc.)

### Requirement: Scenario Objectives

Scenarios SHALL have objectives that determine success or failure.

#### Scenario: Access objective

- **WHEN** Runner reaches server without being stopped
- **THEN** Runner accesses cards and may steal agendas

#### Scenario: Jack out

- **WHEN** Runner chooses to jack out before objective
- **THEN** run ends with no access (neither success nor defeat)

#### Scenario: Defeat condition

- **WHEN** Runner takes lethal damage during run
- **THEN** run ends in defeat with penalties

### Requirement: Scenario Parameters from Overworld

Territory state SHALL determine scenario difficulty and composition.

#### Scenario: Security level affects ICE strength

- **WHEN** territory has securityLevel 4
- **THEN** ICE in scenario has +2 strength modifier

#### Scenario: Stability affects encounter count

- **WHEN** territory has stabilityIndex < 50
- **THEN** fewer ICE are present in scenario

### Requirement: Scenario Outcome to Overworld

Scenario results SHALL immediately affect Overworld state.

#### Scenario: Successful run influence shift

- **WHEN** Runner succeeds in scenario
- **THEN** territory corporateInfluence decreases by 10

#### Scenario: Corp security response

- **WHEN** Runner is defeated in scenario
- **THEN** territory securityLevel increases by 1

#### Scenario: Agenda stolen

- **WHEN** Runner steals agenda during successful run
- **THEN** Runner gains agenda points and Corp loses potential score
