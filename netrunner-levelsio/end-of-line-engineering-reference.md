# End of Line - Engineering Reference Documentation

## Table of Contents

1. [Development Phase Overview](#development-phase-overview)
2. [SpacetimeDB + Godot Phase](#spacetimedb--godot-phase)
3. [TypeScript Integration Phase](#typescript-integration-phase)
4. [Asset Design & Generation Phase](#asset-design--generation-phase)
5. [Final Integration & Polish Phase](#final-integration--polish-phase)
6. [Testing Strategy](#testing-strategy)
7. [Performance Considerations](#performance-considerations)
8. [Troubleshooting Guide](#troubleshooting-guide)

---

## Development Phase Overview

The development of End of Line is segmented into four distinct phases, each focusing on different aspects of the system. This approach allows for focused development efforts and incremental integration.

| Phase | Focus | Primary Tools | Key Deliverables |
|-------|-------|---------------|------------------|
| 1 | Game Systems & Multiplayer | SpacetimeDB, Godot | Core gameplay loops, multiplayer foundation |
| 2 | Client SDK & Scripting | TypeScript, GodotJS | Browser compatibility, SDK integration |
| 3 | Asset Creation & Visual Design | Blender, Imagen 3.0 | 3D assets, card art, UI elements |
| 4 | Integration & Polish | Godot, TypeScript | Feature integration, performance optimization |

---

## SpacetimeDB + Godot Phase

This initial phase focuses on implementing core gameplay systems and establishing the multiplayer foundation using SpacetimeDB and Godot.

### SpacetimeDB Setup

#### Module Structure

```
/server
  /src
    /tables
      mod.rs
      card.rs
      territory.rs
      player.rs
      ...
    /reducers
      mod.rs
      game_actions.rs
      territory_control.rs
      mission_execution.rs
      ...
    lib.rs
```

#### Key Table Definitions

```rust
#[spacetimedb::table]
pub struct Card {
    #[primary_key]
    id: u64,
    name: String,
    card_type: CardType,
    faction: Faction,
    cost: i32,
    text: String,
    // Additional card-specific fields
}

#[spacetimedb::table]
pub struct Territory {
    #[primary_key]
    id: u64,
    name: String,
    territory_type: TerritoryType,
    x: i32,
    y: i32,
    corporate_influence: u8, // 0-100
    security_level: u8,      // 1-5
    resource_value: u8,      // 1-5
    stability_index: u8,     // 0-100
    population: u8,          // 1-5
    // Additional territory data
}

#[spacetimedb::table]
pub struct Player {
    #[primary_key]
    identity: Identity,
    connection_id: ConnectionId,
    faction: Faction,
    credits: i32,
    memory_units: i32,
    actions_remaining: i32,
    // Additional player state
}
```

#### Critical Reducers

```rust
#[spacetimedb::reducer]
pub fn play_card(ctx: ReducerContext, card_id: u64, target_id: Option<u64>) -> Result<(), String> {
    // Implementation details
}

#[spacetimedb::reducer]
pub fn control_territory(ctx: ReducerContext, territory_id: u64, influence_amount: u8) -> Result<(), String> {
    // Implementation details
}

#[spacetimedb::reducer]
pub fn initiate_mission(ctx: ReducerContext, territory_id: u64, mission_type: MissionType) -> Result<(), String> {
    // Implementation details
}
```

### Godot Project Structure

```
/godot_project
  /addons             # Plugin directory
  /assets             # Base assets
  /scenes
    /core
      game_manager.tscn
      event_bus.tscn
    /ui
      main_menu.tscn
      game_board.tscn
      card_hand.tscn
    /territory
      hex_grid.tscn
      territory_tile.tscn
    /card
      card_instance.tscn
      card_container.tscn
    /mission
      server_view.tscn
      ice_instance.tscn
  /scripts
    /core
      game_manager.gd
      event_bus.gd
    /ui
      main_menu.gd
      game_board.gd
    /territory
      hex_grid.gd
      territory_controller.gd
    /card
      card_manager.gd
      card_instance.gd
    /mission
      mission_controller.gd
      ice_controller.gd
  /tests
    /unit
      card_tests.gd
      territory_tests.gd
    /integration
      gameplay_tests.gd
```

### Core System Implementation

#### Entity-Component System

The core game functionality uses an Entity-Component System pattern:

```gdscript
# entity.gd
class_name Entity
extends Node

var id: int
var components: Dictionary = {}

func add_component(component: Component) -> void:
    components[component.get_type()] = component
    component.entity = self
    add_child(component)
    
func get_component(type: String) -> Component:
    return components.get(type)
    
func has_component(type: String) -> bool:
    return components.has(type)
```

```gdscript
# component.gd
class_name Component
extends Node

var entity: Entity

func get_type() -> String:
    return "Component"
```

#### Event Bus Implementation

The event bus provides decoupled communication between systems:

```gdscript
# event_bus.gd
class_name EventBus
extends Node

signal card_played(card_id, player_id, target_id)
signal territory_control_changed(territory_id, faction, amount)
signal mission_initiated(territory_id, player_id, mission_type)
signal mission_completed(territory_id, player_id, success, rewards)
signal turn_ended(player_id)
signal game_state_updated()

# Additional events as needed
```

### HexGrid Integration

Utilize the HugoEnzo/HexGrid plugin for the territory system:

```gdscript
# hex_grid_controller.gd
class_name HexGridController
extends Node

const HEX_SIZE = 64
const GRID_WIDTH = 3  # Simplified for hackathon
const GRID_HEIGHT = 3 # Simplified for hackathon

var hex_grid: HexGrid
var territories: Dictionary = {}

func _ready() -> void:
    hex_grid = HexGrid.new()
    hex_grid.initialize(HEX_SIZE, GRID_WIDTH, GRID_HEIGHT)
    add_child(hex_grid)
    
    for x in range(GRID_WIDTH):
        for y in range(GRID_HEIGHT):
            var territory = create_territory(x, y)
            territories[Vector2(x, y)] = territory
            hex_grid.set_cell(x, y, territory)

func create_territory(x: int, y: int) -> TerritoryTile:
    var territory = TerritoryTile.new()
    # Initialize territory properties
    return territory
```

### Card Framework Integration

Use the Card Framework plugin to implement the card system:

```gdscript
# card_manager.gd
class_name CardManager
extends Node

const CARD_SCALE = Vector2(1, 1.4)
const HAND_SPACING = 0.5

var card_database: CardDatabase
var player_hand: CardHand
var card_container: CardContainer

func _ready() -> void:
    card_database = CardDatabase.new()
    card_database.initialize()
    
    player_hand = CardHand.new()
    player_hand.spacing = HAND_SPACING
    add_child(player_hand)
    
    card_container = CardContainer.new()
    add_child(card_container)

func draw_card(card_id: int) -> void:
    var card_data = card_database.get_card(card_id)
    var card_instance = CardInstance.new()
    card_instance.initialize(card_data)
    card_instance.scale = CARD_SCALE
    player_hand.add_card(card_instance)
    
func play_card(card_instance: CardInstance, target = null) -> void:
    player_hand.remove_card(card_instance)
    # Handle card effects
    # Communicate with SpacetimeDB
```

### SpacetimeDB Integration with Godot

Connect Godot to SpacetimeDB for state synchronization:

```gdscript
# spacetime_manager.gd
class_name SpacetimeManager
extends Node

var db_connection: DbConnection
var connected: bool = false

signal connection_established(identity)
signal connection_failed(error)
signal state_updated()

func _ready() -> void:
    initialize_connection()

func initialize_connection() -> void:
    db_connection = DbConnection.builder()\
        .with_uri("ws://localhost:3000")\
        .with_module_name("end-of-line")\
        .on_connect(_on_connect)\
        .on_connect_error(_on_connect_error)\
        .on_disconnect(_on_disconnect)\
        .build()

func _on_connect(conn, identity, token) -> void:
    connected = true
    emit_signal("connection_established", identity)
    
    # Subscribe to tables
    conn.subscription_builder()\
        .on_applied(_on_subscription_applied)\
        .on_error(_on_subscription_error)\
        .subscribe(["SELECT * FROM card", "SELECT * FROM territory", "SELECT * FROM player"])

func _on_connect_error(error_ctx, error) -> void:
    connected = false
    emit_signal("connection_failed", error)

func _on_disconnect(error_ctx, error) -> void:
    connected = false
    # Handle disconnection

func _on_subscription_applied(ctx) -> void:
    # Process initial data
    sync_game_state()
    emit_signal("state_updated")

func _on_subscription_error(error_ctx, error) -> void:
    # Handle subscription error

func sync_game_state() -> void:
    # Synchronize game state with SpacetimeDB data
    update_territories()
    update_cards()
    update_players()

func call_reducer(reducer_name: String, args: Array) -> void:
    # Call the appropriate reducer with arguments
    match reducer_name:
        "play_card":
            db_connection.reducers.play_card(args[0], args[1])
        "control_territory":
            db_connection.reducers.control_territory(args[0], args[1])
        "initiate_mission":
            db_connection.reducers.initiate_mission(args[0], args[1])
        # Additional reducers
```

---

## TypeScript Integration Phase

This phase focuses on browser compatibility through TypeScript and GodotJS integration.

### Directory Structure

```
/client
  /src
    /module_bindings     # Generated SpacetimeDB bindings
    /scripts
      /core
        game.ts
        event_bus.ts
      /ui
        ui_manager.ts
        card_ui.ts
      /spacetime
        connection.ts
        subscription.ts
    /decorators.bundle.ts
    /npm.bundle.ts
    tsconfig.json
```

### TypeScript Setup

#### TSConfig

```json
{
  "compilerOptions": {
    "target": "es2015",
    "module": "es2015",
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "outDir": "../godot_project/scripts/generated"
  },
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### SpacetimeDB TypeScript SDK Integration

```typescript
// connection.ts
import { DbConnection, Identity } from '@clockworklabs/spacetimedb-sdk';
import * as moduleBindings from '../module_bindings/index';

export class SpacetimeConnection {
  private static instance: SpacetimeConnection;
  private connection: moduleBindings.DbConnection | null = null;
  private identity: Identity | null = null;
  
  private constructor() {}
  
  public static getInstance(): SpacetimeConnection {
    if (!SpacetimeConnection.instance) {
      SpacetimeConnection.instance = new SpacetimeConnection();
    }
    return SpacetimeConnection.instance;
  }
  
  public connect(uri: string, moduleName: string): void {
    this.connection = moduleBindings.DbConnection.builder()
      .withUri(uri)
      .withModuleName(moduleName)
      .withToken(localStorage.getItem('auth_token') || '')
      .onConnect(this.handleConnect.bind(this))
      .onConnectError(this.handleConnectError.bind(this))
      .onDisconnect(this.handleDisconnect.bind(this))
      .build();
  }
  
  private handleConnect(conn: moduleBindings.DbConnection, identity: Identity, token: string): void {
    console.log('Connected to SpacetimeDB with identity:', identity.toHexString());
    localStorage.setItem('auth_token', token);
    this.identity = identity;
    this.connection = conn;
    this.subscribeToGameData();
    
    // Register reducer callbacks
    conn.reducers.onPlayCard(this.handlePlayCard.bind(this));
    conn.reducers.onControlTerritory(this.handleControlTerritory.bind(this));
    conn.reducers.onInitiateMission(this.handleInitiateMission.bind(this));
    // Additional reducer callbacks
  }
  
  private handleConnectError(ctx: moduleBindings.ErrorContext, error: Error): void {
    console.error('Failed to connect to SpacetimeDB:', error);
  }
  
  private handleDisconnect(ctx: moduleBindings.ErrorContext, error: Error | null): void {
    console.log('Disconnected from SpacetimeDB', error);
    this.connection = null;
  }
  
  private subscribeToGameData(): void {
    if (!this.connection) return;
    
    this.connection.subscriptionBuilder()
      .onApplied(() => {
        console.log('Subscription applied');
        // Process initial data
      })
      .onError((ctx, error) => {
        console.error('Subscription error:', error);
      })
      .subscribe([
        'SELECT * FROM card', 
        'SELECT * FROM territory', 
        'SELECT * FROM player'
      ]);
  }
  
  // Handler methods for reducers
  private handlePlayCard(ctx: moduleBindings.ReducerEventContext): void {
    // Update game state based on the play card event
  }
  
  private handleControlTerritory(ctx: moduleBindings.ReducerEventContext): void {
    // Update territory control based on the event
  }
  
  private handleInitiateMission(ctx: moduleBindings.ReducerEventContext): void {
    // Handle mission initiation
  }
  
  // Methods to call reducers
  public playCard(cardId: number, targetId?: number): void {
    this.connection?.reducers.playCard(cardId, targetId);
  }
  
  public controlTerritory(territoryId: number, influenceAmount: number): void {
    this.connection?.reducers.controlTerritory(territoryId, influenceAmount);
  }
  
  public initiateMission(territoryId: number, missionType: string): void {
    this.connection?.reducers.initiateMission(territoryId, missionType);
  }
  
  // Getters for game state
  public getCards(): moduleBindings.Card[] {
    return this.connection ? Array.from(this.connection.db.card.iter()) : [];
  }
  
  public getTerritories(): moduleBindings.Territory[] {
    return this.connection ? Array.from(this.connection.db.territory.iter()) : [];
  }
  
  public getPlayers(): moduleBindings.Player[] {
    return this.connection ? Array.from(this.connection.db.player.iter()) : [];
  }
  
  public getIdentity(): Identity | null {
    return this.identity;
  }
}
```

### GodotJS Integration

```typescript
// game.ts
import { onready, property, node } from './decorators.bundle';

export default class Game extends godot.Node {
  @property({ default: "ws://localhost:3000" })
  serverUrl: string;
  
  @property({ default: "end-of-line" })
  moduleName: string;
  
  @onready("UI/MainMenu")
  mainMenu: godot.Control;
  
  @onready("GameBoard")
  gameBoard: godot.Node;
  
  @node
  cardManager: godot.Node;
  
  private connected: boolean = false;
  
  _ready(): void {
    this.connectToSpacetimeDB();
  }
  
  connectToSpacetimeDB(): void {
    const connection = SpacetimeConnection.getInstance();
    connection.connect(this.serverUrl, this.moduleName);
    // Set up event listeners for connection status
  }
  
  startGame(): void {
    this.mainMenu.visible = false;
    this.gameBoard.visible = true;
    // Initialize game state
  }
  
  endTurn(): void {
    // Handle end of turn logic
  }
  
  // Additional game logic methods
}
```

### Browser Compatibility

```typescript
// browser_compatibility.ts
export class BrowserCompatibility {
  static check(): boolean {
    // Check for required browser features
    if (!window.WebSocket) {
      console.error("WebSockets are not supported by this browser.");
      return false;
    }
    
    if (!window.localStorage) {
      console.error("LocalStorage is not supported by this browser.");
      return false;
    }
    
    // Check for WebGL support
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        console.error("WebGL is not supported by this browser.");
        return false;
      }
    } catch (e) {
      console.error("Error checking WebGL support:", e);
      return false;
    }
    
    return true;
  }
  
  static setupServiceWorker(): void {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
          .then(registration => {
            console.log('ServiceWorker registration successful with scope:', registration.scope);
          })
          .catch(error => {
            console.error('ServiceWorker registration failed:', error);
          });
      });
    }
  }
}
```

---

## Asset Design & Generation Phase

This phase focuses on creating and integrating visual assets using Blender and Imagen 3.0.

### Asset Pipeline Overview

```
[Imagen 3.0] → [Blender] → [Asset Export] → [Godot Import]
    ↑             ↓
  Prompts      Refinement
                   ↓
              [Material Setup]
                   ↓
              [Animation]
```

### Blender Project Structure

```
/blender_project
  /source_files
    cards.blend
    territories.blend
    ui_elements.blend
  /textures
    /cards
      card_front.png
      card_back.png
      faction_icons.png
    /territories
      territory_textures.png
      control_overlays.png
    /ui
      ui_elements.png
  /exports
    /cards
      card_front.glb
      card_back.glb
    /territories
      territory_hex.glb
      buildings.glb
    /ui
      ui_elements.glb
```

### Imagen 3.0 Card Generation

```python
# imagen_card_gen.py
# Example script for generating card art with Imagen 3.0

import imagen_api
import os

# Configuration
OUTPUT_DIR = "card_art_output"
FACTION_STYLES = {
    "weyland": "industrial, corporate, brutalist architecture, dark green and black tones",
    "criminal": "sleek, professional, high-tech but subtle, blue tones"
}

CARD_TYPES = {
    "ice": "digital barrier, security system, defensive program",
    "operation": "corporate action, strategic move, business operation",
    "program": "hacking software, digital tool, cyberpunk technology",
    "resource": "underground connection, valuable asset, digital resource"
}

# Card definitions
cards_to_generate = [
    {
        "name": "Titanium Wall",
        "faction": "weyland",
        "type": "ice",
        "description": "A massive digital barrier, resembling an industrial titanium wall"
    },
    {
        "name": "Inside Job",
        "faction": "criminal",
        "type": "program",
        "description": "A sleek hacking tool bypassing corporate security"
    },
    # More card definitions
]

# Generate card art
def generate_card_art():
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)
        
    for card in cards_to_generate:
        prompt = f"{card['description']}, {FACTION_STYLES[card['faction']]}, {CARD_TYPES[card['type']]}, cyberpunk, detailed, digital art style"
        
        # Call Imagen API
        response = imagen_api.generate_image(prompt)
        
        # Save image
        output_path = os.path.join(OUTPUT_DIR, f"{card['name'].lower().replace(' ', '_')}.png")
        with open(output_path, "wb") as f:
            f.write(response.image_data)
        
        print(f"Generated image for '{card['name']}' at {output_path}")

if __name__ == "__main__":
    generate_card_art()
```

### Blender Card Template

```python
# blender_card_template.py
# Example script for creating card templates in Blender

import bpy
import os

# Configuration
CARD_WIDTH = 2.5
CARD_HEIGHT = 3.5
CARD_THICKNESS = 0.1
TEXTURE_PATH = "./textures/cards/"
EXPORT_PATH = "./exports/cards/"

# Create card template
def create_card_template():
    # Delete default cube
    bpy.ops.object.delete()
    
    # Create card mesh
    bpy.ops.mesh.primitive_cube_add(size=1)
    card = bpy.context.active_object
    card.name = "Card_Template"
    
    # Set dimensions
    card.scale.x = CARD_WIDTH / 2
    card.scale.y = CARD_HEIGHT / 2
    card.scale.z = CARD_THICKNESS / 2
    
    # Create materials
    create_card_materials()
    
    # Set up UV mapping
    bpy.ops.object.editmode_toggle()
    bpy.ops.mesh.select_all(action='SELECT')
    bpy.ops.uv.unwrap()
    bpy.ops.object.editmode_toggle()
    
    # Save template
    bpy.ops.wm.save_as_mainfile(filepath="./source_files/card_template.blend")
    
    # Export template
    bpy.ops.export_scene.gltf(filepath=os.path.join(EXPORT_PATH, "card_template.glb"))

def create_card_materials():
    # Create front material
    front_mat = bpy.data.materials.new(name="Card_Front")
    front_mat.use_nodes = True
    
    # Create back material
    back_mat = bpy.data.materials.new(name="Card_Back")
    back_mat.use_nodes = True
    
    # Assign materials to card
    card = bpy.context.active_object
    card.data.materials.append(front_mat)
    card.data.materials.append(back_mat)
    
    # Load textures
    load_textures(front_mat, "card_front.png")
    load_textures(back_mat, "card_back.png")

def load_textures(material, texture_name):
    nodes = material.node_tree.nodes
    principled = nodes.get("Principled BSDF")
    
    # Create image texture node
    tex_node = nodes.new("ShaderNodeTexImage")
    tex_node.image = bpy.data.images.load(os.path.join(TEXTURE_PATH, texture_name))
    
    # Connect texture to principled shader
    material.node_tree.links.new(
        tex_node.outputs["Color"],
        principled.inputs["Base Color"]
    )

if __name__ == "__main__":
    create_card_template()
```

### Exporting Assets from Blender to Godot

```python
# export_assets.py
# Script to batch export assets from Blender to Godot format

import bpy
import os

# Configuration
EXPORT_FORMATS = ["glb", "obj"]
EXPORT_DIR = "./exports/"
ASSET_TYPES = ["cards", "territories", "ui"]

def export_all_assets():
    # Create export directories if they don't exist
    for asset_type in ASSET_TYPES:
        dir_path = os.path.join(EXPORT_DIR, asset_type)
        if not os.path.exists(dir_path):
            os.makedirs(dir_path)
    
    # Select all objects
    bpy.ops.object.select_all(action='SELECT')
    
    # Export by collection
    for collection in bpy.data.collections:
        asset_type = collection.name.split("_")[0].lower()
        if asset_type in ASSET_TYPES:
            # Deselect all
            bpy.ops.object.select_all(action='DESELECT')
            
            # Select objects in collection
            for obj in collection.objects:
                obj.select_set(True)
            
            # Export selected objects
            export_path = os.path.join(EXPORT_DIR, asset_type, f"{collection.name}")
            
            # Export in GLB format
            bpy.ops.export_scene.gltf(
                filepath=f"{export_path}.glb",
                export_format='GLB',
                use_selection=True
            )
            
            # Export in OBJ format if needed
            if "obj" in EXPORT_FORMATS:
                bpy.ops.export_scene.obj(
                    filepath=f"{export_path}.obj",
                    use_selection=True
                )
            
            print(f"Exported {collection.name} to {export_path}")

if __name__ == "__main__":
    export_all_assets()
```

### Godot Import Settings

```gdscript
# asset_importer.gd
# Script to automate asset import in Godot

class_name AssetImporter
extends Node

const ASSET_PATHS = {
    "cards": "res://assets/cards/",
    "territories": "res://assets/territories/",
    "ui": "res://assets/ui/"
}

func _ready() -> void:
    import_assets()

func import_assets() -> void:
    for category in ASSET_PATHS.keys():
        var dir = Directory.new()
        if dir.open(ASSET_PATHS[category]) == OK:
            dir.list_dir_begin(true, true)
            var file_name = dir.get_next()
            while file_name != "":
                if file_name.ends_with(".glb") or file_name.ends_with(".obj"):
                    import_3d_asset(ASSET_PATHS[category] + file_name)
                elif file_name.ends_with(".png") or file_name.ends_with(".jpg"):
                    import_texture(ASSET_PATHS[category] + file_name)
                file_name = dir.get_next()
            dir.list_dir_end()

func import_3d_asset(path: String) -> void:
    var importer = EditorSceneImporter.new()
    var scene = importer.import_scene(path, 0, 20)
    
    if scene:
        var save_path = path.replace(".glb", ".tscn").replace(".obj", ".tscn")
        var error = ResourceSaver.save(save_path, scene)
        if error == OK:
            print("Successfully imported and saved: " + save_path)
        else:
            print("Failed to save scene: " + save_path)
    else:
        print("Failed to import: " + path)

func import_texture(path: String) -> void:
    var image = Image.new()
    var error = image.load(path)
    
    if error == OK:
        var texture = ImageTexture.new()
        texture.create_from_image(image)
        
        var save_path = path.replace(".png", ".tres").replace(".jpg", ".tres")
        error = ResourceSaver.save(save_path, texture)
        
        if error == OK:
            print("Successfully imported and saved texture: " + save_path)
        else:
            print("Failed to save texture: " + save_path)
    else:
        print("Failed to load image: " + path)
```

---

## Final Integration & Polish Phase

This phase focuses on integrating all components and optimizing performance.

### Integration Strategy

```gdscript
# integration_manager.gd
class_name IntegrationManager
extends Node

var spacetime_manager: SpacetimeManager
var card_manager: CardManager
var territory_manager: HexGridController
var mission_manager: MissionController
var ui_manager: UIManager

func _ready() -> void:
    initialize_managers()
    connect_signals()
    load_assets()
    start_game()

func initialize_managers() -> void:
    spacetime_manager = SpacetimeManager.new()
    add_child(spacetime_manager)
    
    card_manager = CardManager.new()
    add_child(card_manager)
    
    territory_manager = HexGridController.new()
    add_child(territory_manager)
    
    mission_manager = MissionController.new()
    add_child(mission_manager)
    
    ui_manager = UIManager.new()
    add_child(ui_manager)

func connect_signals() -> void:
    # Connect SpacetimeDB signals
    spacetime_manager.connect("connection_established", self, "_on_connection_established")
    spacetime_manager.connect("connection_failed", self, "_on_connection_failed")
    spacetime_manager.connect("state_updated", self, "_on_state_updated")
    
    # Connect game system signals
    EventBus.connect("card_played", self, "_on_card_played")
    EventBus.connect("territory_control_changed", self, "_on_territory_control_changed")
    EventBus.connect("mission_initiated", self, "_on_mission_initiated")
    EventBus.connect("mission_completed", self, "_on_mission_completed")
    
    # Connect UI signals
    ui_manager.connect("card_selected", self, "_on_card_selected")
    ui_manager.connect("territory_selected", self, "_on_territory_selected")
    ui_manager.connect("end_turn_pressed", self, "_on_end_turn_pressed")

func load_assets() -> void:
    # Load card assets
    card_manager.
    card_manager.load_card_data("res://assets/data/cards.json")
    card_manager.load_card_assets("res://assets/cards/")
    
    # Load territory assets
    territory_manager.load_territory_data("res://assets/data/territories.json")
    territory_manager.load_territory_assets("res://assets/territories/")
    
    # Load mission assets
    mission_manager.load_mission_data("res://assets/data/missions.json")
    mission_manager.load_mission_assets("res://assets/missions/")
    
    # Load UI assets
    ui_manager.load_ui_assets("res://assets/ui/")

func start_game() -> void:
    # Initialize the game state
    spacetime_manager.initialize_connection()
    ui_manager.show_main_menu()

# Signal handlers
func _on_connection_established(identity) -> void:
    ui_manager.update_connection_status(true, identity)
    
func _on_connection_failed(error) -> void:
    ui_manager.update_connection_status(false, error)
    
func _on_state_updated() -> void:
    territory_manager.update_territories(spacetime_manager.get_territories())
    card_manager.update_cards(spacetime_manager.get_cards())
    ui_manager.update_player_info(spacetime_manager.get_player_info())
    
func _on_card_played(card_id, player_id, target_id) -> void:
    # Handle card played event
    var card = card_manager.get_card(card_id)
    var player = spacetime_manager.get_player(player_id)
    
    if player.identity == spacetime_manager.get_identity():
        ui_manager.animate_card_played(card)
    
    # Apply card effects
    apply_card_effects(card, target_id)
    
func _on_territory_control_changed(territory_id, faction, amount) -> void:
    territory_manager.update_territory_control(territory_id, faction, amount)
    ui_manager.update_territory_display()
    
func _on_mission_initiated(territory_id, player_id, mission_type) -> void:
    if player_id == spacetime_manager.get_identity():
        ui_manager.show_mission_view()
        mission_manager.start_mission(territory_id, mission_type)
    
func _on_mission_completed(territory_id, player_id, success, rewards) -> void:
    if success:
        ui_manager.show_mission_success(rewards)
    else:
        ui_manager.show_mission_failure()
    
    ui_manager.hide_mission_view()
    territory_manager.update_territory_after_mission(territory_id, success)

# Helper methods
func apply_card_effects(card, target_id = null) -> void:
    match card.card_type:
        "ice":
            mission_manager.add_ice(card, target_id)
        "operation":
            execute_operation(card, target_id)
        "program":
            mission_manager.install_program(card)
        "asset":
            territory_manager.add_asset(card, target_id)
        "event":
            execute_event(card)
        # Additional card types

func execute_operation(card, target_id = null) -> void:
    # Handle operation card effects
    pass
    
func execute_event(card) -> void:
    # Handle event card effects
    pass
```

### Performance Optimization

```gdscript
# performance_optimizer.gd
class_name PerformanceOptimizer
extends Node

const TARGET_FPS = 60
const MONITORING_INTERVAL = 2.0  # seconds

var fps_history: Array = []
var optimization_level: int = 0
var monitoring_timer: Timer

func _ready() -> void:
    monitoring_timer = Timer.new()
    add_child(monitoring_timer)
    monitoring_timer.wait_time = MONITORING_INTERVAL
    monitoring_timer.connect("timeout", self, "_on_monitoring_timer_timeout")
    monitoring_timer.start()

func _on_monitoring_timer_timeout() -> void:
    var current_fps = Performance.get_monitor(Performance.TIME_FPS)
    fps_history.append(current_fps)
    
    # Keep history limited to last 10 samples
    if fps_history.size() > 10:
        fps_history.pop_front()
    
    # Calculate average FPS
    var avg_fps = 0
    for fps in fps_history:
        avg_fps += fps
    avg_fps /= fps_history.size()
    
    # Adjust optimization level if needed
    if avg_fps < TARGET_FPS * 0.8:  # Below 80% of target
        increase_optimization_level()
    elif avg_fps > TARGET_FPS * 0.95 and optimization_level > 0:  # Above 95% of target
        decrease_optimization_level()

func increase_optimization_level() -> void:
    optimization_level += 1
    apply_optimization_settings()

func decrease_optimization_level() -> void:
    optimization_level -= 1
    apply_optimization_settings()

func apply_optimization_settings() -> void:
    match optimization_level:
        0:  # Default settings
            Engine.target_fps = TARGET_FPS
            get_viewport().shadow_atlas_size = 4096
            get_viewport().msaa = Viewport.MSAA_4X
            
            # Card rendering quality
            var card_manager = get_node("/root/Game/CardManager")
            if card_manager:
                card_manager.set_card_quality(1.0)  # Full quality
                
            # Particle effects
            var particles_enabled = true
            get_tree().call_group("particles", "set_emitting", particles_enabled)
            
        1:  # Medium optimization
            Engine.target_fps = TARGET_FPS
            get_viewport().shadow_atlas_size = 2048
            get_viewport().msaa = Viewport.MSAA_2X
            
            # Card rendering quality
            var card_manager = get_node("/root/Game/CardManager")
            if card_manager:
                card_manager.set_card_quality(0.8)  # 80% quality
                
            # Reduce particle count
            get_tree().call_group("particles", "set_amount", 0.5)  # 50% particles
            
        2:  # High optimization
            Engine.target_fps = 30  # Reduce target FPS
            get_viewport().shadow_atlas_size = 1024
            get_viewport().msaa = Viewport.MSAA_DISABLED
            
            # Card rendering quality
            var card_manager = get_node("/root/Game/CardManager")
            if card_manager:
                card_manager.set_card_quality(0.5)  # 50% quality
                
            # Disable particles
            var particles_enabled = false
            get_tree().call_group("particles", "set_emitting", particles_enabled)
            
        3:  # Maximum optimization
            Engine.target_fps = 30
            get_viewport().shadow_atlas_size = 0  # Disable shadows
            get_viewport().msaa = Viewport.MSAA_DISABLED
            
            # Card rendering quality
            var card_manager = get_node("/root/Game/CardManager")
            if card_manager:
                card_manager.set_card_quality(0.3)  # 30% quality
                
            # Disable all visual effects
            get_tree().call_group("effects", "hide")
            get_tree().call_group("particles", "set_emitting", false)
            
            # Reduce territory detail
            var territory_manager = get_node("/root/Game/TerritoryManager")
            if territory_manager:
                territory_manager.set_detail_level(0)  # Minimal detail
```

### Memory Management

```gdscript
# memory_manager.gd
class_name MemoryManager
extends Node

const TEXTURE_CACHE_SIZE = 50
const MAX_AUDIO_PLAYERS = 8

var texture_cache: Dictionary = {}
var texture_cache_queue: Array = []
var audio_players: Array = []
var audio_player_index: int = 0

func _ready() -> void:
    # Initialize audio players
    for i in range(MAX_AUDIO_PLAYERS):
        var player = AudioStreamPlayer.new()
        add_child(player)
        audio_players.append(player)

func get_texture(path: String) -> Texture:
    # Check if texture is in cache
    if texture_cache.has(path):
        # Move to end of queue (most recently used)
        texture_cache_queue.erase(path)
        texture_cache_queue.append(path)
        return texture_cache[path]
    
    # Load texture
    var texture = load(path)
    
    # Add to cache
    texture_cache[path] = texture
    texture_cache_queue.append(path)
    
    # Manage cache size
    if texture_cache_queue.size() > TEXTURE_CACHE_SIZE:
        var oldest_path = texture_cache_queue.pop_front()
        texture_cache.erase(oldest_path)
    
    return texture

func play_sound(stream_path: String, volume_db: float = 0.0, pitch_scale: float = 1.0) -> void:
    # Get next available audio player
    var player = audio_players[audio_player_index]
    audio_player_index = (audio_player_index + 1) % MAX_AUDIO_PLAYERS
    
    # Stop current sound if playing
    if player.playing:
        player.stop()
    
    # Load and play new sound
    var stream = load(stream_path)
    player.stream = stream
    player.volume_db = volume_db
    player.pitch_scale = pitch_scale
    player.play()

func clear_texture_cache() -> void:
    texture_cache.clear()
    texture_cache_queue.clear()

func preload_textures(paths: Array) -> void:
    for path in paths:
        get_texture(path)

func stop_all_sounds() -> void:
    for player in audio_players:
        player.stop()
```

### Browser Optimizations

```typescript
// browser_optimizer.ts
export class BrowserOptimizer {
  private static readonly STORAGE_KEY = 'end-of-line-settings';
  private frameRequestId: number | null = null;
  private lastFrameTime: number = 0;
  private frameCount: number = 0;
  private frameCountStart: number = 0;
  private fpsElement: HTMLElement | null = null;
  private settings: GameSettings = {
    graphicsQuality: 'medium',
    enableParticles: true,
    enableSounds: true,
    showFps: false
  };
  
  constructor() {
    this.loadSettings();
    this.setupFpsCounter();
    this.applySettings();
  }
  
  private loadSettings(): void {
    const savedSettings = localStorage.getItem(BrowserOptimizer.STORAGE_KEY);
    if (savedSettings) {
      try {
        this.settings = JSON.parse(savedSettings);
      } catch (e) {
        console.error('Failed to parse saved settings:', e);
      }
    }
  }
  
  private saveSettings(): void {
    localStorage.setItem(BrowserOptimizer.STORAGE_KEY, JSON.stringify(this.settings));
  }
  
  private setupFpsCounter(): void {
    if (this.settings.showFps) {
      this.fpsElement = document.createElement('div');
      this.fpsElement.id = 'fps-counter';
      this.fpsElement.style.position = 'fixed';
      this.fpsElement.style.top = '5px';
      this.fpsElement.style.right = '5px';
      this.fpsElement.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
      this.fpsElement.style.color = 'white';
      this.fpsElement.style.padding = '5px';
      this.fpsElement.style.borderRadius = '3px';
      this.fpsElement.style.fontFamily = 'monospace';
      this.fpsElement.style.zIndex = '9999';
      document.body.appendChild(this.fpsElement);
      
      this.startFpsCounter();
    }
  }
  
  private startFpsCounter(): void {
    this.frameCountStart = performance.now();
    this.frameCount = 0;
    
    const updateFps = (timestamp: number) => {
      this.frameCount++;
      
      // Update once per second
      if (timestamp - this.frameCountStart >= 1000) {
        const fps = Math.round((this.frameCount * 1000) / (timestamp - this.frameCountStart));
        
        if (this.fpsElement) {
          this.fpsElement.textContent = `${fps} FPS`;
          
          // Color code based on performance
          if (fps >= 55) {
            this.fpsElement.style.color = '#8F8';
          } else if (fps >= 30) {
            this.fpsElement.style.color = '#FF8';
          } else {
            this.fpsElement.style.color = '#F88';
          }
        }
        
        this.frameCount = 0;
        this.frameCountStart = timestamp;
      }
      
      this.frameRequestId = requestAnimationFrame(updateFps);
    };
    
    this.frameRequestId = requestAnimationFrame(updateFps);
  }
  
  private stopFpsCounter(): void {
    if (this.frameRequestId !== null) {
      cancelAnimationFrame(this.frameRequestId);
      this.frameRequestId = null;
    }
    
    if (this.fpsElement && this.fpsElement.parentNode) {
      this.fpsElement.parentNode.removeChild(this.fpsElement);
      this.fpsElement = null;
    }
  }
  
  public applySettings(): void {
    // Apply graphics quality
    if (typeof window.godot !== 'undefined') {
      // Send settings to Godot
      window.godot.setGraphicsQuality(this.settings.graphicsQuality);
      window.godot.setParticlesEnabled(this.settings.enableParticles);
      window.godot.setSoundEnabled(this.settings.enableSounds);
    }
    
    // Update FPS counter visibility
    if (this.settings.showFps && !this.fpsElement) {
      this.setupFpsCounter();
    } else if (!this.settings.showFps && this.fpsElement) {
      this.stopFpsCounter();
    }
    
    // Save settings
    this.saveSettings();
  }
  
  public setGraphicsQuality(quality: 'low' | 'medium' | 'high'): void {
    this.settings.graphicsQuality = quality;
    this.applySettings();
  }
  
  public setParticlesEnabled(enabled: boolean): void {
    this.settings.enableParticles = enabled;
    this.applySettings();
  }
  
  public setSoundEnabled(enabled: boolean): void {
    this.settings.enableSounds = enabled;
    this.applySettings();
  }
  
  public setShowFps(show: boolean): void {
    this.settings.showFps = show;
    this.applySettings();
  }
}

interface GameSettings {
  graphicsQuality: 'low' | 'medium' | 'high';
  enableParticles: boolean;
  enableSounds: boolean;
  showFps: boolean;
}
```

---

## Testing Strategy

This section outlines the testing approach for End of Line, focusing on test-driven development.

### Unit Testing with GUT

```gdscript
# tests/unit/card_tests.gd
extends "res://addons/gut/test.gd"

var card_manager = null
var test_card_data = {
    "id": 1,
    "name": "Test Card",
    "card_type": "operation",
    "faction": "weyland",
    "cost": 3,
    "text": "This is a test card."
}

func before_each():
    # Create a fresh CardManager instance for each test
    card_manager = CardManager.new()
    add_child(card_manager)
    
    # Mock the card database
    card_manager.card_database = {
        1: test_card_data
    }

func after_each():
    # Clean up
    card_manager.queue_free()
    card_manager = null

func test_draw_card():
    # Test drawing a card
    var card = card_manager.draw_card(1)
    
    # Assertions
    assert_not_null(card, "Card should not be null")
    assert_eq(card.id, 1, "Card ID should match")
    assert_eq(card.name, "Test Card", "Card name should match")
    assert_eq(card.card_type, "operation", "Card type should match")
    assert_eq(card_manager.hand_size(), 1, "Hand size should be 1")

func test_play_card():
    # Setup
    var card = card_manager.draw_card(1)
    
    # Test playing a card
    card_manager.play_card(card)
    
    # Assertions
    assert_eq(card_manager.hand_size(), 0, "Hand should be empty after playing card")
    assert_eq(card_manager.discard_pile_size(), 1, "Discard pile should have 1 card")

func test_insufficient_resources():
    # Setup
    var card = card_manager.draw_card(1)
    card_manager.player_credits = 2  # Less than card cost (3)
    
    # Test playing a card with insufficient resources
    var result = card_manager.can_play_card(card)
    
    # Assertions
    assert_false(result, "Should not be able to play card with insufficient resources")
```

### Integration Testing

```gdscript
# tests/integration/gameplay_tests.gd
extends "res://addons/gut/test.gd"

var game_manager = null
var card_manager = null
var territory_manager = null
var player = null

func before_each():
    # Create game systems
    game_manager = GameManager.new()
    add_child(game_manager)
    
    # Get references to subsystems
    card_manager = game_manager.card_manager
    territory_manager = game_manager.territory_manager
    
    # Setup player
    player = Player.new()
    player.faction = "weyland"
    player.credits = 10
    game_manager.set_player(player)
    
    # Initialize test data
    game_manager.initialize_test_data()

func after_each():
    # Clean up
    game_manager.queue_free()
    game_manager = null
    card_manager = null
    territory_manager = null
    player = null

func test_play_card_territory_effect():
    # Draw a card that affects territories
    var card = card_manager.draw_specific_card("Corporate Expansion")
    assert_not_null(card, "Should be able to draw the test card")
    
    # Select a territory
    var territory = territory_manager.get_territory_at(0, 0)
    assert_not_null(territory, "Territory should exist")
    
    # Record initial control value
    var initial_control = territory.corporate_influence
    
    # Play card targeting the territory
    game_manager.play_card(card, territory)
    
    # Verify territory control increased
    assert_gt(territory.corporate_influence, initial_control, 
        "Territory control should increase after playing Corporate Expansion")
    
    # Verify credit cost was deducted
    assert_eq(player.credits, 10 - card.cost, "Credits should be deducted")

func test_mission_execution():
    # Setup mission prerequisites
    var territory = territory_manager.get_territory_at(1, 1)
    territory.security_level = 2
    
    # Start a mission
    var mission_result = game_manager.start_mission(territory, "standard")
    assert_true(mission_result, "Mission should start successfully")
    
    # Verify mission state
    assert_true(game_manager.is_in_mission(), "Should be in mission state")
    
    # Install a breaker program
    var program = card_manager.draw_specific_card("Decoder")
    game_manager.install_program(program)
    
    # Encounter ICE
    var ice = game_manager.get_current_ice()
    assert_not_null(ice, "Should encounter ICE")
    
    # Break ICE
    var break_result = game_manager.break_ice(program, ice)
    assert_true(break_result, "Should break ICE successfully")
    
    # Complete mission
    var mission_success = game_manager.complete_mission()
    assert_true(mission_success, "Mission should complete successfully")
    
    # Verify mission rewards
    assert_gt(player.credits, 10, "Should receive credits as reward")
    assert_eq(territory.corporate_influence, territory.corporate_influence - 10, 
        "Territory control should decrease after successful run")
```

### Performance Testing

```gdscript
# tests/performance/rendering_benchmark.gd
extends "res://addons/gut/test.gd"

var performance_test_scene = null
var frame_times = []
var test_duration = 5.0  # seconds
var test_timer = 0.0

func before_all():
    # Load test scene
    performance_test_scene = load("res://tests/performance/test_scenes/rendering_benchmark.tscn").instance()
    add_child(performance_test_scene)
    
    # Configure for testing
    performance_test_scene.set_card_count(50)  # Test with 50 cards
    performance_test_scene.set_territory_count(9)  # Test with 9 territories
    
    # Setup frame time monitoring
    get_tree().connect("idle_frame", self, "_on_idle_frame")
    
    # Start test
    test_timer = 0.0
    frame_times.clear()

func after_all():
    # Disconnect signal
    get_tree().disconnect("idle_frame", self, "_on_idle_frame")
    
    # Clean up
    performance_test_scene.queue_free()
    performance_test_scene = null
    
    # Report results
    var avg_frame_time = 0.0
    for t in frame_times:
        avg_frame_time += t
    
    if frame_times.size() > 0:
        avg_frame_time /= frame_times.size()
        var avg_fps = 1.0 / avg_frame_time if avg_frame_time > 0 else 0
        
        print("Performance Results:")
        print("- Average frame time: %.2f ms" % (avg_frame_time * 1000.0))
        print("- Average FPS: %.1f" % avg_fps)
        print("- Frame count: %d" % frame_times.size())
        print("- Duration: %.2f seconds" % test_timer)
        
        # Add assertions for performance requirements
        assert_lt(avg_frame_time, 1.0/30.0, "Average frame time should be less than 33.3 ms (30 FPS)")

func _process(delta):
    test_timer += delta
    
    if test_timer >= test_duration:
        # Stop test
        get_tree().disconnect("idle_frame", self, "_on_idle_frame")
        
        # Proceed with test completion in after_all
        gut.p("Performance test completed")

func _on_idle_frame():
    var frame_time = Performance.get_monitor(Performance.TIME_PROCESS)
    frame_times.append(frame_time)
```

### Network Testing

```gdscript
# tests/network/spacetime_connection_tests.gd
extends "res://addons/gut/test.gd"

var spacetime_manager = null
var mock_server = null

func before_each():
    # Create mock server
    mock_server = MockSpacetimeServer.new()
    add_child(mock_server)
    mock_server.start()
    
    # Create SpacetimeManager
    spacetime_manager = SpacetimeManager.new()
    add_child(spacetime_manager)
    
    # Configure to use mock server
    spacetime_manager.server_uri = "ws://localhost:" + str(mock_server.port)
    spacetime_manager.module_name = "test_module"

func after_each():
    # Clean up
    spacetime_manager.queue_free()
    spacetime_manager = null
    
    mock_server.stop()
    mock_server.queue_free()
    mock_server = null

func test_connection():
    # Connect to mock server
    var connected = false
    spacetime_manager.connect("connection_established", self, "_on_connection_established")
    
    # Attempt connection
    spacetime_manager.initialize_connection()
    
    # Wait for connection (timeout after 5 seconds)
    var timeout = 5.0
    var timer = 0.0
    while !connected and timer < timeout:
        yield(yield_for(0.1), YIELD)
        timer += 0.1
    
    # Assertions
    assert_true(connected, "Should connect to mock server")
    assert_true(spacetime_manager.connected, "SpacetimeManager should report connected state")

func test_subscription():
    # Connect to mock server
    spacetime_manager.initialize_connection()
    yield(yield_for(0.5), YIELD)
    
    # Set up mock data
    var test_cards = [
        { "id": 1, "name": "Test Card 1", "card_type": "ice", "faction": "weyland" },
        { "id": 2, "name": "Test Card 2", "card_type": "operation", "faction": "weyland" }
    ]
    mock_server.set_table_data("card", test_cards)
    
    # Subscribe to data
    var subscription_applied = false
    spacetime_manager.connect("state_updated", self, "_on_state_updated")
    spacetime_manager.subscribe_to_table("card")
    
    # Wait for subscription (timeout after 5 seconds)
    var timeout = 5.0
    var timer = 0.0
    while !subscription_applied and timer < timeout:
        yield(yield_for(0.1), YIELD)
        timer += 0.1
    
    # Assertions
    assert_true(subscription_applied, "Subscription should be applied")
    assert_eq(spacetime_manager.get_cards().size(), 2, "Should receive 2 cards from mock server")

func test_reducer_call():
    # Connect to mock server
    spacetime_manager.initialize_connection()
    yield(yield_for(0.5), YIELD)
    
    # Record initial state
    var reducer_called = false
    mock_server.connect("reducer_called", self, "_on_reducer_called")
    
    # Call reducer
    spacetime_manager.call_reducer("play_card", [1, null])
    
    # Wait for reducer call (timeout after 5 seconds)
    var timeout = 5.0
    var timer = 0.0
    while !reducer_called and timer < timeout:
        yield(yield_for(0.1), YIELD)
        timer += 0.1
    
    # Assertions
    assert_true(reducer_called, "Reducer should be called on mock server")
    assert_eq(mock_server.last_reducer_name, "play_card", "Correct reducer should be called")
    assert_eq(mock_server.last_reducer_args[0], 1, "Reducer args should match")

# Signal handlers
func _on_connection_established(_identity):
    connected = true

func _on_state_updated():
    subscription_applied = true

func _on_reducer_called():
    reducer_called = true
```

### Test Automation

```shell
# test_automation.sh
#!/bin/bash

echo "Running End of Line test suite..."

# Set up environment
export GODOT_BIN="godot"
export TEST_RESULTS_DIR="test_results"

mkdir -p $TEST_RESULTS_DIR

# Function to run tests and collect results
run_test_suite() {
    local suite_name=$1
    local test_scene=$2
    
    echo "Running $suite_name tests..."
    
    $GODOT_BIN --path . --script res://tests/run_tests.gd --test-scene=$test_scene \
        --no-window --quit --exports-results-to-file=$TEST_RESULTS_DIR/${suite_name}_results.json
        
    if [ $? -eq 0 ]; then
        echo "✓ $suite_name tests passed"
    else
        echo "✗ $suite_name tests failed"
        FAILED_TESTS=1
    fi
}

# Run different test suites
run_test_suite "unit" "res://tests/unit/unit_test_suite.tscn"
run_test_suite "integration" "res://tests/integration/integration_test_suite.tscn"
run_test_suite "performance" "res://tests/performance/performance_test_suite.tscn"
run_test_suite "network" "res://tests/network/network_test_suite.tscn"

# Generate combined report
echo "Generating test report..."
$GODOT_BIN --path . --script res://tests/generate_report.gd \
    --results-dir=$TEST_RESULTS_DIR --output=$TEST_RESULTS_DIR/report.html --no-window --quit

echo "Test report generated at $TEST_RESULTS_DIR/report.html"

# Exit with status code
if [ $FAILED_TESTS -eq 1 ]; then
    exit 1
else
    exit 0
fi
```

---

## Troubleshooting Guide

This section provides guidance for resolving common issues during development.

### SpacetimeDB Connection Issues

| Issue | Resolution |
|-------|------------|
| Connection Timeout | Check if the SpacetimeDB server is running correctly. Ensure the correct URI is specified. Try increasing the connection timeout in the SpacetimeManager. |
| Authentication Failed | Verify the token is correctly stored and provided. Check if the token has expired and needs to be refreshed. |
| Subscription Error | Ensure SQL queries are correctly formatted. Check that the table names and column references are valid. |

Example fix for connection timeout:

```gdscript
# Increase connection timeout
const CONNECTION_TIMEOUT = 10.0  # seconds

func initialize_connection() -> void:
    # Start timeout timer
    var timeout_timer = Timer.new()
    add_child(timeout_timer)
    timeout_timer.wait_time = CONNECTION_TIMEOUT
    timeout_timer.one_shot = true
    timeout_timer.connect("timeout", self, "_on_connection_timeout")
    timeout_timer.start()
    
    # Attempt connection
    db_connection = DbConnection.builder()\
        .with_uri("ws://localhost:3000")\
        .with_module_name("end-of-line")\
        .on_connect(func(conn, identity, token): 
            timeout_timer.queue_free()
            _on_connect(conn, identity, token)
        )\
        .on_connect_error(func(error_ctx, error):
            timeout_timer.queue_free()
            _on_connect_error(error_ctx, error)
        )\
        .on_disconnect(_on_disconnect)\
        .build()

func _on_connection_timeout() -> void:
    emit_signal("connection_failed", "Connection timeout")
    
    # Retry connection
    initialize_connection()
```

### Asset Loading Issues

| Issue | Resolution |
|-------|------------|
| Missing Assets | Check file paths for typos. Ensure assets are properly exported from Blender. Verify assets are included in the project. |
| Import Errors | Check import settings in Godot. Ensure correct export settings in Blender. Try re-exporting with different format options. Verify texture paths and materials. |
| Texture Issues | Check texture compression settings. Ensure correct UV mapping. Verify texture files exist in the expected locations. Try different texture formats. |

Example fix for texture issues:

```gdscript
# Texture fallback system
func get_texture(path: String) -> Texture:
    var texture = load(path)
    if texture == null:
        # Try alternative formats
        var alternative_formats = [".png", ".jpg", ".webp"]
        var base_path = path.substr(0, path.find_last("."))
        
        for format in alternative_formats:
            var alt_path = base_path + format
            texture = load(alt_path)
            if texture != null:
                print("Loaded alternative texture: " + alt_path)
                return texture
        
        # If all attempts fail, load a fallback texture
        print("Failed to load texture: " + path + ", using fallback")
        return load("res://assets/textures/fallback.png")
    
    return texture
```

### Godot and TypeScript Integration Issues

| Issue | Resolution |
|-------|------------|
| Type Errors | Ensure correct typing in TypeScript code. Check generated JS for compatibility issues. Use TypeScript interfaces that match Godot structures. |
| Script Loading Failures | Verify file paths and script names. Check for syntax errors in TypeScript code. Ensure generated JS is properly placed in the Godot project. |
| Communication Errors | Verify signal connections between TS and GDScript. Ensure data structures match between systems. Check for serialization issues. |

Example fix for TypeScript integration:

```typescript
// Adding type declarations for Godot classes
// godot.d.ts

declare namespace godot {
  class Node {
    name: string;
    get_parent(): Node | null;
    add_child(node: Node): void;
    remove_child(node: Node): void;
    queue_free(): void;
    is_queued_for_deletion(): boolean;
    // Other Node methods
  }
  
  class Vector2 {
    x: number;
    y: number;
    constructor(x?: number, y?: number);
    normalized(): Vector2;
    length(): number;
    distance_to(other: Vector2): number;
    // Other Vector2 methods
  }
  
  // Add other Godot classes as needed
}

// Export interfaces to match SpacetimeDB structures
export interface Card {
  id: number;
  name: string;
  card_type: string;
  faction: string;
  cost: number;
  text: string;
}

export interface Territory {
  id: number;
  name: string;
  territory_type: string;
  x: number;
  y: number;
  corporate_influence: number;
  security_level: number;
  resource_value: number;
  stability_index: number;
  population: number;
}

// Type-safe event subscription
class TypedEventBus {
  private static instance: TypedEventBus;
  private eventHandlers: Map<string, Function[]> = new Map();
  
  private constructor() {}
  
  public static getInstance(): TypedEventBus {
    if (!TypedEventBus.instance) {
      TypedEventBus.instance = new TypedEventBus();
    }
    return TypedEventBus.instance;
  }
  
  public emit<T>(event: string, data: T): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.forEach(handler => handler(data));
    }
  }
  
  public on<T>(event: string, handler: (data: T) => void): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event)?.push(handler);
  }
  
  public off(event: string, handler: Function): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index !== -1) {
        handlers.splice(index, 1);
      }
    }
  }
}
```

### Performance Bottlenecks

| Issue | Resolution |
|-------|------------|
| Low FPS | Profile to identify bottlenecks. Reduce draw calls by batching similar objects. Optimize shader complexity. Consider lower quality settings for weaker devices. |
| Memory Leaks | Check for objects not being freed properly. Use weak references for callbacks. Implement proper cleanup in `_exit_tree()`. Monitor memory usage trends. |
| High CPU Usage | Profile script execution time. Optimize expensive calculations. Consider moving heavy logic to worker threads where possible. Cache computed values. |

Example performance optimization for card rendering:

```gdscript
# Optimized card rendering with LOD (Level of Detail)
class_name OptimizedCardRenderer
extends Node

