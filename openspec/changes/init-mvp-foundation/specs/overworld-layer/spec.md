## ADDED Requirements

### Requirement: Turn Structure

The Overworld layer SHALL operate in turns with three phases: Upkeep, Action, and Resolution.

#### Scenario: Upkeep phase

- **WHEN** player's turn begins
- **THEN** resources are gained based on controlled territories

#### Scenario: Action phase

- **WHEN** player has actions remaining
- **THEN** player may play Overworld cards or pass

#### Scenario: Resolution phase

- **WHEN** player ends turn or exhausts actions
- **THEN** pending effects resolve and turn passes to opponent

### Requirement: Resource Generation

Players SHALL gain credits based on territories they control during Upkeep.

#### Scenario: Corp resource gain

- **WHEN** Corp controls territory with resourceValue 3
- **THEN** Corp gains 3 credits during upkeep

#### Scenario: Runner resource gain

- **WHEN** Runner influences territory below 40% corp control
- **THEN** Runner gains credits equal to resourceValue

#### Scenario: Multiple territory bonus

- **WHEN** player controls multiple adjacent territories
- **THEN** total resources are sum of individual values (no bonus for MVP)

### Requirement: Influence Placement

Corps SHALL be able to place influence on territories via card play.

#### Scenario: Place influence action

- **WHEN** Corp plays influence card targeting territory
- **THEN** corporateInfluence increases by card value

#### Scenario: Contested territory

- **WHEN** Runner plays disruption card on Corp territory
- **THEN** corporateInfluence decreases by card value

#### Scenario: Control flip

- **WHEN** influence crosses 60% threshold
- **THEN** control status updates and resource generation changes

### Requirement: Scenario Trigger

Runners SHALL be able to trigger Scenario missions from the Overworld.

#### Scenario: Initiate run

- **WHEN** Runner plays "Run" card targeting Corp-controlled territory
- **THEN** game transitions to Scenario layer with that territory's parameters

#### Scenario: Run prerequisites

- **WHEN** Runner attempts run without required resources
- **THEN** action is rejected with reason
