# End of Line - Hackathon Development Timeline

## Project Overview

This document outlines a condensed development plan for creating a simplified but functional version of "End of Line" within a one-week hackathon timeframe. The focus will be on implementing core gameplay loops and essential systems while leveraging pre-configured tools and technologies.

### Available Tools & Technologies

- **SpacetimeDB**: For multiplayer and state synchronization
- **Godot with Plugins**:
  - Card 3D: 3D card visualization
  - Card-Framework: Card game mechanics
  - Card Parallax: Visual card effects
  - Dialogic: Narrative and dialogue system
  - Gaea: Procedural generation
  - HugoEnzo/HexGrid: Hex-based territory system
  - GUT: Godot Unit Testing
  - LimboAI: AI behavior systems
  - Phantom Camera: Advanced camera control
- **Blender**: Asset creation and modification
- **Imagen 3.0**: AI asset generation for import to Blender
- **TypeScript**: For SpacetimeDB SDK integration

### Scope Limitations

For the hackathon version, we'll focus on:
1. One Corporation faction (Weyland) and one Runner faction (Criminal)
2. Simplified territory control with 9 territories (3x3 hex grid)
3. Limited card pool (20-30 cards per faction)
4. Basic mission gameplay with simplified server structures
5. Core gameplay loops without full progression systems
6. Minimal but functional UI
7. Test-driven development focusing on critical paths

---

## Day 1: Core Systems and Architecture

### Morning (9 AM - 12 PM)
- **Project Setup & Planning (1 hour)**
  - Initialize Godot project with required plugins
  - Set up SpacetimeDB module structure
  - Configure TypeScript environment
  - Define git workflow and branching strategy

- **Core Architecture Implementation (2 hours)**
  - Set up Entity-Component System foundation
  - Implement basic event bus
  - Create service layer framework
  - Establish SpacetimeDB connection handling

### Afternoon (1 PM - 6 PM)
- **Card System Implementation (3 hours)**
  - Leverage Card-Framework plugin
  - Define card data structures in SpacetimeDB
  - Implement card serialization/deserialization
  - Create basic card visualization with Card 3D
  - Set up card interaction framework

- **Initial Testing (2 hours)**
  - Write unit tests with GUT for card system
  - Test SpacetimeDB integration
  - Run initial test suite
  - Fix critical path issues

### Evening (7 PM - 10 PM)
- **Territory Control System (3 hours)**
  - Implement HexGrid for territory representation
  - Define territory data structures
  - Create basic territory visualization
  - Set up territory control mechanics
  - Connect territory and card systems

---

## Day 2: Gameplay Systems and Asset Creation

### Morning (9 AM - 12 PM)
- **Asset Generation Pipeline (2 hours)**
  - Configure Imagen 3.0 for asset generation
  - Create asset templates for cards and territories
  - Generate initial card art and icons
  - Import and organize assets in Godot

- **Basic UI Implementation (1 hour)**
  - Design and implement hand area
  - Create resource counters
  - Implement territory info display
  - Set up action buttons

### Afternoon (1 PM - 6 PM)
- **Mission Gameplay System (3 hours)**
  - Implement server structure representation
  - Create ICE and breaker interaction mechanics
  - Set up run initiation and resolution
  - Define success/failure conditions
  - Implement basic mission rewards

- **AI Implementation with LimboAI (2 hours)**
  - Create basic Corporation AI behaviors
  - Implement server defense logic
  - Set up dynamic ICE response
  - Create simple decision trees for AI actions

### Evening (7 PM - 10 PM)
- **Multiplayer Foundation (3 hours)**
  - Set up player session management
  - Implement game state synchronization
  - Create player action queueing
  - Test basic multiplayer functionality
  - Fix critical networking issues

---

## Day 3: Content Creation and Testing

### Morning (9 AM - 12 PM)
- **Card Content Creation (3 hours)**
  - Design and implement 10 Corporation cards
  - Design and implement 10 Runner cards
  - Balance and test card interactions
  - Create card effect visualizations

### Afternoon (1 PM - 6 PM)
- **Territory Content and Procedural Generation (2 hours)**
  - Use Gaea for procedural territory generation
  - Create 3 territory types with distinct visuals
  - Implement territory attributes and effects
  - Set up territory connection rules

- **Mission Content Creation (3 hours)**
  - Design 3 server templates
  - Create ICE variety and behaviors
  - Implement mission objectives
  - Design reward structures

### Evening (7 PM - 10 PM)
- **Extensive Testing Session (3 hours)**
  - Run full test suite with GUT
  - Test all implemented card interactions
  - Verify territory control mechanics
  - Test mission gameplay flow
  - Fix critical bugs and issues

---

## Day 4: Game Loop Integration and Polish

