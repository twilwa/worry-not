# End of Line - Gameplay DSL Specification

## Overview

This document defines the Domain Specific Language (DSL) for the "End of Line" multiplayer roguelike deckbuilder-RPG hybrid. The DSL provides a structured way to define game elements, behaviors, and interactions across the three core gameplay layers: strategic (territory control), narrative (meatspace adventures), and digital (netrunner card gameplay).

## Core Game Structure

```
// End of Line - Multi-Layer Gameplay DSL

// STRATEGIC LAYER - Territory Control

TerritoryMap CyberCity {
  GridType: Hex
  Territories: 24
  Factions: [Corporation, Runner]
  
  TerritoryAttributes {
    corporateInfluence: 0-100  // Percentage of corp control
    securityLevel: 1-5         // Difficulty level
    resourceValue: 1-5         // Resource generation potential
    stabilityIndex: 0-100      // How volatile the territory is
    population: 1-5            // Density of NPCs and opportunities
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
    Credits: resourceValue * (controllingFaction == "Corporation" ? corporateInfluence/100 : (100-corporateInfluence)/100)
    DataTokens: securityLevel * (controllingFaction == "Corporation" ? corporateInfluence/100 : (100-corporateInfluence)/100)
    Influence: population * stabilityIndex/100
  }
}

// NARRATIVE LAYER - Meatspace Adventures

NarrativeInstance {
  Structure {
    setting: String        // Location description
    objectiveTypes: Array  // Possible mission objectives
    npcs: Array            // Characters that can be encountered
    accessPoints: 1-3      // Network access nodes
    resources: Array       // Collectible items
    obstacles: Array       // Challenges to overcome
  }
  
  ActionResolutionSystem {
    actionPoints: 3-5      // Per turn
    actionTypes: ["Move", "Interact", "Combat", "Stealth", "Social", "Hack"]
    resolutionMechanic: "Card-based" // Use cards for skill checks and actions
  }
  
  ApproachPaths {
    Stealth {
      skillChecks: ["Infiltration", "Electronics", "Perception"]
      rewards: ["Silent entry to Network", "Avoid security alerts"]
      risks: ["Limited resource collection", "Slower progression"]
    }
    
    Social {
      skillChecks: ["Persuasion", "Deception", "Connections"]
      rewards: ["NPC assistance", "Information gathering"]
      risks: ["Reputation exposure", "Potential betrayal"]
    }
    
    Combat {
      skillChecks: ["Combat", "Athletics", "Weaponry"]
      rewards: ["Direct access to resources", "Eliminate security"]
      risks: ["Physical damage", "High security alerts"]
    }
    
    Technical {
      skillChecks: ["Electronics", "Hacking", "Programming"]
      rewards: ["Security bypassing", "System manipulation"]
      risks: ["System crashes", "Trace detection"]
    }
  }
  
  ProgressionFlow {
    entryState: "Infiltration"
    midStates: ["Exploration", "ObjectiveDiscovery", "ResourceCollection"]
    finalStates: ["NetworkAccess", "Extraction", "Failure"]
    
    timeConstraint: "10-15 turns"
    failureCondition: "securityAlertLevel >= 5 || playerHealth <= 0"
    successCondition: "reachedNetworkAccess && primaryObjectiveComplete"
  }
}

// DIGITAL LAYER - Network Runs

EnhancedRunSystem {
  Preparation {
    deckConfiguration: "Standard Netrunner deck rules"
    hardwareSelection: "Based on character inventory"
    programLoading: "Memory limits based on character attributes"
    preRunBuffs: "From narrative layer accomplishments"
  }
  
  RunInitiation {
    entryPoints {
      clean: {difficulty: 1, alert: 0, prerequisite: "Stealth success in narrative"}
      standard: {difficulty: 2, alert: 1, prerequisite: "Found access point"}
      emergency: {difficulty: 3, alert: 2, prerequisite: "Combat/forced entry"}
    }
    
    initialTrace: "securityLevel + alertStatus"
    initialResources: "baseMoney + narrativeLayerBonuses"
  }
  
  ICEInteraction {
    enhancedBreaking: "Character hacking skill provides bonus strength to icebreakers"
    narrativeEffects: "ICE types reflect corporation's territory attributes"
    damageEffects: "Brain damage can affect character's mental attributes temporarily"
  }
  
  ServerAccess {
    corporateServer: "More secure, higher value data, influences territory control"
    remoteServer: "Mission-specific data, affects narrative progression"
    dataExtraction: "Success affects both narrative objectives and territory control"
  }
}
```

