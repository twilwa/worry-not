## ADDED Requirements

### Requirement: Hex Grid Data Structure

The system SHALL represent the game map as a 3x3 hexagonal grid with axial coordinates.

#### Scenario: Grid initialization

- **WHEN** game starts
- **THEN** 9 territory hexes are created with unique IDs and positions

#### Scenario: Adjacent territory lookup

- **WHEN** querying neighbors of center hex
- **THEN** all 6 adjacent hexes are returned

#### Scenario: Edge hex neighbors

- **WHEN** querying neighbors of corner hex
- **THEN** only valid adjacent hexes are returned (3 for corners)

### Requirement: Territory Attributes

Each territory SHALL have attributes: securityLevel (1-5), resourceValue (1-5), stabilityIndex (0-100), and corporateInfluence (0-100).

#### Scenario: Default territory state

- **WHEN** territory is created
- **THEN** securityLevel=1, resourceValue=3, stabilityIndex=100, corporateInfluence=50

#### Scenario: Attribute modification

- **WHEN** game action modifies territory
- **THEN** attributes update within valid ranges (clamped)

#### Scenario: Control threshold

- **WHEN** corporateInfluence >= 60
- **THEN** territory is considered Corp-controlled

### Requirement: Hex Grid Renderer

The system SHALL render hex grid using PixiJS with territory state visualization.

#### Scenario: Grid rendering

- **WHEN** PixiJS stage initializes
- **THEN** 3x3 hex grid renders with proper spacing

#### Scenario: Territory color coding

- **WHEN** territory influence changes
- **THEN** hex fill color interpolates between Runner (red) and Corp (blue)

#### Scenario: Click detection

- **WHEN** user clicks on hex
- **THEN** correct territory ID is identified via point-in-polygon test

### Requirement: Territory Selection

The system SHALL allow players to select territories for actions.

#### Scenario: Selection highlight

- **WHEN** territory is selected
- **THEN** hex border highlights and info panel updates

#### Scenario: Valid target filtering

- **WHEN** player initiates action requiring territory target
- **THEN** only valid territories are clickable/highlighted
