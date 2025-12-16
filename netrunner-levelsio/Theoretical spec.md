## End of Line: Technical Specification Document

**Version:** 1.0  
**Date:** 2024-08-16  
**Document Status:** Ready for Prototype Implementation

### 1. Overview

This document provides the technical specifications for the development of "End of Line," a browser-based, multiplayer PvPvE roguelike deckbuilder with asymmetric factions and dual-layer gameplay (Strategic Overworld and Tactical Scenario Missions). It details functional and non-functional requirements, system architecture, data models, core module implementations, error handling, and testing strategies necessary for a development team to begin implementation, focusing initially on the Minimum Viable Prototype (MVP).

### 2. Requirements

#### 2.1 Functional Requirements

- **FR-001:** The system must allow users to play the game within a standard modern web browser (Chrome, Firefox, Safari, Edge) without requiring native installation.
    
- **FR-002:** The system must support multiplayer gameplay, allowing multiple players (representing different Corporation and Runner factions) to interact within the same game instance.
    
- **FR-003:** The system must implement two distinct, asymmetric faction types: Corporations (strategic focus) and Runners (tactical focus), each with unique mechanics and objectives. (MVP: 1 Corp, 1 Runner faction).
    
- **FR-004:** The system must render and manage a strategic Overworld layer represented by a hexagonal grid map of CyberCity.
    
- **FR-005:** Players must be able to interact with the Overworld map by playing Overworld-specific cards targeting territories.
    
- **FR-006:** Territories on the Overworld map must possess defined attributes (e.g., Type, Security Level, Resource Value, Stability, Controlling Influence %) that affect gameplay.
    
- **FR-007:** The system must calculate and display faction influence over territories based on player actions and deployed assets/networks.
    
- **FR-008:** The system must generate resources for factions based on their control/influence over territories on the Overworld map.
    
- **FR-009:** The system must allow specific Overworld actions or states to trigger instanced Tactical Scenario Missions.
    
- **FR-010:** The system must render and manage Tactical Scenario Missions within a distinct view (e.g., isometric or top-down view of the mission area).
    
- **FR-011:** Players (primarily Runners) must be able to interact within Scenario Missions by playing Scenario-specific cards from their hand.
    
- **FR-012:** Scenario Missions must include objectives (e.g., reach point, steal item, survive timer) determined by the triggering Overworld state.
    
- **FR-013:** Scenario Missions must feature obstacles/challenges (e.g., ICE, AI guards, traps) derived from the Overworld state (e.g., Corp installations in the territory).
    
- **FR-014:** The outcome (Success/Failure) of a Scenario Mission must demonstrably affect the state of the Overworld map (e.g., change influence, damage assets, grant resources).
    
- **FR-015:** The system must implement two distinct card systems (Overworld cards, Scenario cards) with corresponding deckbuilding rules. (MVP: Small, fixed decks).
    
- **FR-016:** The system must provide a mechanism for players to acquire new cards for both deck types, potentially influenced by Overworld state. (MVP: Simple reward mechanism).
    
- **FR-017:** The system must implement basic PvE elements, including AI-controlled defenses/obstacles in Scenarios and potentially neutral Overworld events/entities.
    
- **FR-018:** The system must track player/faction progression persistently across game sessions/runs (e.g., unlocked cards, faction abilities). (MVP: Minimal persistence, e.g., tracking wins/losses).
    
- **FR-019:** The game state must be synchronized between all players in a game instance in near real-time, especially during Tactical Scenarios.
    

#### 2.2 Non-Functional Requirements

- **NFR-001 (Performance):** Overworld actions and state updates should resolve within 500ms. Tactical Scenario actions and state updates should synchronize with less than 200ms latency under typical network conditions.
    
- **NFR-002 (Scalability):** The server architecture must support [Specify Target, e.g., 100] concurrent game instances with up to [Specify Target, e.g., 4] players each for the initial launch.
    
- **NFR-003 (Usability):** The User Interface (UI) must be intuitive for players familiar with deckbuilding and strategy games. Core gameplay information must be clearly presented.
    
- **NFR-004 (Compatibility):** The game must function correctly on the latest versions of major desktop web browsers (Chrome, Firefox, Safari, Edge). Mobile browser support is a secondary goal.
    
- **NFR-005 (Reliability):** The system should handle common network interruptions gracefully (e.g., short disconnects) allowing players to reconnect where possible. Server uptime target: 99.5%.
    