const RENDER_DISTANCE_CLOSE = 300.0
const RENDER_DISTANCE_MEDIUM = 600.0
const RENDER_DISTANCE_FAR = 1000.0

var cards = []
var camera = null

func _ready() -> void:
    camera = get_viewport().get_camera()

func _process(_delta: float) -> void:
    if camera == null:
        return
    
    var camera_pos = camera.global_transform.origin
    
    for card in cards:
        var distance = card.global_transform.origin.distance_to(camera_pos)
        
        # Set LOD based on distance
        if distance < RENDER_DISTANCE_CLOSE:
            # High detail
            card.set_detail_level(2)
            card.show_particles(true)
            card.set_texture_quality(1.0)
        elif distance < RENDER_DISTANCE_MEDIUM:
            # Medium detail
            card.set_detail_level(1)
            card.show_particles(false)
            card.set_texture_quality(0.75)
        elif distance < RENDER_DISTANCE_FAR:
            # Low detail
            card.set_detail_level(0)
            card.show_particles(false)
            card.set_texture_quality(0.5)
        else:
            # Very far, don't render
            card.visible = false
            continue
        
        card.visible = true
```

### Browser-Specific Issues

| Issue | Resolution |
|-------|------------|
| Safari WebGL Issues | Check for Safari-specific WebGL limitations. Use compatible texture formats. Reduce shader complexity for Safari. |
| Mobile Browser Performance | Implement aggressive LOD for mobile. Reduce particle effects and post-processing. Use smaller textures for mobile devices. |
| Cross-Browser Compatibility | Test on all target browsers. Use feature detection instead of browser detection. Provide fallbacks for unsupported features. |

Example cross-browser compatibility code:

```typescript
// browser_compatibility.ts

