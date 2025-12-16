# End of Line - Technical Architecture

## Overview

This document outlines the technical architecture for the "End of Line" multiplayer roguelike deckbuilder-RPG hybrid. Following test-driven development (TDD) principles, this architecture provides a clean separation of concerns, modularity, and testability while enabling the complex interactions between game systems.

## Architecture Foundation

### Core Architecture Pattern

The game uses a hybrid architecture combining Entity-Component System (ECS) with Model-View-Controller (MVC) patterns:

1. **Entity-Component System (ECS)**
   - Used for game entities (cards, players, territories, etc.)
   - Entities are composed of reusable components
   - Systems operate on entities with specific component combinations

2. **Model-View-Controller (MVC)**
   - Models: Data structures for game state
   - Views: UI components for player interaction
   - Controllers: Logic connecting models and views, handling player input

3. **Service Layer**
   - Global systems accessible throughout the codebase
   - Manages cross-cutting concerns like networking, persistence, logging

4. **Event Bus**
   - Decoupled communication between systems
   - Publish-subscribe pattern for event handling

## Core Systems Breakdown

### Card System Architecture

```
CardSystem/
  ├── Models/
  │   ├── CardResource.gd      # Base data class for all cards
  │   ├── CardInstance.gd      # Runtime instance of a card
  │   ├── DeckResource.gd      # Collection of CardResource references
  │   └── Factories/
  │       └── CardFactory.gd   # Factory for creating cards
  ├── Components/
  │   ├── CardView.tscn        # Visual representation of a card
  │   ├── HandView.tscn        # Visual representation of a hand
  │   └── DeckView.tscn        # Visual representation of a deck
  ├── Controllers/
  │   ├── CardManager.gd       # Manages card instances and interactions
  │   ├── DeckManager.gd       # Manages deck operations
  │   └── ZoneManager.gd       # Manages card zones (hand, discard, etc.)
  └── Tests/
      ├── test_card.gd         # Unit tests for Card class
      ├── test_deck.gd         # Unit tests for Deck class
      └── test_card_interactions.gd # Integration tests for card interactions
```

#### Card Class Hierarchy

```gdscript
# Base Card class
class_name Card
extends Resource

# Card properties
var id: String
var title: String
var card_type: String  # ice, agenda, asset, program, etc.
var card_subtype: Array[String] = []
var cost: int
var faction: String  # corp, runner, or specific faction

# Additional properties based on type
var strength: int = 0  # For ice and icebreakers
var memory_cost: int = 0  # For programs
var advancement_requirement: int = 0  # For agendas
var agenda_points: int = 0  # For agendas
var rez_cost: int = 0  # For corp cards
var trash_cost: int = 0  # For corp cards

# Card text and effect definitions
var text: String
var effect: Dictionary = {}

# Specialized Card classes
class_name IceCard
extends Card
# Ice-specific implementation

class_name ProgramCard
extends Card
# Program-specific implementation

class_name AgendaCard
extends Card
# Agenda-specific implementation
```

### Player System Architecture

```
PlayerSystem/
  ├── Models/
  │   ├── PlayerData.gd       # Persistent player information
  │   ├── PlayerState.gd      # Runtime player state
  │   ├── IdentityResource.gd # Player character definition
  │   └── Factories/
  │       └── PlayerFactory.gd # Factory for creating players
  ├── Components/
  │   ├── PlayerView.tscn      # Visual representation of a player
  │   ├── ResourceCounter.tscn # Visual counter for resources
  │   └── ActionButton.tscn    # Button for player actions
  ├── Controllers/
  │   ├── PlayerController.gd  # Handles input and action execution
  │   ├── ResourceManager.gd   # Manages player resources
  │   └── FactionManager.gd    # Manages faction-specific features
  └── Tests/
      ├── test_player.gd       # Unit tests for Player class
      ├── test_resources.gd    # Unit tests for resource management
      └── test_actions.gd      # Integration tests for player actions
```

#### Player Class Hierarchy

```gdscript
# Base Player class
class_name Player
extends Node

enum PlayerType { CORP, RUNNER }

# Player identification
var player_id = ""
var player_name = ""
var player_type = PlayerType.RUNNER  # Default, will be set in subclasses
var faction = ""

# Resources
var credits = 0
var clicks = 0
var max_hand_size = 5

# Card collections
var deck = []
var hand = []
var discard_pile = []
var scored_agendas = []
var identity_card = null

# Specialized Player classes
class_name CorpPlayer
extends Player
# Corp-specific implementation

class_name RunnerPlayer
extends Player
# Runner-specific implementation
```

### World System Architecture

```
WorldSystem/
  ├── Models/
  │   ├── Territory.gd        # Represents a controllable area
  │   ├── WorldMap.gd         # Container for all territories
  │   ├── LocationInstance.gd # Specific location within a territory
  │   └── Factories/
  │       └── WorldFactory.gd # Factory for creating world elements
  ├── Components/
  │   ├── TerritoryView.tscn  # Visual representation of a territory
  │   ├── WorldMapView.tscn   # Visual representation of the world map
  │   └── LocationView.tscn   # Visual representation of a location
  ├── Controllers/
  │   ├── TerritoryManager.gd # Manages territory control and state
  │   ├── ProceduralGenerator.gd # Generates world instances
  │   └── MissionManager.gd   # Manages narrative missions
  └── Tests/
      ├── test_territory.gd   # Unit tests for Territory class
      ├── test_world_map.gd   # Unit tests for WorldMap class
      └── test_procedural_generation.gd # Tests for procedural generation
```

