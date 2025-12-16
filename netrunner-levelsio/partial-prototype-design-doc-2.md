# CyberSphere: Digital Frontiers
## TDD-Ready Design Document

---

## Executive Summary

CyberSphere: Digital Frontiers is a multiplayer roguelike PvPvE deckbuilder-RPG hybrid inspired by the Netrunner LCG. The game features asymmetric gameplay between Corporation and Runner factions, with procedurally generated environments, territory control mechanics, and persistent character progression. This document outlines the technical architecture and interfaces designed for Test-Driven Development.

## Core Architecture

CyberSphere uses a modular architecture with clean interfaces that allow for comprehensive testing. The game is built on Godot 4 and structured around a central GameManager that coordinates independent systems.

### System Dependency Graph

```
                    ┌─────────────┐
                    │ GameManager │
                    └──────┬──────┘
                           │
          ┌────────┬───────┼───────┬────────┐
          │        │       │       │        │
┌─────────▼────┐ ┌─▼─────┐ ┌─▼─────┐ ┌─────▼────────┐
│FactionManager│ │WorldGen│ │Network│ │ProgressionSys│
└──────┬───────┘ └───┬───┘ └───┬───┘ └──────┬───────┘
       │             │         │            │
       │      ┌──────┘    ┌────┘            │
┌──────▼──────┴─┐ ┌───────▼───────┐ ┌───────▼─────────┐
│  CardSystem   │ │TerritorySystem│ │EncounterSystem  │
└──────┬────────┘ └───────┬───────┘ └───────┬─────────┘
       │                  │                 │
       └──────────────────┼─────────────────┘
                          │
                 ┌────────▼────────┐
                 │    AI System    │
                 └────────┬────────┘
                          │
               ┌──────────┴─────────┐
               │ Audio/Visual System│
               └────────────────────┘
```

### Core System Interface

All systems implement a common interface for lifecycle management and testing:

```gdscript
class_name ISystem
extends RefCounted

func initialize() -> bool:
    return true
    
func shutdown() -> void:
    pass
    
func get_dependencies() -> Array[String]:
    return []

func process_frame(delta: float) -> void:
    pass
    
func save_state() -> Dictionary:
    return {}
    
func load_state(state: Dictionary) -> bool:
    return true

func run_tests() -> Dictionary:
    return {"success": false, "message": "Tests not implemented"}
```

## System Interfaces

### 1. Run Interface

The Run interface defines the core asymmetric interaction between Runners and Corporations:

```gdscript
class_name IRunInterface
extends RefCounted

# Run phases
enum RunPhase {
    INITIATION,    # Runner declares the run
    APPROACH,      # Runner approaches a piece of ICE
    ENCOUNTER,     # Runner encounters and resolves ICE
    ACCESS         # Runner accesses server contents
}

# Run outcomes
enum RunOutcome {
    SUCCESS,       # Runner successfully accessed server
    FAILURE,       # Runner failed but survived
    FLATLINED      # Runner was defeated
}

# Run status
class RunStatus:
    var current_phase: RunPhase = RunPhase.INITIATION
    var server_id: String
    var runner_id: String
    var encountered_ice: Array = []
    var broken_ice: Array = []
    var accessed_cards: Array = []
    var runner_programs: Array = []
    var corp_responses: Array = []

# Start a run on a server
func initiate_run(runner_id: String, server_id: String) -> RunStatus:
    pass

# Approach the next piece of ICE
func approach_ice(run_status: RunStatus, ice_id: String) -> RunStatus:
    pass
    
# Encounter current ICE with programs
func encounter_ice(run_status: RunStatus, program_ids: Array) -> RunStatus:
    pass
    
# Corporation responds to the run
func corp_response(run_status: RunStatus, card_id: String) -> RunStatus:
    pass
    
# Access server contents
func access_server(run_status: RunStatus) -> RunStatus:
    pass
    
# End run with outcome
func end_run(run_status: RunStatus, outcome: RunOutcome) -> Dictionary:
    pass
    
# Get available corporation responses
func get_corp_responses(run_status: RunStatus) -> Array:
    pass
    
# Get available runner actions
func get_runner_actions(run_status: RunStatus) -> Array:
    pass
```

### 2. Territory Control Interface

The Territory Control system manages how players influence, capture, and defend locations:

```gdscript
class_name ITerritoryControlInterface
extends RefCounted

# Territory states
enum TerritoryState {
    NEUTRAL,
    CORPORATE_CONTROLLED,
    RUNNER_INFLUENCED,
    CONTESTED,
    CORRUPTED
}

# Structure types for Corporations
enum StructureType {
    SERVER_FARM,   # Increases resource generation
    SECURITY_NODE, # Enhances defense
    R_AND_D_CENTER, # Provides card advantages
    GATEWAY        # Provides connection to other territories
}

# Hack types for Runners
enum HackType {
    BACKDOOR,      # Persistent access with lower influence
    FRONTAL_ATTACK, # Higher influence but shorter duration
    TROJAN,        # Slow influence growth over time
    SPYWARE        # Intelligence gathering
}

# Territory data
class TerritoryData:
    var territory_id: String
    var name: String
    var type: int
    var controller: String = ""  # player_id or "neutral" or "ai"
    var influence: Dictionary = {}  # player_id: influence_value (0-100)
    var state: int = TerritoryState.NEUTRAL
    var structures: Array = []  # Corporation structures
    var hacks: Array = []      # Runner hacks with duration
    var resources: Dictionary = {}  # resource_type: amount generated per turn
    var special_abilities: Array = []
    var connected_territories: Array = []
    var defense_level: int = 0
    var last_state_change_time: int = 0

# Get territory data
func get_territory(territory_id: String) -> TerritoryData:
    pass

# Get all territories
func get_all_territories() -> Array:
    pass

# Get territories controlled by player
func get_player_territories(player_id: String) -> Array:
    pass

# Corporation: Build structure on territory
func build_structure(player_id: String, territory_id: String, structure_type: int) -> Dictionary:
    pass

# Runner: Hack territory
func hack_territory(player_id: String, territory_id: String, hack_type: int) -> Dictionary:
    pass

# Get territory state
func get_territory_state(territory_id: String) -> int:
    pass

# Calculate influence for player on territory
func calculate_influence(player_id: String, territory_id: String) -> float:
    pass

# Update territory control (typically called per game turn)
func update_territory_control() -> Array:
    pass

# Calculate resources generated by territories
func calculate_resource_generation(player_id: String) -> Dictionary:
    pass

# Try to capture territory (reaches control threshold)
func attempt_capture(player_id: String, territory_id: String) -> Dictionary:
    pass

# Check if player can access territory
func can_access_territory(player_id: String, territory_id: String) -> bool:
    pass
```

### 3. Card System Interface

The Card System manages all aspects of cards, decks, and effects:

```gdscript
class_name ICardSystem
extends RefCounted

# Card types
enum CardType {
    # Corporation cards
    ICE,
    ASSET,
    UPGRADE,
    AGENDA,
    OPERATION,
    
    # Runner cards
    HARDWARE,
    PROGRAM,
    RESOURCE,
    EVENT
}

# ICE subtypes
enum IceSubtype {
    BARRIER,    # Stops movement
    CODE_GATE,  # Requires decoder
    SENTRY,     # Deals with programs
    AP,         # Causes damage
    TRACER      # Initiates traces
}

# Program subtypes
enum ProgramSubtype {
    ICEBREAKER, # Breaks ICE
    VIRUS,      # Persistent effects
    AI,         # Versatile breakers
    STEALTH     # Uses stealth resources
}

# Card zones
enum CardZone {
    DECK,
    HAND,
    PLAY,
    DISCARD,
    REMOVED
}

# Card data template
class CardData:
    var id: String
    var name: String
    var type: int
    var faction: String
    var cost: int
    var influence: int
    var text: String
    var unique: bool = false
    var subtypes: Array = []
    var properties: Dictionary = {}
    var effects: Array = []
    var restrictions: Array = []
    var script_path: String = ""

# Card instance (runtime)
class CardInstance:
    var card_id: String
    var instance_id: String
    var owner_id: String
    var controller_id: String
    var zone: int = CardZone.DECK
    var position: int = 0
    var counters: Dictionary = {}
    var modifications: Array = []
    var hosted_cards: Array = []
    var host_card: String = ""
    var revealed: bool = false
    var installed: bool = false

# Effect data
class EffectData:
    var type: String
    var trigger: String
    var target_type: String
    var target_filter: Dictionary = {}
    var value: Variant
    var duration: int = 0
    var conditions: Array = []

# Database functions
func get_card_data(card_id: String) -> CardData:
    pass
    
func search_cards(filters: Dictionary) -> Array:
    pass
    
func get_cards_by_faction(faction: String) -> Array:
    pass
    
# Card instance management
func create_card_instance(card_id: String, owner_id: String) -> CardInstance:
    pass
    
func get_card_instance(instance_id: String) -> CardInstance:
    pass

func move_card(instance_id: String, to_zone: int, position: int = -1) -> bool:
    pass
    
# Card actions
func play_card(player_id: String, instance_id: String, targets: Array = []) -> Dictionary:
    pass
    
func install_card(player_id: String, instance_id: String, server_id: String = "", position: int = -1) -> Dictionary:
    pass
    
func advance_card(player_id: String, instance_id: String) -> Dictionary:
    pass
    
func trash_card(instance_id: String, source_id: String = "") -> Dictionary:
    pass
    
func reveal_card(instance_id: String, to_player_id: String = "") -> Dictionary:
    pass
    
# Effect resolution
func resolve_effect(effect_data: EffectData, source_id: String, target_ids: Array = []) -> Dictionary:
    pass
    
func get_valid_targets(effect_data: EffectData, source_id: String) -> Array:
    pass
    
# Player card collections
func get_player_cards(player_id: String, zone: int) -> Array:
    pass
    
func draw_card(player_id: String) -> CardInstance:
    pass
    
func shuffle_deck(player_id: String) -> void:
    pass
    
# Network serialization
func serialize_card_instance(instance_id: String) -> Dictionary:
    pass
    
func deserialize_card_instance(data: Dictionary) -> CardInstance:
    pass
    
# Testing helpers
func create_test_deck(player_id: String, card_ids: Array) -> void:
    pass
    
func set_card_state(instance_id: String, zone: int, modifications: Array = []) -> void:
    pass
```