export class BrowserDetection {
  static isMobile(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }
  
  static isIOS(): boolean {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
  }
  
  static isSafari(): boolean {
    return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  }
  
  static getWebGLCapabilities(): WebGLCapabilities {
    const canvas = document.createElement('canvas');
    let gl: WebGLRenderingContext | null = null;
    
    try {
      gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    } catch (e) {
      return {
        supported: false,
        version: 0,
        maxTextureSize: 0,
        extensions: []
      };
    }
    
    if (!gl) {
      return {
        supported: false,
        version: 0,
        maxTextureSize: 0,
        extensions: []
      };
    }
    
    // Get capabilities
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    const vendor = debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : gl.getParameter(gl.VENDOR);
    const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER);
    const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
    
    // Get available extensions
    const extensions = gl.getSupportedExtensions() || [];
    
    return {
      supported: true,
      version: 1,
      maxTextureSize,
      vendor,
      renderer,
      extensions
    };
  }
  
  static applyCompatibilitySettings(): void {
    const capabilities = this.getWebGLCapabilities();
    
    if (!capabilities.supported) {
      // Show warning for users without WebGL support
      this.showCompatibilityWarning("WebGL is not supported by your browser. The game may not run correctly.");
      return;
    }
    
    // Apply optimal settings based on device
    const settings = {
      textureQuality: 'high',
      effectsQuality: 'high',
      shadowQuality: 'high',
      particlesEnabled: true
    };
    
    if (this.isMobile()) {
      // Reduce quality on mobile
      settings.textureQuality = 'medium';
      settings.effectsQuality = 'low';
      settings.shadowQuality = 'off';
      settings.particlesEnabled = false;
    }
    
    if (this.isSafari()) {
      // Safari-specific optimizations
      settings.shadowQuality = 'low';
    }
    
    // Apply texture size limit
    if (capabilities.maxTextureSize < 4096) {
      settings.textureQuality = 'low';
    }
    
    // Send settings to Godot
    if (typeof window.godot !== 'undefined') {
      window.godot.setGraphicsSettings(settings);
    }
  }
  
  private static showCompatibilityWarning(message: string): void {
    const warningElement = document.createElement('div');
    warningElement.style.position = 'fixed';
    warningElement.style.top = '0';
    warningElement.style.left = '0';
    warningElement.style.width = '100%';
    warningElement.style.padding = '10px';
    warningElement.style.backgroundColor = '#f8d7da';
    warningElement.style.color = '#721c24';
    warningElement.style.textAlign = 'center';
    warningElement.style.zIndex = '9999';
    warningElement.textContent = message;
    
    document.body.appendChild(warningElement);
  }
}