- **NFR-006 (Security):** All player actions must be validated server-side to prevent cheating. Communication between client and server should be secured (HTTPS/WSS).
    
- **NFR-007 (Maintainability):** Code must follow established coding standards (e.g., ESLint rules for TypeScript), be well-documented, and utilize a modular design to facilitate updates and bug fixes.
    

### 3. System Architecture

#### 3.1 Overall Architecture: Client-Server

- **Client:** Browser-based application responsible for rendering the game state, handling user input, and communicating with the server. Client-side prediction will be used for responsive tactical gameplay.
    
- **Server:** Authoritative backend responsible for managing game state, validating player actions, executing game logic, managing persistence, and synchronizing state across clients.
    

#### 3.2 Technology Stack

- **Game Engine (Client):** Godot Engine (using GodotJS export for web). Responsible for rendering, physics (if needed), animation, input handling, scene management.
    
- **Asset Creation:** Blender for 3D models and animations. Standard 2D art tools for UI and card art.
    
- **Client-Side Scripting:** TypeScript. Leverages Godot's GDScript bindings via GodotJS or direct TypeScript integration where possible. Provides strong typing and better code organization.
    
- **Server / State Management:** SpacetimeDB. Provides real-time database synchronization, server-side logic execution (reducers), authentication, and persistence capabilities well-suited for complex, real-time multiplayer state.
    
- **Networking:** WebSockets (managed primarily via SpacetimeDB connection) for real-time communication. HTTPS for initial asset loading and API calls if needed outside SpacetimeDB.
    

#### 3.3 Key Modules (Conceptual)

1. **Game State Manager (Server - SpacetimeDB):** Core module holding the authoritative game state (Territories, Factions, Player Data, Card States, Turn Info). Executes state changes via reducers.
    
2. **Overworld Manager (Server Logic / Client View):**
    
    - Server: Handles Overworld turn progression, resource calculation, influence updates, Overworld card effect execution, Scenario trigger logic.
        
    - Client: Renders the hex map, displays territory info, handles Overworld input.
        
3. **Scenario Manager (Server Logic / Client View):**
    
    - Server: Manages active Scenario instances, handles Scenario turn progression, executes Scenario card effects, resolves objectives, calculates outcomes, applies outcomes back to Overworld state.
        
    - Client: Renders the Scenario view, handles Scenario input, displays tactical card play.
        
4. **Card Manager (Server Logic / Client Data):**
    
    - Server: Defines card data, validates card plays, manages deck/hand states, handles market logic.
        
    - Client: Displays cards, handles card interactions in UI.
        
5. **Faction Manager (Server Logic / Client Data):**
    
    - Server: Defines faction-specific abilities, tracks faction progression, manages faction resources.
        
    - Client: Displays faction-specific UI elements and information.
        
6. **Network Manager (Client/Server - SpacetimeDB Interface):** Handles communication, state synchronization, connection management, client prediction logic (Client), and server-side validation (Server).
    
7. **Persistence Manager (Server - SpacetimeDB):** Handles saving/loading game states and persistent player progression data.
    
8. **AI Manager (Server Logic):** Controls PvE elements (neutral forces, automated defenses, potentially AI opponents).
    

#### 3.4 Real-time vs. Asynchronous Operations

- **Real-time (via SpacetimeDB sync):** Tactical Scenario state (player positions, card plays, health/resource changes), immediate Overworld notifications (e.g., territory contested).
    
- **Asynchronous / Turn-Based:** Overworld turn progression, resource collection, application of strategic Overworld card effects, potentially market refreshes.
    

### 4. Data Management

#### 4.1 Data Models (Simplified Examples - SpacetimeDB Table Structures)

