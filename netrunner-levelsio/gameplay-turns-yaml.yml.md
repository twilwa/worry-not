# End of Line - Gameplay Turn Walkthrough

## TURN 3 - CRIMINAL ACTION PHASE
# Current state is as defined in the game state DSL

# Criminal player's turn
action:
  player: "criminal"
  card_played: "network_expansion"
  target_territory: "downtown"
  cost_paid: 3
  effects_applied:
    - effect: "territory_influence"
      value: -10  # Reduces corporate influence by 10%
      territory: "downtown"

# Updated Territory State
updated_territory:
  downtown:
    attributes:
      corporate_influence: 35  # Decreased from 45 to 35
      security_level: 3        # Unchanged
      resource_value: 4        # Unchanged
      stability_index: 67      # Decreased slightly due to contested control
      population: 5            # Unchanged
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
      - id: "network_expansion"  # New installation from card
        faction: "criminal"
        type: "resource"
        effects:
          - {type: "territory_influence", value: -10}

# Updated Faction State
updated_faction:
  criminal:
    resources:
      credits: 7  # Reduced by 3 from the card cost
      data_tokens: 2
      influence: 4
    victory_progress:
      territories_influenced: 2
      agendas_stolen: 1
    deck:
      size: 35
      cards_in_hand: 4  # Reduced by 1 from playing the card

# End of Criminal's turn, game moves to NBN's response phase

## TURN 3 - NBN RESPONSE PHASE

action:
  player: "nbn"
  card_played: "surveillance_grid"
  target_territory: "downtown"
  cost_paid: 3
  effects_applied:
    - effect: "security_increase"
      value: 1
      territory: "downtown"
    - effect: "territory_awareness"
      value: "all"  # NBN can now see all runner activities in this territory

# Updated Territory State
updated_territory:
  downtown:
    attributes:
      corporate_influence: 35  # Unchanged from previous action
      security_level: 4        # Increased from 3 to 4
      resource_value: 4        # Unchanged
      stability_index: 62      # Decreased further due to increased tension
      population: 5            # Unchanged
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
      - id: "network_expansion"
        faction: "criminal"
        type: "resource"
        effects:
          - {type: "territory_influence", value: -10}
      - id: "surveillance_grid"  # New installation from card
        faction: "nbn"
        type: "infrastructure"
        effects:
          - {type: "security_increase", value: 1}
          - {type: "runner_tag", value: 1}

# Updated Faction State
updated_faction:
  nbn:
    resources:
      credits: 9  # Reduced by 3 from the card cost
      data_tokens: 5
      influence: 7
    victory_progress:
      territories_controlled: 2
      agenda_points: 3
    deck:
      size: 45
      cards_in_hand: 4  # Reduced by 1 from playing the card

## TURN 4 - ANARCH ACTION PHASE

# Game progresses to next turn, Anarch player's action
action:
  player: "anarch"
  card_played: "ddos"  # Not in our original sample, but adding for example
  target_territory: "downtown"
  cost_paid: 2
  effects_applied:
    - effect: "territory_stability"
      value: -20  # Drastically reduce stability
      territory: "downtown"
    - effect: "corporate_infrastructure_disable"
      target: "surveillance_grid"
      duration: 1  # Turn

# Updated Territory State
updated_territory:
  downtown:
    attributes:
      corporate_influence: 35  # Unchanged
      security_level: 4        # Still increased, but surveillance temporarily disabled
      resource_value: 4        # Unchanged
      stability_index: 42      # Drastically decreased from 62 to 42
      population: 5            # Unchanged
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
      - id: "network_expansion"
        faction: "criminal"
        type: "resource"
        effects:
          - {type: "territory_influence", value: -10}
      - id: "surveillance_grid"  
        faction: "nbn"
        type: "infrastructure"
        status: "disabled"  # Temporarily disabled by DDOS
        effects:
          - {type: "security_increase", value: 1}
          - {type: "runner_tag", value: 1}
      - id: "ddos"  # New effect from card
        faction: "anarch"
        type: "virus"
        duration: 1
        effects:
          - {type: "territory_stability", value: -20}
          - {type: "infrastructure_disable", target: "surveillance_grid"}