interface WebGLCapabilities {
  supported: boolean;
  version: number;
  maxTextureSize: number;
  vendor?: string;
  renderer?: string;
  extensions: string[];
}
```

### SpacetimeDB State Synchronization Issues

| Issue | Resolution |
|-------|------------|
| State Inconsistency | Implement version checking for state updates. Use two-way verification for critical state changes. Add periodic full state sync. |
| Race Conditions | Use transaction IDs to track state changes. Implement client-side prediction with server correction. Queue state updates and apply in order. |
| Subscription Failures | Add retry logic for subscription errors. Implement fallback to full table queries. Log detailed error information for diagnostics. |

Example state synchronization fix:

```gdscript
# State synchronization manager
class_name StateSyncManager
extends Node

const SYNC_INTERVAL = 30.0  # Full sync every 30 seconds
const MAX_SYNC_RETRIES = 3

var spacetime_manager = null
var sync_timer = null
var state_version = 0
var pending_updates = []
var sync_attempts = 0

func _ready() -> void:
    sync_timer = Timer.new()
    add_child(sync_timer)
    sync_timer.wait_time = SYNC_INTERVAL
    sync_timer.connect("timeout", self, "_on_sync_timer_timeout")
    sync_timer.start()

func initialize(manager) -> void:
    spacetime_manager = manager
    # Connect to signals
    spacetime_manager.connect("state_updated", self, "_on_state_updated")
    spacetime_manager.connect("update_failed", self, "_on_update_failed")