```
// SpacetimeDB Table Definitions (Conceptual)

@table({ name: "GameState" })
export class GameState {
    @primaryKey // Assuming single game instance for simplicity in MVP
    gameId: string;
    turnNumber: number;
    activeFactionId: string; // Faction whose turn it is
    currentPhase: "OVERWORLD_UPKEEP" | "OVERWORLD_ACTION" | "SCENARIO_ACTIVE" | "CLEANUP";
}

@table({ name: "Territory" })
export class Territory {
    @primaryKey
    id: string; // e.g., "downtown", "industrial_zone"
    name: string;
    type: "CORPORATE" | "FRINGE" | "UNDERGROUND";
    securityLevel: number; // 1-5
    resourceValue: number; // 1-5
    stabilityIndex: number; // 0-100
    corporateInfluence: number; // 0-100 (Runner influence is 100 - corporateInfluence)
    adjacentTerritoryIds: string[];
    // Foreign keys to installations/assets present
}

@table({ name: "Installation" }) // Represents assets, infrastructure, networks on territories
export class Installation {
    @primaryKey
    id: string;
    @unique // Link back to the territory
    territoryId: string;
    owningFactionId: string;
    cardSourceId: string; // The card that created this installation
    type: "INFRASTRUCTURE" | "ASSET" | "NETWORK" | "ICE" | "TRAP"; // Simplified
    status: "ACTIVE" | "DAMAGED" | "DISABLED";
    // Store effects or link to card definition for effects
}

@table({ name: "Faction" })
export class Faction {
    @primaryKey
    id: string; // e.g., "weyland", "anarch"
    playerId: string; // Link to the controlling player session/account
    type: "CORPORATION" | "RUNNER";
    resources: { [key: string]: number }; // e.g., { credits: 10, data: 2 }
    victoryPoints: number; // Simplified VP tracking
    // Links to decks, progression data etc.
}

@table({ name: "CardDefinition" }) // Static card data
export class CardDefinition {
    @primaryKey
    id: string; // e.g., "fortified_infrastructure", "smash_and_grab"
    name: string;
    type: "OVERWORLD" | "SCENARIO";
    subType: string; // e.g., "Infrastructure", "Event", "Program", "ICE"
    faction: string; // Faction restriction
    cost: number;
    effectDefinition: any; // Store effect logic details (e.g., JSON defining effect type, target, value)
    // Flavor text, art links etc.
}

@table({ name: "PlayerCard" }) // Represents cards owned by players in decks/hands
export class PlayerCard {
    @primaryKey
    instanceId: string;
    cardDefinitionId: string; // Link to CardDefinition
    ownerFactionId: string;
    location: "DECK_OVERWORLD" | "HAND_OVERWORLD" | "DISCARD_OVERWORLD" | "DECK_SCENARIO" | "HAND_SCENARIO" | "DISCARD_SCENARIO" | "IN_PLAY_OVERWORLD" | "IN_PLAY_SCENARIO";
    // Any instance-specific state (e.g., damage counters on an ICE card)
}

@table({ name: "ScenarioInstance" })
export class ScenarioInstance {
    @primaryKey
    id: string;
    status: "ACTIVE" | "RESOLVED_SUCCESS" | "RESOLVED_FAILURE";
    triggeringFactionId: string;
    targetTerritoryId: string;
    involvedFactionIds: string[];
    objectives: any; // Define objective structure
    // Current state within the scenario (e.g., runner position, active effects)
}

// --- Player/Account Data (Separate from active game state, persistent)
@table({ name: "PlayerProfile" })
export class PlayerProfile {
    @primaryKey
    playerId: string; // Matches Faction.playerId
    displayName: string;
    unlockedCardDefinitionIds: string[];
    factionProgression: { [factionId: string]: number }; // XP or level per faction
    // Other meta-currency, achievements etc.
}
```

content_copydownload

