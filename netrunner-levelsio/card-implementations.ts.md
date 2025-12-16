// End of Line - Card Implementation Examples
// These implementations show how cards from the YAML DSL would be implemented in code

// Base Card Interface
interface Card {
  id: string;
  name: string;
  type: CardType;
  faction: FactionId;
  cost: number | "X";
  play(context: GameContext, target: Territory): boolean;
  canPlay(context: GameContext, target?: Territory): boolean;
}

// Enums for Card Types
enum CardType {
  Infrastructure = "infrastructure",
  Operation = "operation",
  Event = "event",
  Resource = "resource",
  Connection = "connection",
  Hardware = "hardware",
  Program = "program",
  ICE = "ice",
  Virus = "virus",
}

enum FactionId {
  NBN = "nbn",
  Weyland = "weyland",
  HaasBioroid = "haas_bioroid",
  Jinteki = "jinteki",
  Criminal = "criminal",
  Anarch = "anarch",
  Shaper = "shaper",
}

// Game Context Interface
interface GameContext {
  activeFaction: FactionId;
  territories: Map<string, Territory>;
  factions: Map<FactionId, Faction>;
  getTerritoryById(id: string): Territory;
  getFactionById(id: FactionId): Faction;
  isAdjacent(territory1: Territory, territory2: Territory): boolean;
  modifyResource(faction: FactionId, resource: string, amount: number): void;
  installOnTerritory(territory: Territory, installation: Installation): void;
  damageRunner(faction: FactionId, amount: number): void;
  tagRunner(faction: FactionId, amount: number): boolean;
}

// Territory Interface
interface Territory {
  id: string;
  name: string;
  type: string;
  attributes: {
    corporateInfluence: number;
    securityLevel: number;
    resourceValue: number;
    stabilityIndex: number;
    population: number;
  };
  installations: Installation[];
  adjacentTerritories: string[];
  getRunnerInfluence(): number;
  getControllingFaction(): FactionId | null;
  isContested(): boolean;
}

// Installation Interface
interface Installation {
  id: string;
  faction: FactionId;
  type: string;
  status?: 'active' | 'disabled' | 'damaged';
  duration?: number;
  effects: CardEffect[];
}

// Card Effect Interface
interface CardEffect {
  type: string;
  target?: string;
  value: number | string;
  condition?: string;
  action?: string;
}

// Faction Interface
interface Faction {
  id: FactionId;
  type: 'corporation' | 'runner';
  resources: {
    credits: number;
    dataTokens: number;
    influence: number;
    [key: string]: number;
  };
  victoryProgress: {
    [key: string]: number;
  };
  deck: {
    size: number;
    cardsInHand: number;
  };
  tags?: number;
}

// Sample Card Implementations

// Criminal Cards
class BackdoorAccess implements Card {
  id = "backdoor_access";
  name = "Backdoor Access";
  type = CardType.Event;
  faction = FactionId.Criminal;
  cost = 2;
  
  canPlay(context: GameContext): boolean {
    // Check if player has enough credits
    return context.getFactionById(context.activeFaction).resources.credits >= this.cost;
  }
  
  play(context: GameContext, target: Territory): boolean {
    const criminal = context.getFactionById(FactionId.Criminal);
    
    // Pay the cost
    context.modifyResource(FactionId.Criminal, "credits", -this.cost);
    
    // Effect: Allow a stealth run on any server
    // This is a meta effect that would change game state to allow a run
    // For our territory control game, we'll interpret this as temporarily
    // reducing security level in a territory
    
    const stealth = {
      id: "backdoor_effect_" + Date.now(),
      faction: FactionId.Criminal,
      type: "stealth",
      duration: 1, // Lasts 1 turn
      effects: [
        { type: "security_reduction", value: 1 }
      ]
    };
    
    context.installOnTerritory(target, stealth);
    
    return true;
  }
}

class NetworkExpansion implements Card {
  id = "network_expansion";
  name = "Network Expansion";
  type = CardType.Resource;
  faction = FactionId.Criminal;
  cost = 3;
  