func _on_sync_timer_timeout() -> void:
    # Perform full state synchronization
    perform_full_sync()

func perform_full_sync() -> void:
    sync_attempts = 0
    _attempt_full_sync()

func _attempt_full_sync() -> void:
    sync_attempts += 1
    
    if sync_attempts > MAX_SYNC_RETRIES:
        print("Failed to synchronize state after " + str(MAX_SYNC_RETRIES) + " attempts")
        return
    
    # Request full state synchronization
    spacetime_manager.request_full_sync(state_version, self, "_on_full_sync_complete")

func _on_full_sync_complete(success: bool, new_state_version: int) -> void:
    if success:
        state_version = new_state_version
        sync_attempts = 0
        print("Full state sync completed successfully. New state version: " + str(state_version))
    else:
        # Retry with backoff
        var retry_timer = Timer.new()
        add_child(retry_timer)
        retry_timer.wait_time = pow(2, sync_attempts - 1)  # Exponential backoff
        retry_timer.one_shot = true
        retry_timer.connect("timeout", self, "_attempt_full_sync")
        retry_timer.start()

func _on_state_updated(update_type: String, data) -> void:
    # Handle incremental state updates
    match update_type:
        "card_played":
            handle_card_played_update(data)
        "territory_control_changed":
            handle_territory_update(data)
        "mission_completed":
            handle_mission_update(data)
        # Additional update types

