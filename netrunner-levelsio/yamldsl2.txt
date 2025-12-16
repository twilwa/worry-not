# End of Line - Game State DSL in YAML

# Game Configuration
game:
  name: "End of Line"
  turn: 3
  phase: "DEPLOYMENT"
  active_faction: "criminal"

# Territory Map
territories:
  downtown:
    type: "fringe"
    name: "Downtown District"
    attributes:
      corporate_influence: 45  # percentage (0-100)
      security_level: 3        # scale (1-5)
      resource_value: 4        # scale (1-5)
      stability_index: 72      # percentage (0-100)
      population: 5            # scale (1-5)
    adjacent_to: ["financial", "industrial", "residential"]
    installations:
      - id: "nbn_surveillance"
        faction: "nbn"
        type: "infrastructure"
        effects:
          - {type: "security_bonus", value: 1}
      - id: "runner_network"
        faction: "criminal"
        type: "network"
        effects:
          - {type: "evasion_bonus", value: 2}
  
  financial:
    type: "corporate"
    name: "Financial District"
    attributes:
      corporate_influence: 85
      security_level: 4
      resource_value: 5
      stability_index: 90
      population: 3
    adjacent_to: ["downtown", "corporate_hq"]
    installations:
      - id: "weyland_investments"
        faction: "weyland"
        type: "infrastructure"
        effects:
          - {type: "resource_bonus", value: 2}
  
  industrial:
    type: "corporate"
    name: "Industrial Zone"
    attributes:
      corporate_influence: 70
      security_level: 3
      resource_value: 3
      stability_index: 65
      population: 2
    adjacent_to: ["downtown", "manufacturing"]
    installations:
      - id: "haas_bioroid_facility"
        faction: "haas_bioroid"
        type: "infrastructure"
        effects:
          - {type: "bioroid_production", value: 1}
  
  residential:
    type: "fringe"
    name: "Residential Blocks"
    attributes:
      corporate_influence: 30
      security_level: 2
      resource_value: 2
      stability_index: 40
      population: 5
    adjacent_to: ["downtown", "black_market"]
    installations: []
  
  black_market:
    type: "underground"
    name: "Black Market"
    attributes:
      corporate_influence: 15
      security_level: 1
      resource_value: 4
      stability_index: 25
      population: 4
    adjacent_to: ["residential", "hacker_den"]
    installations:
      - id: "criminal_safehouse"
        faction: "criminal"
        type: "resource"
        effects:
          - {type: "credit_generation", value: 2}
  
  hacker_den:
    type: "underground"
    name: "Hacker Den"
    attributes:
      corporate_influence: 10
      security_level: 1
      resource_value: 3
      stability_index: 20
      population: 2
    adjacent_to: ["black_market"]
    installations:
      - id: "anarch_server"
        faction: "anarch"
        type: "network"
        effects:
          - {type: "virus_strength", value: 2}

# Factions
factions:
  # Corporation Factions
  nbn:
    type: "corporation"
    resources:
      credits: 12
      data_tokens: 5
      influence: 7
    victory_progress:
      territories_controlled: 2
      agenda_points: 3
    deck:
      size: 45
      cards_in_hand: 5
  
  weyland:
    type: "corporation"
    resources:
      credits: 15
      data_tokens: 3
      influence: 6
    victory_progress:
      territories_controlled: 3
      agenda_points: 2
    deck:
      size: 40
      cards_in_hand: 5
  
  # Runner Factions
  criminal:
    type: "runner"
    resources:
      credits: 10
      data_tokens: 2
      influence: 4
    victory_progress:
      territories_influenced: 2
      agendas_stolen: 1
    deck:
      size: 35
      cards_in_hand: 5
      
  anarch:
    type: "runner"
    resources:
      credits: 7
      data_tokens: 1
      influence: 3
    victory_progress:
      territories_influenced: 1
      agendas_stolen: 2
    deck:
      size: 38
      cards_in_hand: 5

# Sample Cards in Hand
cards:
  criminal_hand:
    - id: "backdoor_access"
      name: "Backdoor Access"
      type: "event"
      cost: 2
      effects:
        - type: "stealth_run"
          target: "any"
          value: 1
      flavor_text: "Why use the front door when the back door is open?"
    
    - id: "network_expansion"
      name: "Network Expansion"
      type: "resource"
      cost: 3
      effects:
        - type: "territory_influence"
          target: "adjacent"
          value: 10
      flavor_text: "Every node you control expands your reach."
    
    - id: "ghost_runner"
      name: "Ghost Runner"
      type: "resource"
      cost: 1
      effects:
        - type: "evasion"
          target: "self"
          value: 2
      flavor_text: "Now you see me, now you don't."
    
    - id: "bank_job"
      name: "Bank Job"
      type: "operation"
      cost: 2
      effects:
        - type: "credit_gain"
          target: "self"
          value: "target_resource_value * 2"
      requirements:
        - type: "territory_type"
          value: "corporate"
        - type: "successful_run"
      flavor_text: "Electronic bank robbery never goes out of style."
    
    - id: "inside_man"
      name: "Inside Man"
      type: "connection"
      cost: 3
      effects:
        - type: "security_reduction"
          target: "specific"
          value: 1
        - type: "information"
          target: "installed"
          value: 1
      flavor_text: "Everyone has a price."
  
  nbn_hand:
    - id: "surveillance_grid"
      name: "Surveillance Grid"
      type: "infrastructure"
      cost: 3
      effects:
        - type: "security_increase"
          target: "territory"
          value: 1
        - type: "runner_tag"
          target: "runner_in_territory"
          value: 1
      flavor_text: "Eyes everywhere. Watching. Always watching."
    
    - id: "media_blitz"
      name: "Media Blitz"
      type: "operation"
      cost: 2
      effects:
        - type: "territory_influence"
          target: "all_adjacent"
          value: 5
      flavor_text: "The truth is what we say it is."
    
    - id: "data_raven"
      name: "Data Raven"
      type: "ice"
      cost: 4
      strength: 3
      effects:
        - type: "runner_tag"
          target: "runner"
          value: 1
        - type: "end_run"
          condition: "if_tagged"
      flavor_text: "Caw. Caw."
    
    - id: "psychographics"
      name: "Psychographics"
      type: "operation"
      cost: "X"
      effects:
        - type: "agenda_advancement"
          target: "installed_agenda"
          value: "runner_tags"
      flavor_text: "We know what you want before you do."
    
    - id: "closed_accounts"
      name: "Closed Accounts"
      type: "operation"
      cost: 1
      effects:
        - type: "runner_credits"
          target: "tagged_runner"
          value: "all"
          action: "remove"
      requirements:
        - type: "runner_tagged"
      flavor_text: "Account terminated. Have a nice day."