  canPlay(context: GameContext, target?: Territory): boolean {
    if (!target) return false;
    
    const criminal = context.getFactionById(FactionId.Criminal);
    
    // Check if player has enough credits
    if (criminal.resources.credits < this.cost) return false;
    
    // Check if the territory is adjacent to a territory with runner influence
    const adjacentTerritories = target.adjacentTerritories.map(id => context.getTerritoryById(id));
    return adjacentTerritories.some(t => t.getRunnerInfluence() > 0);
  }
  
  play(context: GameContext, target: Territory): boolean {
    // Pay the cost
    context.modifyResource(FactionId.Criminal, "credits", -this.cost);
    
    // Effect: Increase runner influence (decrease corporate influence)
    const installation = {
      id: "network_expansion_" + Date.now(),
      faction: FactionId.Criminal,
      type: "resource",
      effects: [
        { type: "territory_influence", value: -10 } // Reduce corporate influence by 10%
      ]
    };
    
    context.installOnTerritory(target, installation);
    
    // Update the territory attributes directly
    target.attributes.corporateInfluence = Math.max(0, target.attributes.corporateInfluence - 10);
    
    return true;
  }
}

class BankJob implements Card {
  id = "bank_job";
  name = "Bank Job";
  type = CardType.Operation;
  faction = FactionId.Criminal;
  cost = 2;
  
  canPlay(context: GameContext, target?: Territory): boolean {
    if (!target) return false;
    
    const criminal = context.getFactionById(FactionId.Criminal);
    
    // Check if player has enough credits
    if (criminal.resources.credits < this.cost) return false;
    
    // Check if the territory is a corporate territory
    return target.type === "corporate";
  }
  
  play(context: GameContext, target: Territory): boolean {
    // Pay the cost
    context.modifyResource(FactionId.Criminal, "credits", -this.cost);
    
    // Effect: Gain credits based on territory resource value
    const creditsGained = target.attributes.resourceValue * 2;
    context.modifyResource(FactionId.Criminal, "credits", creditsGained);
    
    // Add a temporary penalty to the territory
    target.attributes.stabilityIndex = Math.max(0, target.attributes.stabilityIndex - 5);
    
    return true;
  }
}

// NBN Cards
class SurveillanceGrid implements Card {
  id = "surveillance_grid";
  name = "Surveillance Grid";
  type = CardType.Infrastructure;
  faction = FactionId.NBN;
  cost = 3;
  
  canPlay(context: GameContext, target?: Territory): boolean {
    if (!target) return false;
    
    const nbn = context.getFactionById(FactionId.NBN);
    
    // Check if player has enough credits
    return nbn.resources.credits >= this.cost;
  }
  
  play(context: GameContext, target: Territory): boolean {
    // Pay the cost
    context.modifyResource(FactionId.NBN, "credits", -this.cost);
    
    // Effect 1: Increase security level
    target.attributes.securityLevel = Math.min(5, target.attributes.securityLevel + 1);
    
    // Effect 2: Tag runners in territory
    // This is a persistent effect that would be checked when runners enter
    const installation = {
      id: "surveillance_grid_" + Date.now(),
      faction: FactionId.NBN,
      type: "infrastructure",
      effects: [
        { type: "security_increase", value: 1 },
        { type: "runner_tag", value: 1 }
      ]
    };
    
    context.installOnTerritory(target, installation);
    
    return true;
  }
}

class ClosedAccounts implements Card {
  id = "closed_accounts";
  name = "Closed Accounts";
  type = CardType.Operation;
  faction = FactionId.NBN;
  cost = 1;
  
  canPlay(context: GameContext): boolean {
    const nbn = context.getFactionById(FactionId.NBN);
    
    // Check if player has enough credits
    if (nbn.resources.credits < this.cost) return false;
    
    // Check if any runner is tagged
    return Object.values(context.factions)
      .some(f => f.type === 'runner' && f.tags && f.tags > 0);
  }
  
  play(context: GameContext): boolean {
    // Pay the cost
    context.modifyResource(FactionId.NBN, "credits", -this.cost);