### Morning (9 AM - 12 PM)
- **Game Loop Integration (3 hours)**
  - Connect strategic and tactical layers
  - Implement territory-to-mission transitions
  - Create mission outcome effects on territory
  - Set up resource flow between systems

### Afternoon (1 PM - 6 PM)
- **UI Polish and Camera Control (2 hours)**
  - Use Phantom Camera for smooth transitions
  - Polish card interactions and effects
  - Implement Card Parallax effects
  - Refine resource visualizations

- **Basic Narrative Integration (2 hours)**
  - Use Dialogic for mission briefings
  - Create faction-specific dialogue
  - Implement narrative events tied to territory control
  - Design simple tutorial dialogues

### Evening (7 PM - 10 PM)
- **Playtesting and Balance (3 hours)**
  - Conduct internal playtesting sessions
  - Balance card costs and effects
  - Adjust territory control mechanics
  - Fine-tune mission difficulty
  - Implement balance fixes

---

## Day 5: Final Features and Polish

### Morning (9 AM - 12 PM)
- **Additional Content Implementation (3 hours)**
  - Add 10 more cards per faction
  - Implement 2 additional server templates
  - Create special territory effects
  - Add unique faction abilities

### Afternoon (1 PM - 6 PM)
- **Visual and Audio Polish (3 hours)**
  - Add card activation effects
  - Implement territory control visualizations
  - Create basic sound effects for actions
  - Add ambient music for different game states

- **Performance Optimization (2 hours)**
  - Profile and optimize rendering
  - Improve network synchronization
  - Reduce memory usage
  - Optimize asset loading

### Evening (7 PM - 10 PM)
- **Final Testing and Bug Fixing (3 hours)**
  - Run comprehensive test suite
  - Test all game systems end-to-end
  - Fix remaining critical bugs
  - Document known issues

---

## Day 6: Demo Preparation and Documentation

### Morning (9 AM - 12 PM)
- **Create Tutorial Experience (3 hours)**
  - Design step-by-step tutorial flow
  - Implement guided first game
  - Create tutorial prompts and tooltips
  - Test tutorial effectiveness

### Afternoon (1 PM - 6 PM)
- **Documentation (2 hours)**
  - Document code and systems
  - Create user guide
  - Prepare technical documentation
  - Design demo presentation materials

- **Final Playtesting (3 hours)**
  - Conduct external playtest session
  - Gather feedback on gameplay
  - Identify last-minute issues
  - Implement critical fixes

### Evening (7 PM - 10 PM)
- **Build Creation and Deployment (3 hours)**
  - Create final builds
  - Deploy to testing environment
  - Test deployment functionality
  - Prepare demonstration environment

---

## Development Focus Areas

### Core Gameplay Implementation
- **Card System**: Leverage Card-Framework for basic mechanics
- **Territory Control**: Use HexGrid for simplified territory representation
- **Mission Gameplay**: Focus on ICE/breaker interactions and server access

### Testing Priority
- Card interaction mechanics
- Territory control calculations
- SpacetimeDB state synchronization
- Mission success/failure resolution

### Asset Creation Strategy
- Use Imagen 3.0 to generate base assets quickly
- Focus on minimally viable but cohesive aesthetic
- Create template assets for repetitive elements

### Technical Implementation Approach
- Test-driven development for critical game systems
- Continuous integration with GUT
- Regular testing cycles throughout development
- Focus on robust core rather than feature breadth

---

## Minimal Viable Product Features

### Overworld (Strategic Layer)
- 3x3 hex grid of territories
- Basic territory control mechanics
- Resource generation from territories
- Card play for territory effects
- Turn-based strategic gameplay

### Instanced Missions (Tactical Layer)
- Server access gameplay
- ICE and breaker interactions
- Basic mission objectives (data theft)
- Success/failure conditions
- Mission rewards affecting overworld

### Card Systems
- 20-30 cards per faction
- Basic deck building
- Hand management
- Card costs and effects
- Faction-specific card abilities

### Factions
- Weyland Corporation: Resource focus, barriers, advancement
- Criminal Runner: Economy, bypass, evasion

### Multiplayer
- Basic two-player functionality
- State synchronization via SpacetimeDB
- Turn-based play with action validation
- Player session management

---

## Post-Hackathon Roadmap

### Immediate Features for Future Development
1. Additional factions (Anarch, Shaper, NBN, Jinteki, Haas-Bioroid)
2. Expanded territory grid (24 territories)
3. Full card set for all factions
4. Complete progression system
5. Enhanced AI for solo play
6. Runner party system for multiplayer missions

### Technical Debt to Address
1. Comprehensive test coverage
2. Performance optimization for larger maps
3. Enhanced error handling and recovery
4. Client prediction refinement
5. Asset optimization

### Community and Content Plans
1. Card editor for community creations
2. Tournament and competitive features
3. Regular content updates
4. Community feedback integration
5. Expanded narrative content
