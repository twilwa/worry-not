# End of Line - DSL Prototype
# This file demonstrates the syntax for defining game elements using the custom DSL

# Card Definition Example

Card IceWall {
  Identity {
    id: "ice_wall"
    title: "Ice Wall"
    faction: "corp"
    type: "ice"
    subtype: ["barrier"]
  }
  
  Resources {
    cost: 1
    rez_cost: 1
    strength: 1
  }
  
  Display {
    text: "End the run."
    flavor_text: "It's not about creating an impenetrable wall. It's about creating one high enough that it's easier to go around than over it."
    art_path: "res://assets/cards/ice_wall.png"
  }
  
  Effects {
    Subroutine {
      id: "end_run"
      text: "End the run."
      effect_type: "end_run"
      parameters: {}
    }
  }
}

Card Corroder {
  Identity {
    id: "corroder"
    title: "Corroder"
    faction: "anarch"
    type: "program"
    subtype: ["icebreaker", "fracter"]
  }
  
  Resources {
    cost: 2
    memory_cost: 1
    strength: 2
  }
  
  Display {
    text: "1[credit]: Break barrier subroutine.\n1[credit]: +1 strength until end of run."
    flavor_text: "A few judicious applications in the right spot, and even the strongest barrier falls."
    art_path: "res://assets/cards/corroder.png"
  }
  
  Effects {
    BreakIce {
      cost: 1
      target_subtype: "barrier"
      break_count: 1
    }
    
    BoostStrength {
      cost: 1
      amount: 1
      duration: "run"
    }
  }
}

# Faction Definition Example

Faction Criminal {
  ThematicIdentity {
    name: "Criminal"
    color: "Blue"
    color_codes: ["#0A5EB0", "#2994E6", "#D8E1E9"]
    aesthetic: "Sleek, professional, urbane, high-tech but subtle"
    philosophy: "Why use the front door when the back door is open?"
    vulnerabilities: ["Tags", "Trace detection", "Reputation damage"]
  }
  
  GameplayMechanics {
    ResourceGeneration {
      credits: "Enhanced credit generation (150% of base rate)"
      connectionNetwork: "Can spend credits to gain information or bypass obstacles"
      blackMarketAccess: "Special deals on equipment at reduced costs"
    }
    
    NarrativeMechanics {
      socialApproach: {
        bonusSuccess: 20
        uniqueOptions: ["Bribe", "Coerce", "Fast-Talk"]
        specialAbility: "Silver Tongue - Can retry failed social checks once per mission"
      }
    }
    
    SpecialAbilities {
      Ability {
        id: "silver_tongue"
        name: "Silver Tongue"
        text: "Once per mission, retry a failed social check."
        activation: "passive"
        trigger_condition: "failed_social_check"
        cooldown: "mission"
      }
      
      Ability {
        id: "ghost"
        name: "Ghost"
        text: "Temporarily disappear from security view."
        activation: "click"
        cost: 2
        effect: "security_evasion"
        duration: 1
      }
      
      Ability {
        id: "first_run_bonus"
        name: "First Run Bonus"
        text: "First run each turn costs 0 clicks."
        activation: "passive"
        trigger_condition: "first_run_each_turn"
        effect: "reduce_run_cost"
        parameters: { "cost_type": "click", "amount": "all" }
      }
    }
  }
  
  VisualDesign {
    CardFrames {
      standard: "res://assets/frames/criminal_standard.png"
      program: "res://assets/frames/criminal_program.png"
      event: "res://assets/frames/criminal_event.png"
    }
    
    Iconography: ["res://assets/icons/criminal_lockpick.png", "res://assets/icons/criminal_keycard.png"]
    
    CharacterDesign {
      clothing: ["Tailored suits", "High-end tech-wear", "Designer implants"]
      tools: ["Custom equipment", "Concealable tech", "Fashion/function hybrid gear"]
      environments: ["High-rise apartments", "Exclusive clubs", "Luxury vehicles"]
    }
  }
}

# Territory Control Definition Example