## Faction Identities

```
// RUNNER FACTIONS

Faction Criminal {
  ThematicIdentity {
    color: "Blue"
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
        bonusSuccess: +20%
        uniqueOptions: ["Bribe", "Coerce", "Fast-Talk"]
        specialAbility: "Silver Tongue - Can retry failed social checks once per mission"
      }
    }
  }
}

Faction Anarch {
  ThematicIdentity {
    color: "Red"
    aesthetic: "Raw, chaotic, DIY, jury-rigged technology"
    philosophy: "The system is broken. Break it more."
    vulnerabilities: ["Meat damage", "System crashes", "Collateral effects"]
  }
  
  GameplayMechanics {
    DestructivePower {
      virusPrograms: "Place virus counters that grow over time"
      bruteForce: "Break ICE at reduced cost but with system damage"
      chaosGeneration: "Random beneficial effects when systems are damaged"
    }
  }
}

Faction Shaper {
  ThematicIdentity {
    color: "Green"
    aesthetic: "Organic meets technical, elegant solutions, community"
    philosophy: "The right tool for the right job. If it doesn't exist, build it."
    vulnerabilities: ["Brain damage", "Loss of community support", "Specialization"]
  }
  
  GameplayMechanics {
    ResourceEfficiency {
      memoryManagement: "Increased memory limits for programs"
      modularDesign: "Can reconfigure installed programs during runs"
      communitySupport: "Gain resources from other runner actions"
    }
  }
}

// CORPORATION FACTIONS

Faction NBN {
  ThematicIdentity {
    color: "Yellow"
    aesthetic: "Bright, attention-grabbing, always-on, reality TV"
    philosophy: "Someone is always watching. Make sure they're watching what we want."
    opposition: "Shaper"
  }
  
  GameplayMechanics {
    InformationControl {
      taggingMechanics: "Enhanced ability to tag runners"
      tagPunishment: "Special effects that trigger when runners are tagged"
      mediaCycle: "Cards that cycle in effectiveness based on game turns"
    }
  }
}

Faction Weyland {
  ThematicIdentity {
    color: "Black/Green"
    aesthetic: "Industrial, brutalist, practical, overwhelming force"
    philosophy: "What stands in our way will be removed."
    opposition: "Anarch"
  }
  
  GameplayMechanics {
    CorporatePower {
      advancementMechanics: "Enhanced ability to advance agendas"
      punishmentProtocols: "Powerful retaliation for successful runs"
      resourceDominance: "Better territorial control and resource generation"
    }
  }
}

Faction Jinteki {
  ThematicIdentity {
    color: "Red/Purple"
    aesthetic: "Traditional yet futuristic, elegant, deceptive"
    philosophy: "Every action you take is one we anticipated."
    opposition: "Criminal"
  }
  
  GameplayMechanics {
    DeceptionAndTraps {
      ambushCards: "Enhanced trap cards that activate when accessed"
      misdirectionAbilities: "Can hide or disguise server contents"
      netDamageEffects: "Increased potency of brain damage effects"
    }
  }
}

Faction HaasBioroid {
  ThematicIdentity {
    color: "Blue/Gray"
    aesthetic: "Clinical, efficient, artificial humanity"
    philosophy: "Human ingenuity improved upon by machine precision."
    opposition: "Fluid - adapts to counter all runner types"
  }
  
  GameplayMechanics {
    ArtificialEfficiency {
      bioroidICE: "Special ICE with unique strengths and bypass options"
      recursionMechanics: "Can reuse trashed cards more effectively"
      clickEfficiency: "Effects that provide additional clicks or actions"
    }
  }
}
```

## Gameplay Loops