func _on_update_failed(update_type: String, data, error) -> void:
    # Handle failed updates
    print("Update failed: " + update_type + ", Error: " + str(error))
    
    # Add to pending updates queue
    pending_updates.append({
        "type": update_type,
        "data": data
    })
    
    # If this is our first failure, try to reapply updates after a delay
    if pending_updates.size() == 1:
        var retry_timer = Timer.new()
        add_child(retry_timer)
        retry_timer.wait_time = 1.0
        retry_timer.one_shot = true
        retry_timer.connect("timeout", self, "_retry_pending_updates")
        retry_timer.start()

func _retry_pending_updates() -> void:
    if pending_updates.size() == 0:
        return
    
    # Try to reapply all pending updates
    var updates_to_retry = pending_updates.duplicate()
    pending_updates.clear()
    
    for update in updates_to_retry:
        match update.type:
            "card_played":
                spacetime_manager.play_card(update.data.card_id, update.data.target_id)
            "territory_control_changed":
                spacetime_manager.control_territory(update.data.territory_id, update.data.influence)
            # Additional update types
```

### Plugin Integration Issues

| Issue | Resolution |
|-------|------------|
| Plugin Compatibility | Check plugin version compatibility with Godot version. Update plugins to latest versions. Check for conflicts between plugins. |
| HexGrid Issues | Ensure proper initialization of the grid. Check for correct cell indexing. Verify coordinate system usage. |
| Card Framework Errors | Ensure card data format matches framework expectations. Check for required fields in card definitions. Verify signal connections for card interactions. |

Example fix for HexGrid integration:

```gdscript
# HexGrid adapter for compatibility
class_name HexGridAdapter
extends Node