# Updated Faction State
updated_faction:
  anarch:
    resources:
      credits: 5  # Reduced by 2 from the card cost
      data_tokens: 1
      influence: 3
    victory_progress:
      territories_influenced: 2  # Increased from 1 to 2
      agendas_stolen: 2
    deck:
      size: 38
      cards_in_hand: 4  # Reduced by 1 from playing the card

## TURN 4 - WEYLAND RESPONSE PHASE

# Weyland responds to the increasing runner presence
action:
  player: "weyland"
  card_played: "scorched_earth"
  target_territory: "downtown"
  cost_paid: 4
  effects_applied:
    - effect: "runner_damage"
      value: 3
      target: "all_runners_in_territory"
    - effect: "territory_stability"
      value: -10
      territory: "downtown"
    - effect: "territory_influence"
      value: 15
      territory: "downtown"

# Updated Territory State
updated_territory:
  downtown:
    attributes:
      corporate_influence: 50  # Increased from 35 to 50
      security_level: 4        # Unchanged
      resource_value: 3        # Decreased from 4 to 3 due to damage
      stability_index: 32      # Further decreased from 42 to 32
      population: 4            # Decreased from 5 to 4 due to scorched earth
    installations:
      - id: "nbn_surveillance"
        faction: "nbn"
        type: "infrastructure"
        effects:
          - {type: "security_bonus", value: 1}
      - id: "runner_network"
        faction: "criminal"
        type: "network"
        status: "damaged"  # Damaged by Scorched Earth
        effects:
          - {type: "evasion_bonus", value: 1}  # Reduced effectiveness
      - id: "network_expansion"
        faction: "criminal"
        type: "resource"
        status: "damaged"  # Damaged by Scorched Earth
        effects:
          - {type: "territory_influence", value: -5}  # Reduced effectiveness
      - id: "surveillance_grid"  
        faction: "nbn"
        type: "infrastructure"
        status: "disabled"  # Still temporarily disabled by DDOS
        effects:
          - {type: "security_increase", value: 1}
          - {type: "runner_tag", value: 1}
      - id: "ddos"
        faction: "anarch"
        type: "virus"
        duration: 1
        effects:
          - {type: "territory_stability", value: -20}
          - {type: "infrastructure_disable", target: "surveillance_grid"}
      - id: "scorched_earth_aftermath"  # New effect from card
        faction: "weyland"
        type: "operation"
        duration: 2
        effects:
          - {type: "territory_influence", value: 15}
          - {type: "runner_damage_aura", value: 1}

# Updated Faction States
updated_faction:
  criminal:
    resources:
      credits: 7
      data_tokens: 1  # Lost 1 data token due to damage
      influence: 3    # Lost 1 influence due to damage
    victory_progress:
      territories_influenced: 1  # Decreased from 2 to 1
      agendas_stolen: 1
    deck:
      size: 32  # Lost 3 cards due to damage
      cards_in_hand: 4

  anarch:
    resources:
      credits: 5
      data_tokens: 0  # Lost 1 data token due to damage
      influence: 2    # Lost 1 influence due to damage
    victory_progress:
      territories_influenced: 1  # Decreased from 2 to 1
      agendas_stolen: 2
    deck:
      size: 35  # Lost 3 cards due to damage
      cards_in_hand: 4
      
  weyland:
    resources:
      credits: 11  # Reduced by 4 from the card cost
      data_tokens: 3
      influence: 7    # Gained 1 influence from successful operation
    victory_progress:
      territories_controlled: 3
      agenda_points: 2
    deck:
      size: 40
      cards_in_hand: 4  # Reduced by 1 from playing the card

# Game State Summary after Two Turns
game_state_summary:
  downtown:
    control: "contested"  # Neither faction has clear control
    corporate_influence: 50
    runner_influence: 50  # Implied from corporate_influence
    stability: "unstable"  # Below 50% stability
    key_events: 
      - "Criminal network expansion"
      - "NBN surveillance increased"
      - "Anarch DDOS attack"
      - "Weyland scorched earth response"
    tactical_situation: "Highly volatile territory with both sides committing significant resources. 
                         Corporate security is high but infrastructure is under attack. 
                         Runner network remains present but damaged."