```
// Territory Control Loop
GameplayLoop TerritoryControlLoop {
  States {
    PLANNING      // Players select territories to contest
    DEPLOYMENT    // Resources are allocated to territories
    RESOLUTION    // Narrative missions occur
    AFTERMATH     // Territory control is recalculated
  }
  
  Transitions {
    PLANNING -> DEPLOYMENT: AllPlayersSubmitPlans()
    DEPLOYMENT -> RESOLUTION: ResourcesAllocated()
    RESOLUTION -> AFTERMATH: MissionsCompleted()
    AFTERMATH -> PLANNING: TerritoryControlUpdated()
  }
  
  VictoryConditions {
    Corporation: "Control 75% of territories" || "Complete 3 major corporate agendas"
    Runner: "Reduce corporate control below 40% citywide" || "Flip 5 corporate agendas"
  }
}

// Narrative Mission Loop
GameplayLoop NarrativeMissionLoop {
  States {
    BRIEFING      // Mission information presented
    INFILTRATION  // Entering the location
    EXPLORATION   // Moving through environment and gathering intel
    OBJECTIVE     // Completing primary tasks
    NETWORK       // Finding and accessing the network
    EXTRACTION    // Escaping with data/resources
  }
  
  Transitions {
    BRIEFING -> INFILTRATION: MissionAccepted()
    INFILTRATION -> EXPLORATION: EnteredLocation()
    EXPLORATION -> OBJECTIVE: DiscoveredObjective()
    EXPLORATION -> NETWORK: FoundAccessPoint()
    OBJECTIVE -> NETWORK: CompletedObjective()
    NETWORK -> EXTRACTION: CompletedNetworkRun()
    EXTRACTION -> COMPLETION: SuccessfulEscape() || FailedMission()
  }
}

// Run Gameplay Loop
GameplayLoop RunLoop {
  States {
    INITIATION    // Starting the run
    APPROACHING   // Moving toward a piece of ice
    ENCOUNTERING  // Dealing with a piece of ice
    PASSING       // Moving past the ice
    ACCESSING     // Reaching the server
    RESOLUTION    // Ending the run
  }
  
  Transitions {
    INITIATION -> APPROACHING: RunBeginsApproachingIce()
    APPROACHING -> ENCOUNTERING: RunnerReachesIce()
    ENCOUNTERING -> PASSING: IceIsBroken() || IceIsNotRezzed()
    ENCOUNTERING -> RESOLUTION: RunnerCannotBreakIce()
    PASSING -> APPROACHING: MoreIceAhead()
    PASSING -> ACCESSING: ReachedServer()
    ACCESSING -> RESOLUTION: AccessComplete()
  }
}
```

## User Interface Components

```
Screen GameBoardScreen {
  Components {
    // Corp Side
    CardZone servers {
      CardZone hq
      CardZone rd
      CardZone archives
      List remoteServers
    }
    
    // Runner Side
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
```

## Visual Design Guidelines

```
FactionAesthetics {
  ColorSchemes: {
    Criminal: ["#0A5EB0", "#2994E6", "#D8E1E9"] // Blue tones
    Anarch: ["#D02D24", "#F77F00", "#FCBF49"]   // Red/orange tones
    Shaper: ["#0CA75D", "#57D9A3", "#EBF5EE"]   // Green tones
    NBN: ["#F8CB3C", "#FFDD55", "#FFF5D6"]      // Yellow tones
    Weyland: ["#1D361D", "#3A563A", "#D8E1E9"]  // Dark green/black tones
    Jinteki: ["#8A1A4B", "#BB4575", "#FFD6E5"]  // Red/purple tones
    HaasBioroid: ["#4D7B94", "#78A1BB", "#EBF5EE"] // Blue/gray tones
  }
  
  InterfaceElements: {
    Criminal: {
      fonts: "Sharp, clean sans-serif for efficiency"
      iconography: "Locks, keycards, credit symbols"
      animations: "Smooth, fluid transitions with subtle glint effects"
      soundDesign: "Subtle beeps, electronic unlocking sounds, quiet jazz"
    }
    
    Anarch: {
      fonts: "Distorted, glitchy typography with irregular spacing"
      iconography: "Broken systems, viral symbols, chaos motifs"
      animations: "Glitchy transitions, destructive particle effects, noise"
      soundDesign: "Static, distortion, industrial sounds, punk music elements"
    }
  }
}
```

This DSL provides a comprehensive framework for defining and implementing the game mechanics, narrative structure, and aesthetics of "End of Line." It serves as both documentation and potentially a basis for procedural content generation within the game itself.