var hex_grid: HexGrid  # The actual HexGrid instance
var coordinate_converter: HexCoordinateConverter

func _ready() -> void:
    initialize_hex_grid()

func initialize_hex_grid() -> void:
    hex_grid = HexGrid.new()
    add_child(hex_grid)
    
    # Initialize with default size
    hex_grid.cell_size = Vector2(64, 64)
    
    # Initialize coordinate converter
    coordinate_converter = HexCoordinateConverter.new()
    coordinate_converter.hex_size = hex_grid.cell_size
    
    # Connect signals
    hex_grid.connect("cell_selected", self, "_on_cell_selected")

func create_grid(width: int, height: int) -> void:
    # Clear existing grid
    for child in hex_grid.get_children():
        if child.has_method("is_territory"):
            hex_grid.remove_child(child)
            child.queue_free()
    
    # Create new grid
    for x in range(width):
        for y in range(height):
            var territory = create_territory_at(x, y)
            var pos = coordinate_converter.hex_to_pixel(Vector2(x, y))
            territory.position = pos
            hex_grid.add_child(territory)

func create_territory_at(x: int, y: int) -> Territory:
    var territory = Territory.new()
    territory.hex_coordinates = Vector2(x, y)
    territory.name = "Territory_" + str(x) + "_" + str(y)
    return territory