TerritoryMap CyberCity {
  GridType: "Hex"
  Territories: 24
  Factions: ["Corporation", "Runner"]
  
  TerritoryAttributes {
    corporateInfluence: "0-100"  # Percentage of corp control
    securityLevel: "1-5"         # Difficulty level
    resourceValue: "1-5"         # Resource generation potential
    stabilityIndex: "0-100"      # How volatile the territory is
    population: "1-5"            # Density of NPCs and opportunities
  }
  
  TerritoryTypes {
    Corporate {
      defaultAttributes: {corporateInfluence: 80, securityLevel: 4, resourceValue: 3}
      narrative: ["Corporate HQ", "Research Campus", "Manufacturing Zone"]
    }
    
    Fringe {
      defaultAttributes: {corporateInfluence: 30, securityLevel: 2, resourceValue: 2}
      narrative: ["Abandoned Mall", "Industrial District", "Residential Block"]
    }
    
    Underground {
      defaultAttributes: {corporateInfluence: 10, securityLevel: 1, resourceValue: 4}
      narrative: ["Black Market", "Hacker Den", "Smuggler Tunnels"]
    }
  }
  
  ResourceGeneration(PerTurn) {
    Credits: "resourceValue * (controllingFaction == 'Corporation' ? corporateInfluence/100 : (100-corporateInfluence)/100)"
    DataTokens: "securityLevel * (controllingFaction == 'Corporation' ? corporateInfluence/100 : (100-corporateInfluence)/100)"
    Influence: "population * stabilityIndex/100"
  }
}

# Gameplay Loop Definition Example

GameplayLoop TerritoryControlLoop {
  States {
    PLANNING      # Players select territories to contest
    DEPLOYMENT    # Resources are allocated to territories
    RESOLUTION    # Narrative missions occur
    AFTERMATH     # Territory control is recalculated
  }
  
  Transitions {
    PLANNING -> DEPLOYMENT: "AllPlayersSubmitPlans()"
    DEPLOYMENT -> RESOLUTION: "ResourcesAllocated()"
    RESOLUTION -> AFTERMATH: "MissionsCompleted()"
    AFTERMATH -> PLANNING: "TerritoryControlUpdated()"
  }
  
  VictoryConditions {
    Corporation: "Control 75% of territories" | "Complete 3 major corporate agendas"
    Runner: "Reduce corporate control below 40% citywide" | "Flip 5 corporate agendas"
  }
}

# Network Run Gameplay Loop Definition Example

GameplayLoop RunLoop {
  States {
    INITIATION    # Starting the run
    APPROACHING   # Moving toward a piece of ice
    ENCOUNTERING  # Dealing with a piece of ice
    PASSING       # Moving past the ice
    ACCESSING     # Reaching the server
    RESOLUTION    # Ending the run
  }
  
  Transitions {
    INITIATION -> APPROACHING: "RunBeginsApproachingIce()"
    APPROACHING -> ENCOUNTERING: "RunnerReachesIce()"
    ENCOUNTERING -> PASSING: "IceIsBroken() | IceIsNotRezzed()"
    ENCOUNTERING -> RESOLUTION: "RunnerCannotBreakIce()"
    PASSING -> APPROACHING: "MoreIceAhead()"
    PASSING -> ACCESSING: "ReachedServer()"
    ACCESSING -> RESOLUTION: "AccessComplete()"
  }
}

# UI Components Definition Example

Screen GameBoardScreen {
  Components {
    # Corp Side
    CardZone servers {
      CardZone hq
      CardZone rd
      CardZone archives
      List remoteServers
    }
    
    # Runner Side
    CardZone rig {
      CardZone programs
      CardZone hardware
      CardZone resources
    }
    
    CardZone hand
    CardZone deck
    CardZone discard
    
    ResourceCounter credits
    ResourceCounter clicks
    ResourceCounter memory (runner-only)
    ResourceCounter badPublicity (corp-only)
    ResourceCounter tags (runner-only)
    
    Button endTurnButton
    Button jackOutButton (runner-only, during run)
    Button passButton (during run interactions)
  }
  
  Interactions {
    hand.onCardClick => {
      ShowCardOptions(hand.selected)
    }
    
    servers.onIceClick => {
      if (IsActivePlayer() && IsInstallationPhase()) {
        RezIce(servers.selected)
      }
    }
    
    servers.onServerClick => {
      if (IsRunner() && CanMakeRun()) {
        InitiateRun(servers.selected)
      }
    }
    
    endTurnButton.onClick => {
      EndTurn()
    }
    
    jackOutButton.onClick => {
      JackOut()
    }
  }
}
