---
tags:
  - design-doc
  - levelsio-hackathon
  - synthesized
---


## Phase Overview

The initial development phase focuses on implementing core gameplay systems and establishing the multiplayer foundation using SpacetimeDB and Godot.

|Focus|Primary Tools|Key Deliverables|
|---|---|---|
|Game Systems & Multiplayer|SpacetimeDB, Godot|Core gameplay loops, multiplayer foundation|

## SpacetimeDB Implementation

### Module Structure

Copy

`/server   /src    /tables      # Database table definitions    /reducers    # Game logic functions    lib.rs       # Main entry point`

### Key Table Definitions

rust

Copy

`#[spacetimedb::table] pub struct Card {     #[primary_key]    id: u64,    name: String,    card_type: CardType,    faction: Faction,    cost: i32,    text: String } #[spacetimedb::table] pub struct Territory {     #[primary_key]    id: u64,    name: String,    territory_type: TerritoryType,    x: i32,    y: i32,    corporate_influence: u8,  // 0-100    security_level: u8,       // 1-5    resource_value: u8        // 1-5 } #[spacetimedb::table] pub struct Player {     #[primary_key]    identity: Identity,    connection_id: ConnectionId,    faction: Faction,    credits: i32,    memory_units: i32,    actions_remaining: i32 }`

### Critical Reducers

rust

Copy

`#[spacetimedb::reducer] pub fn play_card(ctx: ReducerContext, card_id: u64, target_id: Option<u64>) -> Result<(), String> {     // Implementation for playing cards } #[spacetimedb::reducer] pub fn control_territory(ctx: ReducerContext, territory_id: u64, influence_amount: u8) -> Result<(), String> {     // Implementation for territory control } #[spacetimedb::reducer] pub fn initiate_mission(ctx: ReducerContext, territory_id: u64, mission_type: MissionType) -> Result<(), String> {     // Implementation for starting missions }`

## Godot Project Structure

Copy

`/godot_project   /addons             # Plugin directory  /assets             # Base assets  /scenes             # All game scenes    /core             # Core management scenes    /ui               # Interface elements    /territory        # Map and territory elements    /card             # Card system elements    /mission          # Mission gameplay elements  /scripts            # All game scripts  /tests              # Test infrastructure`

## Core System Implementation

### Entity-Component System

The game uses an Entity-Component pattern for flexibility:

gdscript

Copy

`# entity.gd class_name Entity extends Node var id: int var components: Dictionary = {} func add_component(component: Component) -> void:     components[component.get_type()] = component    component.entity = self    add_child(component)`

### Event Bus System

Decoupled communication through an event bus:

gdscript

Copy

`# event_bus.gd class_name EventBus extends Node signal card_played(card_id, player_id, target_id) signal territory_control_changed(territory_id, faction, amount) signal mission_initiated(territory_id, player_id, mission_type) signal mission_completed(territory_id, player_id, success, rewards)`

### SpacetimeDB Integration

gdscript

Copy

`# spacetime_manager.gd class_name SpacetimeManager extends Node func initialize_connection() -> void:     db_connection = DbConnection.builder()\        .with_uri("ws://localhost:3000")\        .with_module_name("end-of-line")\        .on_connect(_on_connect)\        .on_connect_error(_on_connect_error)\        .on_disconnect(_on_disconnect)\        .build() func _on_connect(conn, identity, token) -> void:     # Subscribe to tables    conn.subscription_builder()\        .on_applied(_on_subscription_applied)\        .on_error(_on_subscription_error)\        .subscribe(["SELECT * FROM card", "SELECT * FROM territory", "SELECT * FROM player"]) func sync_game_state() -> void:     # Synchronize game state with SpacetimeDB data    update_territories()    update_cards()    update_players() func call_reducer(reducer_name: String, args: Array) -> void:     # Call SpacetimeDB reducers with arguments    match reducer_name:        "play_card":            db_connection.reducers.play_card(args[0], args[1])        "control_territory":            db_connection.reducers.control_territory(args[0], args[1])        "initiate_mission":            db_connection.reducers.initiate_mission(args[0], args[1])`

### HexGrid Implementation

gdscript

Copy

`# hex_grid_controller.gd class_name HexGridController extends Node const HEX_SIZE = 64 const GRID_WIDTH = 3 const GRID_HEIGHT = 3 var hex_grid: HexGrid var territories: Dictionary = {} func _ready() -> void:     hex_grid = HexGrid.new()    hex_grid.initialize(HEX_SIZE, GRID_WIDTH, GRID_HEIGHT)    add_child(hex_grid)         # Create territories on the grid    for x in range(GRID_WIDTH):        for y in range(GRID_HEIGHT):            var territory = create_territory(x, y)            territories[Vector2(x, y)] = territory            hex_grid.set_cell(x, y, territory)`

### Card System Implementation

gdscript

Copy

`# card_manager.gd class_name CardManager extends Node var card_database: CardDatabase var player_hand: CardHand var card_container: CardContainer func _ready() -> void:     # Initialize card systems    card_database = CardDatabase.new()    player_hand = CardHand.new()    card_container = CardContainer.new()         add_child(player_hand)    add_child(card_container) func draw_card(card_id: int) -> CardInstance:     var card_data = card_database.get_card(card_id)    var card_instance = CardInstance.new()    card_instance.initialize(card_data)    player_hand.add_card(card_instance)    return card_instance     func play_card(card_instance: CardInstance, target = null) -> void:     player_hand.remove_card(card_instance)    # Handle effects and communication with SpacetimeDB`

## Testing Strategy

Test-driven development is implemented with:

- **Unit Tests**: Testing individual components
- **Integration Tests**: Testing interactions between systems
- **Performance Tests**: Ensuring smooth gameplay
- **Network Tests**: Verifying multiplayer functionality

Example test case:

gdscript

Copy

`func test_play_card():     # Setup    var card = card_manager.draw_card(1)         # Test playing a card    card_manager.play_card(card)         # Assertions    assert_eq(card_manager.hand_size(), 0, "Hand should be empty after playing card")    assert_eq(card_manager.discard_pile_size(), 1, "Discard pile should have 1 card")`