func get_territory_at(x: int, y: int) -> Territory:
    for child in hex_grid.get_children():
        if child.has_method("is_territory"):
            var territory = child as Territory
            if territory.hex_coordinates.x == x and territory.hex_coordinates.y == y:
                return territory
    return null

func get_territory_at_position(position: Vector2) -> Territory:
    var hex_coord = coordinate_converter.pixel_to_hex(position)
    return get_territory_at(int(hex_coord.x), int(hex_coord.y))

func get_neighbors(territory: Territory) -> Array:
    var neighbors = []
    var x = int(territory.hex_coordinates.x)
    var y = int(territory.hex_coordinates.y)
    
    # Hex grid neighbor offsets (for pointy top orientation)
    var offsets = [
        Vector2(1, 0), Vector2(0, 1), Vector2(-1, 1),
        Vector2(-1, 0), Vector2(-1, -1), Vector2(0, -1)
    ]
    
    for offset in offsets:
        var neighbor = get_territory_at(x + int(offset.x), y + int(offset.y))
        if neighbor != null:
            neighbors.append(neighbor)
    
    return neighbors

# Coordinate conversion helper
class HexCoordinateConverter:
    var hex_size: Vector2
    
    func pixel_to_hex(pixel: Vector2) -> Vector2:
        var q = (sqrt(3)/3 * pixel.x - 1/3 * pixel.y) / hex_size.x
        var r = (2/3 * pixel.y) / hex_size.y
        return hex_round(Vector2(q, r))
    
    func hex_to_pixel(hex: Vector2) -> Vector2:
        var x = hex_size.x * (sqrt(3) * hex.x + sqrt(3)/2 * hex.y)
        var y = hex_size.y * (3/2 * hex.y)
        return Vector2(x, y)
    
    func hex_round(hex: Vector2) -> Vector2:
        var q = round(hex.x)
        var r = round(hex.y)
        var s = round(-hex.x - hex.y)
        
        var q_diff = abs(q - hex.x)
        var r_diff = abs(r - hex.y)
        var s_diff = abs(s - (-hex.x - hex.y))
        
        if q_diff > r_diff and q_diff > s_diff:
            q = -r - s
        elif r_diff > s_diff:
            r = -q - s
        
        return Vector2(q, r)
```

---

## Performance Considerations

### Optimizing SpacetimeDB Integration

1. **Subscription Optimization**:
   - Subscribe only to necessary tables and rows
   - Use tailored SQL queries with appropriate WHERE clauses
   - Batch subscription requests
   - Prioritize critical state subscriptions

2. **Reducer Call Batching**:
   - Group related reducer calls when possible
   - Implement client-side batching for rapid sequential actions
   - Add throttling for high-frequency actions

3. **State Synchronization**:
   - Implement delta compression for state updates
   - Prioritize critical state changes
   - Use efficient serialization formats
   - Implement client-side prediction for common actions

### Godot Rendering Performance

1. **Card Rendering Optimization**:
   - Implement level-of-detail (LOD) system for cards
   - Use material instance pooling
   - Implement card batching for similar cards
   - Use texture atlases for card elements

2. **Territory Visualization**:
   - Use instanced geometry for repeating elements
   - Implement culling for off-screen territories
   - Use simplified collision shapes
   - Apply LOD for territory details based on camera distance

3. **Effects and Particles**:
   - Limit particle count based on device performance
   - Disable effects on low-performance devices
   - Use particle pooling to reduce instantiation overhead
   - Implement emission rate scaling based on performance metrics

### Memory Management

1. **Asset Loading Strategy**:
   - Implement progressive asset loading
   - Use streaming textures for large assets
   - Implement asset bundles for related content
   - Unload unused assets during scene transitions

2. **Object Pooling**:
   - Implement object pools for frequently created/destroyed objects
   - Pre-allocate pools during loading screens
   - Use pool expansion/contraction based on demand
   - Implement automatic pool cleaning for unused objects

3. **Memory Monitoring**:
   - Implement memory usage tracking
   - Set up automatic memory usage reporting
   - Add memory thresholds for quality adjustments
   - Implement emergency memory cleanup

### Browser-Specific Optimizations

1. **Mobile Performance**:
   - Reduce texture sizes on mobile devices
   - Simplify shader complexity
   - Limit active effects and particles
   - Implement touch-specific UI adjustments

2. **Safari Compatibility**:
   - Ensure texture power-of-two compliance
   - Limit shader complexity
   - Implement WebGL feature detection and fallbacks
   - Test on multiple Safari versions

3. **Progressive Web App Features**:
   - Implement service worker for offline capabilities
   - Use local storage for game state persistence
   - Add manifest for improved mobile experience
   - Implement lazy loading for non-critical assets

The performance considerations outlined above provide guidelines for maintaining optimal performance across various devices and browsers. Implementation should be adjusted based on specific requirements and target platform capabilities.