Use code [with caution](https://support.google.com/legal/answer/13505487).TypeScript

#### 4.2 Persistence

- **Active Game State:** Persisted automatically by SpacetimeDB. Games can be paused and resumed if the server instance remains running or if state is snapshotted.
    
- **Player Meta-Progression:** Stored in PlayerProfile tables, linked by a persistent playerId (potentially tied to an external authentication provider or generated UUID stored locally for anonymous play).
    

#### 4.3 Data Synchronization

- SpacetimeDB handles real-time synchronization of table changes to subscribed clients.
    
- Client-side logic subscribes to relevant tables (e.g., Territories, Factions in the current game, Cards in hand).
    
- Server-side reducers validate actions and apply state changes atomically.
    
- Client prediction will be implemented for tactical scenario actions (e.g., moving a runner, playing a fast event) to mask latency. The client displays the predicted state immediately and reconciles with the server's authoritative state upon receiving the update.
    

### 5. Core Module Specifications (Implementation Details)

#### 5.1 Overworld Manager

- **Turn Structure:** Implement phases: UPKEEP -> ACTION -> CLEANUP. Manage GameState.activeFactionId and GameState.currentPhase.
    
- **Resource Generation:** On UPKEEP, iterate through Territories, check corporateInfluence to determine control, query Territory.resourceValue, and add resources to controlling Faction.resources via SpacetimeDB update.
    
- **Influence Calculation:** Define logic based on Installation presence and type in a Territory. E.g., Corp Infrastructure adds +X influence, Runner Network adds -Y influence. Calculate Territory.corporateInfluence during CLEANUP or when relevant cards are played.
    
- **Card Play Logic:** Reducers in SpacetimeDB will handle Overworld card plays:
    
    1. Verify activeFactionId, currentPhase, Faction.resources >= card cost.
        
    2. Verify card target (if applicable).
        
    3. Debit resources from Faction.
        
    4. Apply card effects (create Installation, modify Territory attributes, grant resources, change GameState, etc.).
        
    5. Move played card from Hand to Discard (update PlayerCard.location).
        
- **Scenario Triggering:** When a Runner plays a "Run" action/card targeting a Territory, change GameState.currentPhase to SCENARIO_ACTIVE and create a ScenarioInstance record.
    

#### 5.2 Scenario Manager

- **Instance Creation:** When a ScenarioInstance is created:
    
    1. Fetch Territory data (Security Level, Corp Installations like ICE).
        
    2. Generate mission layout/objectives based on trigger and territory data.
        
    3. Initialize Scenario state (Runner position, starting hand drawn from PlayerCard where location == 'DECK_SCENARIO').
        
- **Turn Structure:** Manage Runner turns and AI/Corp response phases within the Scenario.
    
- **Card Play Logic:** Similar to Overworld, but using Scenario cards (PlayerCard where location == 'HAND_SCENARIO'). Effects are typically contained within the ScenarioInstance state (e.g., dealing damage to Runner, breaking ICE subroutines, installing Programs).
    
- **Objective Resolution:** Check objective completion conditions at the end of turns or after specific actions.
    
- **Outcome Application:** When ScenarioInstance.status changes to RESOLVED_SUCCESS or RESOLVED_FAILURE:
    
    1. Trigger a server-side function/reducer.
        
    2. Apply effects to the Overworld GameState, Territory, and Faction tables based on the outcome (e.g., modify corporateInfluence, grant resources, damage installations, update VPs).
        
    3. Change GameState.currentPhase back to OVERWORLD_ACTION or CLEANUP.
        
    4. Clean up ScenarioInstance state or mark as resolved.
        

#### 5.3 Card System

- **Card Effects:** Implement an Effect Execution system. Card definitions (CardDefinition.effectDefinition) should describe effects declaratively (e.g., { type: "MODIFY_RESOURCE", target: "SELF", resource: "CREDITS", value: 3 } or { type: "MODIFY_TERRITORY_ATTR", target: "TARGET_TERRITORY", attribute: "SECURITY_LEVEL", value: 1 }). A central function interprets and applies these effects to the game state via SpacetimeDB updates.
    
- **Market Logic (Post-MVP):** Implement logic for populating/refreshing a shared market pool (MarketCard table?). Availability/cost can query Territory control state. Player action "Buy Card" debits resources and creates a PlayerCard record in the player's discard pile.
    
- **Deckbuilding (Post-MVP):** UI for players to construct decks from their collection (PlayerProfile.unlockedCardDefinitionIds) adhering to faction/influence rules, saving the deck list associated with their Faction for the current game.
    

### 6. Error Handling Strategy

- **Network Issues:**
    
    - Client: Detect disconnects. Attempt automatic reconnection via SpacetimeDB client library. Display appropriate UI state (e.g., "Reconnecting..."). If reconnection fails after timeout, inform user and potentially offer returning to lobby/main menu.
        
    - Server: SpacetimeDB handles client connection state. Implement logic for handling player timeouts (e.g., skip turn, AI takeover in PvE, game pause/abort in PvP).
        
- **Invalid Actions:**
    
    - Client: Perform preliminary validation (e.g., can afford card cost, target is valid) to provide immediate feedback and prevent unnecessary server requests.
        
    - Server: SpacetimeDB Reducers must perform authoritative validation. If an action is invalid (e.g., insufficient resources, illegal target, wrong phase), the reducer should simply not modify the state and potentially log the invalid attempt. The client will implicitly know the action failed because the expected state change won't occur. Explicit error messages back to the client might be needed for critical failures.
        
- **Server Errors:** Log server-side errors extensively. Implement health checks. If critical errors occur, attempt graceful shutdown or state rollback if feasible.
    
- **Data Corruption:** Rely on SpacetimeDB's transactional guarantees. Implement schema validation and defensive programming in reducers. Regularly back up persistent data.
    

### 7. Testing Plan

#### 7.1 Methodology: Test-Driven Development (TDD)

- Write tests before writing implementation code for core logic (especially game rules, card effects, state transitions).
    
- Focus on Red-Green-Refactor cycle.
    

#### 7.2 Levels of Testing

1. **Unit Tests (TypeScript/Jest):**
    
    - Test individual functions, classes, components (e.g., influence calculation, resource cost check, card effect parsing).
        
    - Mock dependencies (like SpacetimeDB interactions where necessary).
        
    - Target: Core game logic, utility functions. High coverage goal (85%+).
        
2. **Server-Side Logic Tests (SpacetimeDB Testing Environment):**
    
    - Test SpacetimeDB Reducers directly by simulating player actions and verifying state transitions within the SpacetimeDB environment.
        
    - Target: Game rule enforcement, state change correctness, action validation. Critical coverage.
        
3. **Integration Tests:**
    
    - Test interactions between modules (e.g., Scenario outcome correctly updating Overworld state, Market purchase adding card to deck).
        
    - May involve spinning up minimal client/server instances or testing against a dedicated test database.
        
    - Target: Core gameplay loops, interplay mechanics.
        
4. **End-to-End (E2E) Tests (Automation Framework - e.g., Playwright, Cypress):**
    
    - Simulate user interactions in the browser driving the Godot client.
        
    - Verify full gameplay flows (e.g., play Overworld card -> trigger Scenario -> complete Scenario -> verify Overworld change).
        
    - Target: Critical player paths, UI interactions. Selective coverage due to maintenance overhead.
        
5. **Manual Playtesting:**
    
    - Regular internal playtests focusing on gameplay feel, balance, usability, and bug hunting.
        
    - Structured feedback collection. Essential for balance and fun factor.
        

#### 7.3 Types of Testing

- **Functional:** Verify requirements (FRs) are met.
    
- **Performance:** Measure latency, server load, client FPS under various conditions.
    
- **Security:** Penetration testing (if applicable), validation checks, cheat detection analysis.
    
- **Usability:** Gather feedback on UI/UX clarity and ease of use.
    
- **Compatibility:** Test across target browsers and potentially different resolutions.
    
- **Regression:** Automated tests run frequently (CI/CD pipeline) to catch new bugs introduced by changes.
    

#### 7.4 Focus Areas

- **Interplay Loop:** Rigorously test the data flow and state changes between Overworld and Scenario layers.
    
- **State Synchronization:** Verify consistency across multiple clients under various network conditions (latency, packet loss simulation).
    
- **Asymmetric Balance:** Ongoing playtesting and data analysis to ensure factions are distinct but viable.
    
- **Card Effect Correctness:** Unit and integration tests for all implemented card effects.
    

### 8. Initial Prototyping Scope (MVP)

- **Engine Setup:** Godot project configured for Web export (GodotJS), basic scene structure.
    
- **Server Setup:** SpacetimeDB instance configured with MVP data models (Territory, Faction, GameState, minimal CardDefinition/PlayerCard).
    
- **Overworld:** Render basic hex grid. Allow selecting a territory. Implement 1 Overworld card play action (e.g., place generic 'Influence Token') for 1 Corp & 1 Runner. Basic resource display. Minimal turn progression.
    
- **Scenario:** Implement triggering a generic Scenario instance on a target territory via Overworld action. Render a placeholder Scenario view. Implement 1 basic Runner Scenario card play (e.g., 'Move', 'Interact'). Basic Success/Fail condition (e.g., reach location).
    
- **Interplay:**
    
    - Overworld Security Level (simple number) slightly modifies Scenario (e.g., adds 1 extra obstacle).
        
    - Scenario Success/Fail slightly modifies Overworld Influence in the target territory.
        
- **Networking:** Basic state sync via SpacetimeDB for territory influence and player resources.
    
- **Factions:** 1 Corp (e.g., Weyland archetype - Place 'Defense Asset'), 1 Runner (e.g., Anarch archetype - 'Disrupt Asset' action). No complex progression.
    

This MVP focuses solely on proving the technical feasibility and basic fun factor of the core dual-layer interaction loop.