### 4. AI System Interface

The AI System manages NPCs and opponent behavior:

```gdscript
class_name IAISystem
extends RefCounted

# AI Difficulty levels
enum AIDifficulty {
    EASY,
    MEDIUM,
    HARD,
    EXPERT
}

# AI Personality traits (0-10 scale)
class AIPersonality:
    var aggression: float = 5.0       # Preference for attacking vs. building
    var economy_focus: float = 5.0    # Resource accumulation vs. spending
    var risk_tolerance: float = 5.0   # Safe plays vs. high-risk/reward
    var tech_preference: Dictionary = {} # Card type preferences
    var position_value: float = 5.0   # Value of board position vs. immediate gain
    var adaptability: float = 5.0     # How quickly AI adjusts to player strategy
    
    # Faction-specific traits
    var faction_traits: Dictionary = {}
    
    # Difficulty modifiers
    var optimal_play_chance: float = 0.7  # Chance to make optimal vs. suboptimal play
    var mistake_frequency: float = 0.2    # Chance to make a deliberate mistake

# AI Decision result
class AIDecision:
    var action_type: String           # Type of action to take
    var target_id: String = ""        # Target of action (if any)
    var card_id: String = ""          # Card to use (if any)
    var resource_commitment: int = 0  # Resources to commit
    var confidence: float = 0.0       # AI confidence in this decision
    var alternatives: Array = []      # Alternative considered actions
    var reasoning: String = ""        # Explanation of decision (for debugging)

# Strategic plan
class AIStrategicPlan:
    var primary_objective: String
    var secondary_objectives: Array = []
    var priority_territories: Array = []
    var priority_card_types: Array = []
    var resource_allocation: Dictionary = {}
    var threat_assessment: Dictionary = {}
    var expected_actions: Array = []
    var validity_time: int = 0        # How long plan remains valid

# World model (AI's understanding of game state)
class AIWorldModel:
    var territories: Dictionary = {}
    var known_cards: Dictionary = {}
    var player_resources: Dictionary = {}
    var player_strategies: Dictionary = {}
    var threat_levels: Dictionary = {}
    var opportunity_scores: Dictionary = {}
    var game_phase: String = ""
    var turn: int = 0

# Create an AI player
func create_ai_player(faction_type: int, subfaction_id: int, difficulty: int) -> String:
    pass

# Set AI personality
func set_ai_personality(ai_id: String, personality: AIPersonality) -> void:
    pass

# Get strategic plan
func get_strategic_plan(ai_id: String) -> AIStrategicPlan:
    pass

# Update world model with new information
func update_world_model(ai_id: String, game_state: Dictionary) -> void:
    pass

# Get AI decision for current game state
func get_ai_decision(ai_id: String) -> AIDecision:
    pass

# Get territory evaluation
func evaluate_territory(ai_id: String, territory_id: String) -> Dictionary:
    pass

# Evaluate card for play
func evaluate_card(ai_id: String, card_id: String, game_context: Dictionary) -> float:
    pass

# Make decision about run (Runner-specific)
func decide_run_target(ai_id: String) -> String:
    pass

# Make decision about ICE placement (Corporation-specific)
func decide_ice_placement(ai_id: String, ice_id: String) -> Dictionary:
    pass

# Learn from gameplay outcome
func learn_from_outcome(ai_id: String, action_type: String, outcome: Dictionary) -> void:
    pass

# Strategic layer methods
func generate_strategic_plan(ai_id: String) -> AIStrategicPlan:
    pass

# Tactical layer methods
func generate_tactical_decision(ai_id: String, context: Dictionary) -> AIDecision:
    pass

# Testing methods
func create_test_ai(faction_type: int, personality: AIPersonality) -> String:
    pass
    
func simulate_decision(ai_id: String, test_state: Dictionary) -> AIDecision:
    pass
    
func get_decision_metrics(ai_id: String) -> Dictionary:
    pass
```

### 5. Encounter System Interface

The Encounter System manages player interactions and combat:

```gdscript
class_name IEncounterSystem
extends RefCounted

# Encounter types
enum EncounterType {
    RUNNER_VS_CORP,       # Asymmetric - Runner attacking Corp
    CORP_VS_CORP,         # Symmetric