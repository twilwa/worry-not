---
tags:
  - levelsio-hackathon
  - synthesized
  - design-doc
  - systems-architecture
---

### Overview

This document outlines the technical architecture for the "End of Line" multiplayer roguelike deckbuilder-RPG hybrid. Following test-driven development (TDD) principles, this architecture provides a clean separation of concerns, modularity, and testability while enabling complex interactions between game systems.

### Architecture Foundation

#### Core Architecture Pattern

The game uses an Entity-Component pattern as its primary architecture, supplemented by an Event Bus for decoupled communication:

1. **Entity-Component Pattern**
    - Used for game entities (cards, players, territories, etc.)
    - Entities are composed of reusable components
    - Provides flexibility and extensibility for game objects
2. **Event Bus**
    - Enables decoupled communication between systems
    - Uses publish-subscribe pattern for event handling
    - Improves modularity and testability
3. **Service Layer**
    - Global systems accessible throughout the codebase
    - Manages cross-cutting concerns like networking and persistence

### Project Structure

Copy

`/server                  # SpacetimeDB Module   /src    /tables              # Database table definitions    /reducers            # Game logic functions    lib.rs               # Main entry point /godot_project   /addons               # Plugin directory  /assets               # Base assets  /scenes               # All game scenes    /core               # Core management scenes    /ui                 # Interface elements    /territory          # Map and territory elements    /card               # Card system elements    /mission            # Mission gameplay elements  /scripts              # All game scripts  /tests                # Test infrastructure`

### Core Systems Breakdown

#### SpacetimeDB Table Definitions

rust

Copy

`#[spacetimedb::table] pub struct Card {     #[primary_key]    id: u64,    name: String,    card_type: CardType,    faction: Faction,    cost: i32,    text: String } #[spacetimedb::table] pub struct Territory {     #[primary_key]    id: u64,    name: String,    territory_type: TerritoryType,    x: i32,    y: i32,    corporate_influence: u8,  // 0-100    security_level: u8,       // 1-5    resource_value: u8        // 1-5 } #[spacetimedb::table] pub struct Player {     #[primary_key]    identity: Identity,    connection_id: ConnectionId,    faction: Faction,    credits: i32,    memory_units: i32,    actions_remaining: i32 }`

#### Key Reducers

rust

Copy

`#[spacetimedb::reducer] pub fn play_card(ctx: ReducerContext, card_id: u64, target_id: Option<u64>) -> Result<(), String> {     // Implementation for playing cards } #[spacetimedb::reducer] pub fn control_territory(ctx: ReducerContext, territory_id: u64, influence_amount: u8) -> Result<(), String> {     // Implementation for territory control } #[spacetimedb::reducer] pub fn initiate_mission(ctx: ReducerContext, territory_id: u64, mission_type: MissionType) -> Result<(), String> {     // Implementation for starting missions }`

#### Entity-Component Implementation

gdscript

Copy

`# entity.gd class_name Entity extends Node var id: int var components: Dictionary = {} func add_component(component: Component) -> void:     components[component.get_type()] = component    component.entity = self    add_child(component)`

#### Event Bus Implementation

gdscript

Copy

`# event_bus.gd class_name EventBus extends Node signal card_played(card_id, player_id, target_id) signal territory_control_changed(territory_id, faction, amount) signal mission_initiated(territory_id, player_id, mission_type) signal mission_completed(territory_id, player_id, success, rewards)`

#### SpacetimeDB Integration

gdscript

Copy

`# spacetime_manager.gd class_name SpacetimeManager extends Node func initialize_connection() -> void:     db_connection = DbConnection.builder()\        .with_uri("ws://localhost:3000")\        .with_module_name("end-of-line")\        .on_connect(_on_connect)\        .on_connect_error(_on_connect_error)\        .on_disconnect(_on_disconnect)\        .build() func sync_game_state() -> void:     # Synchronize game state with SpacetimeDB data    update_territories()    update_cards()    update_players() func call_reducer(reducer_name: String, args: Array) -> void:     # Call SpacetimeDB reducers with arguments    match reducer_name:        "play_card":            db_connection.reducers.play_card(args[0], args[1])        "control_territory":            db_connection.reducers.control_territory(args[0], args[1])        "initiate_mission":            db_connection.reducers.initiate_mission(args[0], args[1])`

### HexGrid System

The game uses a HexGrid system for representing the game world:

gdscript

Copy

`# hex_grid_controller.gd class_name HexGridController extends Node const HEX_SIZE = 64 const GRID_WIDTH = 3  # Simplified for initial phase const GRID_HEIGHT = 3 # Simplified for initial phase var hex_grid: HexGrid var territories: Dictionary = {} func _ready() -> void:     hex_grid = HexGrid.new()    hex_grid.initialize(HEX_SIZE, GRID_WIDTH, GRID_HEIGHT)    add_child(hex_grid)         # Create territories on the grid    for x in range(GRID_WIDTH):        for y in range(GRID_HEIGHT):            var territory = create_territory(x, y)            territories[Vector2(x, y)] = territory            hex_grid.set_cell(x, y, territory)`

### Card System

The card system manages all card-related functionality:

gdscript

Copy

`# card_manager.gd class_name CardManager extends Node var card_database: CardDatabase var player_hand: CardHand var card_container: CardContainer func _ready() -> void:     # Initialize card systems    card_database = CardDatabase.new()    player_hand = CardHand.new()    card_container = CardContainer.new()         add_child(player_hand)    add_child(card_container) func draw_card(card_id: int) -> CardInstance:     var card_data = card_database.get_card(card_id)    var card_instance = CardInstance.new()    card_instance.initialize(card_data)    player_hand.add_card(card_instance)    return card_instance     func play_card(card_instance: CardInstance, target = null) -> void:     player_hand.remove_card(card_instance)    # Handle effects and communication with SpacetimeDB`

## Testing Strategy

The game follows a test-driven development approach with multiple testing levels:

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

### Test Example

gdscript

Copy

`func test_play_card():     # Arrange    var card = card_manager.draw_card(1)         # Act    card_manager.play_card(card)         # Assert    assert_eq(card_manager.hand_size(), 0)    assert_eq(card_manager.discard_pile_size(), 1)`