### Networking Architecture

```
NetworkSystem/
  ├── Models/
  │   ├── NetworkMessage.gd   # Data structure for network messages
  │   ├── GameSession.gd      # Represents a single game instance
  │   └── PlayerConnection.gd # Represents a player connection
  ├── Components/
  │   ├── ConnectionUI.tscn   # UI for connection status
  │   ├── LobbyUI.tscn        # UI for game lobby
  │   └── NetworkDebugUI.tscn # UI for network debugging
  ├── Controllers/
  │   ├── NetworkManager.gd   # Central manager for networking
  │   ├── SessionManager.gd   # Manages game sessions
  │   └── RPCHandler.gd       # Handles RPC calls
  └── Tests/
      ├── test_network_manager.gd    # Unit tests for NetworkManager
      ├── test_session.gd           # Unit tests for GameSession
      └── test_mock_network.gd      # Tests with mocked network
```

## Test Architecture

```
TestSystem/
  ├── Unit/
  │   ├── CardTests/            # Unit tests for card system
  │   ├── PlayerTests/          # Unit tests for player system
  │   ├── WorldTests/           # Unit tests for world system
  │   └── NetworkTests/         # Unit tests for network system
  ├── Integration/
  │   ├── CardPlayerTests/      # Integration tests for card-player interaction
  │   ├── PlayerWorldTests/     # Integration tests for player-world interaction
  │   └── NetworkGameTests/     # Integration tests for networked game
  ├── System/
  │   ├── GameFlowTests/        # End-to-end tests for game flow
  │   ├── PerformanceTests/     # Tests for performance benchmarks
  │   └── NetworkStressTests/   # Stress tests for networking
  └── Helpers/
      ├── TestRunner.gd         # Test runner script
      ├── MockCard.gd           # Mock card for testing
      ├── MockPlayer.gd         # Mock player for testing
      └── TestUtils.gd          # Utility functions for testing
```

### Test Example: Card Drawing

```gdscript
# Unit test for drawing cards
func test_draw_card():
    # Arrange
    var deck = DeckResource.new()
    deck.add_card(create_test_card("Card1"))
    deck.add_card(create_test_card("Card2"))
    var player = MockPlayer.new()
    player.set_deck(deck)
    
    # Act
    player.draw_card()
    
    # Assert
    assert_eq(player.hand.size(), 1)
    assert_eq(player.deck.size(), 1)
    assert_eq(player.hand[0].name, "Card2") # Top card should be drawn
```

## Implementation Phases

### Phase 1: Core Engine (Weeks 1-4)
- Basic architecture
- Card system foundation
- Testing framework

### Phase 2: Single Player (Weeks 5-10)
- Basic gameplay loop
- AI opponent
- Procedural generation foundation

### Phase 3: Multiplayer (Weeks 11-16)
- Networking implementation
- Matchmaking
- Session management

### Phase 4: Content and Polish (Weeks 17-24)
- Full card set
- Progression systems
- UI finalization
- Balance tuning

## Testability Focus

### Unit Testing
- Each class has its own test suite
- Mock objects for dependencies
- Testing both success and failure cases

### Integration Testing
- Testing interaction between systems
- Focus on common workflows
- Mock external dependencies

### System Testing
- End-to-end testing of entire game flows
- Performance testing
- Network simulation testing

### TDD Workflow
1. Write test for new feature
2. Verify test fails (Red)
3. Implement minimal code to pass test (Green)
4. Refactor code while keeping tests passing (Refactor)
5. Document test case and implementation
6. Repeat for next feature

## Dependencies and Plugin Integration

### Godot Plugins
- **Dialogic**: For narrative dialog system
- **Phantom Camera**: For advanced camera control
- **Gaea**: For procedural world generation
- **GUT (Godot Unit Testing)**: For test-driven development

### External Tools
- **Git**: For version control
- **CI/CD**: For automated testing and deployment

## Coding Standards

1. **Naming Conventions**
   - CamelCase for classes (e.g., `CardManager`)
   - snake_case for variables and functions (e.g., `draw_card()`)
   - Constants in ALL_CAPS (e.g., `MAX_HAND_SIZE`)

2. **Code Organization**
   - One class per file
   - Clear separation of concerns
   - Documentation comments for public APIs

3. **Error Handling**
   - Return values to indicate success/failure
   - Error signals for asynchronous operations
   - Graceful degradation for non-critical failures

4. **Performance Considerations**
   - Optimize critical paths (card drawing, combat resolution)
   - Pooling for frequently created objects
   - Batch processing for network operations

This architecture provides a robust foundation for implementing the "End of Line" game, ensuring maintainability, testability, and scalability throughout the development process.
