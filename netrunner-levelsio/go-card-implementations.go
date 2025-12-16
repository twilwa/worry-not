// End of Line - Card Implementation Examples in Go
package endofline

import (
	"fmt"
	"math"
	"time"
)

// CardType represents the type of a card
type CardType string

// FactionID represents the identification of a faction
type FactionID string

// Card types
const (
	Infrastructure CardType = "infrastructure"
	Operation     CardType = "operation"
	Event         CardType = "event"
	Resource      CardType = "resource"
	Connection    CardType = "connection"
	Hardware      CardType = "hardware"
	Program       CardType = "program"
	ICE           CardType = "ice"
	Virus         CardType = "virus"
)

// Faction identifiers
const (
	NBN          FactionID = "nbn"
	Weyland      FactionID = "weyland"
	HaasBioroid  FactionID = "haas_bioroid"
	Jinteki      FactionID = "jinteki"
	Criminal     FactionID = "criminal"
	Anarch       FactionID = "anarch"
	Shaper       FactionID = "shaper"
)

// InstallationStatus represents the current state of an installation
type InstallationStatus string

const (
	Active    InstallationStatus = "active"
	Disabled  InstallationStatus = "disabled"
	Damaged   InstallationStatus = "damaged"
)

// CardEffect represents the effect of a card
type CardEffect struct {
	Type      string
	Target    string
	Value     interface{} // Can be int or string
	Condition string
	Action    string
}

// Installation represents an installation on a territory
type Installation struct {
	ID       string
	Faction  FactionID
	Type     string
	Status   InstallationStatus
	Duration int
	Effects  []CardEffect
}

// Territory represents a location on the game board
type Territory struct {
	ID                 string
	Name               string
	Type               string
	Attributes         TerritoryAttributes
	Installations      []Installation
	AdjacentTerritories []string
}

// TerritoryAttributes represents the attributes of a territory
type TerritoryAttributes struct {
	CorporateInfluence int
	SecurityLevel      int
	ResourceValue      int
	StabilityIndex     int
	Population         int
}

// GetRunnerInfluence calculates the runner influence in a territory
func (t *Territory) GetRunnerInfluence() int {
	return 100 - t.Attributes.CorporateInfluence
}

// GetControllingFaction determines which faction controls the territory
func (t *Territory) GetControllingFaction() *FactionID {
	if t.Attributes.CorporateInfluence > 60 {
		// Determine which corp has the most installations
		corpCounts := make(map[FactionID]int)
		for _, installation := range t.Installations {
			if installation.Faction == NBN || installation.Faction == Weyland || 
			   installation.Faction == HaasBioroid || installation.Faction == Jinteki {
				corpCounts[installation.Faction]++
			}
		}
		
		// Find the corp with the most installations
		var controllingCorp FactionID
		maxCount := 0
		for corp, count := range corpCounts {
			if count > maxCount {
				maxCount = count
				controllingCorp = corp
			}
		}
		
		if maxCount > 0 {
			return &controllingCorp
		}
		
		// Default to Weyland if no installations but high corp influence
		defaultCorp := Weyland
		return &defaultCorp
	} else if t.Attributes.CorporateInfluence < 40 {
		// Determine which runner has the most installations
		runnerCounts := make(map[FactionID]int)
		for _, installation := range t.Installations {
			if installation.Faction == Criminal || installation.Faction == Anarch || installation.Faction == Shaper {
				runnerCounts[installation.Faction]++
			}
		}
		
		// Find the runner with the most installations
		var controllingRunner FactionID
		maxCount := 0
		for runner, count := range runnerCounts {
			if count > maxCount {
				maxCount = count
				controllingRunner = runner
			}
		}
		
		if maxCount > 0 {
			return &controllingRunner
		}
		
		// Default to Anarch if no installations but high runner influence
		defaultRunner := Anarch
		return &defaultRunner
	}
	
	return nil // Contested territory
}

// IsContested determines if a territory is contested
func (t *Territory) IsContested() bool {
	return t.Attributes.CorporateInfluence >= 40 && t.Attributes.CorporateInfluence <= 60
}

// Faction represents a player faction
type Faction struct {
	ID              FactionID
	Type            string
	Resources       map[string]int
	VictoryProgress map[string]int
	Deck            DeckInfo
	Tags            int
}

// DeckInfo represents information about a faction's deck
type DeckInfo struct {
	Size       int
	CardsInHand int
}

// GameContext represents the current state of the game
type GameContext struct {
	ActiveFaction FactionID
	Territories   map[string]*Territory
	Factions      map[FactionID]*Faction
}

// GetTerritoryByID returns a territory by its ID
func (g *GameContext) GetTerritoryByID(id string) *Territory {
	return g.Territories[id]
}

// GetFactionByID returns a faction by its ID
func (g *GameContext) GetFactionByID(id FactionID) *Faction {
	return g.Factions[id]
}

// IsAdjacent checks if two territories are adjacent
func (g *GameContext) IsAdjacent(territory1, territory2 *Territory) bool {
	for _, adjacentID := range territory1.AdjacentTerritories {
		if adjacentID == territory2.ID {
			return true
		}
	}
	return false
}

// ModifyResource changes a faction's resource by the specified amount
func (g *GameContext) ModifyResource(faction FactionID, resource string, amount int) {
	f := g.Factions[faction]
	if f != nil {
		f.Resources[resource] += amount
		if f.Resources[resource] < 0 {
			f.Resources[resource] = 0
		}
	}
}

// InstallOnTerritory adds an installation to a territory
func (g *GameContext) InstallOnTerritory(territory *Territory, installation Installation) {
	territory.Installations = append(territory.Installations, installation)
}

// DamageRunner inflicts damage on a runner faction
func (g *GameContext) DamageRunner(faction FactionID, amount int) {
	f := g.Factions[faction]
	if f != nil && f.Type == "runner" {
		// Reduce resources and deck size to simulate damage
		f.Resources["dataTokens"] = int(math.Max(0, float64(f.Resources["dataTokens"]-1)))
		f.Resources["influence"] = int(math.Max(0, float64(f.Resources["influence"]-1)))
		f.Deck.Size -= amount
		if f.Deck.Size < 0 {
			f.Deck.Size = 0
		}
	}
}

// TagRunner applies tags to a runner faction
func (g *GameContext) TagRunner(faction FactionID, amount int) bool {
	f := g.Factions[faction]
	if f != nil && f.Type == "runner" {
		f.Tags += amount
		return true
	}
	return false
}

// Card interface for all cards
type Card interface {
	GetID() string
	GetName() string
	GetType() CardType
	GetFaction() FactionID
	GetCost() interface{}
	CanPlay(context *GameContext, target *Territory) bool
	Play(context *GameContext, target *Territory) bool
}

// BaseCard implements the common properties of all cards
type BaseCard struct {
	ID      string
	Name    string
	Type    CardType
	Faction FactionID
	Cost    interface{} // Can be int or "X"
}

// GetID returns the card's ID
func (c *BaseCard) GetID() string {
	return c.ID
}

// GetName returns the card's name
func (c *BaseCard) GetName() string {
	return c.Name
}

// GetType returns the card's type
func (c *BaseCard) GetType() CardType {
	return c.Type
}

// GetFaction returns the card's faction
func (c *BaseCard) GetFaction() FactionID {
	return c.Faction
}

// GetCost returns the card's cost
func (c *BaseCard) GetCost() interface{} {
	return c.Cost
}

// CanPlay determines if the card can be played (to be overridden)
func (c *BaseCard) CanPlay(context *GameContext, target *Territory) bool {
	return false
}

// Play plays the card (to be overridden)
func (c *BaseCard) Play(context *GameContext, target *Territory) bool {
	return false
}

// Runner Cards Implementation

// BackdoorAccess card implementation
type BackdoorAccess struct {
	BaseCard
}

// NewBackdoorAccess creates a new BackdoorAccess card
func NewBackdoorAccess() *BackdoorAccess {
	return &BackdoorAccess{
		BaseCard: BaseCard{
			ID:      "backdoor_access",
			Name:    "Backdoor Access",
			Type:    Event,
			Faction: Criminal,
			Cost:    2,
		},
	}
}

// CanPlay checks if BackdoorAccess can be played
func (c *BackdoorAccess) CanPlay(context *GameContext, target *Territory) bool {
	criminal := context.GetFactionByID(Criminal)
	// Check if player has enough credits
	return criminal.Resources["credits"] >= c.Cost.(int)
}

// Play executes the card's effect
func (c *BackdoorAccess) Play(context *GameContext, target *Territory) bool {
	// Pay the cost
	context.ModifyResource(Criminal, "credits", -c.Cost.(int))
	
	// Effect: Allow a stealth run on any server
	// For our territory control game, we'll interpret this as temporarily
	// reducing security level in a territory
	stealth := Installation{
		ID:       fmt.Sprintf("backdoor_effect_%d", time.Now().UnixNano()),
		Faction:  Criminal,
		Type:     "stealth",
		Status:   Active,
		Duration: 1, // Lasts 1 turn
		Effects: []CardEffect{
			{Type: "security_reduction", Value: 1},
		},
	}
	
	context.InstallOnTerritory(target, stealth)
	
	return true
}

// NetworkExpansion card implementation
type NetworkExpansion struct {
	BaseCard
}

// NewNetworkExpansion creates a new NetworkExpansion card
func NewNetworkExpansion() *NetworkExpansion {
	return &NetworkExpansion{
		BaseCard: BaseCard{
			ID:      "network_expansion",
			Name:    "Network Expansion",
			Type:    Resource,
			Faction: Criminal,
			Cost:    3,
		},
	}
}

// CanPlay checks if NetworkExpansion can be played
func (c *NetworkExpansion) CanPlay(context *GameContext, target *Territory) bool {
	if target == nil {
		return false
	}
	
	criminal := context.GetFactionByID(Criminal)
	
	// Check if player has enough credits
	if criminal.Resources["credits"] < c.Cost.(int) {
		return false
	}
	
	// Check if the territory is adjacent to a territory with runner influence
	hasAdjacentRunnerInfluence := false
	for _, adjacentID := range target.AdjacentTerritories {
		adjacent := context.GetTerritoryByID(adjacentID)
		if adjacent != nil && adjacent.GetRunnerInfluence() > 0 {
			hasAdjacentRunnerInfluence = true
			break
		}
	}
	
	return hasAdjacentRunnerInfluence
}

// Play executes the card's effect
func (c *NetworkExpansion) Play(context *GameContext, target *Territory) bool {
	// Pay the cost
	context.ModifyResource(Criminal, "credits", -c.Cost.(int))
	
	// Effect: Increase runner influence (decrease corporate influence)
	installation := Installation{
		ID:      fmt.Sprintf("network_expansion_%d", time.Now().UnixNano()),
		Faction: Criminal,
		Type:    "resource",
		Status:  Active,
		Effects: []CardEffect{
			{Type: "territory_influence", Value: -10}, // Reduce corporate influence by 10%
		},
	}
	
	context.InstallOnTerritory(target, installation)
	
	// Update the territory attributes directly
	target.Attributes.CorporateInfluence = int(math.Max(0, float64(target.Attributes.CorporateInfluence-10)))
	
	return true
}

// BankJob card implementation
type BankJob struct {
	BaseCard
}

// NewBankJob creates a new BankJob card
func NewBankJob() *BankJob {
	return &BankJob{
		BaseCard: BaseCard{
			ID:      "bank_job",
			Name:    "Bank Job",
			Type:    Operation,
			Faction: Criminal,
			Cost:    2,
		},
	}
}

// CanPlay checks if BankJob can be played
func (c *BankJob) CanPlay(context *GameContext, target *Territory) bool {
	if target == nil {
		return false
	}
	
	criminal := context.GetFactionByID(Criminal)
	
	// Check if player has enough credits
	if criminal.Resources["credits"] < c.Cost.(int) {
		return false
	}
	
	// Check if the territory is a corporate territory
	return target.Type == "corporate"
}

// Play executes the card's effect
func (c *BankJob) Play(context *GameContext, target *Territory) bool {
	// Pay the cost
	context.ModifyResource(Criminal, "credits", -c.Cost.(int))
	
	// Effect: Gain credits based on territory resource value
	creditsGained := target.Attributes.ResourceValue * 2
	context.ModifyResource(Criminal, "credits", creditsGained)
	
	// Add a temporary penalty to the territory
	target.Attributes.StabilityIndex = int(math.Max(0, float64(target.Attributes.StabilityIndex-5)))
	
	return true
}

// Corporation Cards Implementation

// SurveillanceGrid card implementation
type SurveillanceGrid struct {
	BaseCard
}

// NewSurveillanceGrid creates a new SurveillanceGrid card
func NewSurveillanceGrid() *SurveillanceGrid {
	return &SurveillanceGrid{
		BaseCard: BaseCard{
			ID:      "surveillance_grid",
			Name:    "Surveillance Grid",
			Type:    Infrastructure,
			Faction: NBN,
			Cost:    3,
		},
	}
}

// CanPlay checks if SurveillanceGrid can be played
func (c *SurveillanceGrid) CanPlay(context *GameContext, target *Territory) bool {
	if target == nil {
		return false
	}
	
	nbn := context.GetFactionByID(NBN)
	
	// Check if player has enough credits
	return nbn.Resources["credits"] >= c.Cost.(int)
}

// Play executes the card's effect
func (c *SurveillanceGrid) Play(context *GameContext, target *Territory) bool {
	// Pay the cost
	context.ModifyResource(NBN, "credits", -c.Cost.(int))
	
	// Effect 1: Increase security level
	target.Attributes.SecurityLevel = int(math.Min(5, float64(target.Attributes.SecurityLevel+1)))
	
	// Effect 2: Tag runners in territory
	// This is a persistent effect that would be checked when runners enter
	installation := Installation{
		ID:      fmt.Sprintf("surveillance_grid_%d", time.Now().UnixNano()),
		Faction: NBN,
		Type:    "infrastructure",
		Status:  Active,
		Effects: []CardEffect{
			{Type: "security_increase", Value: 1},
			{Type: "runner_tag", Value: 1},
		},
	}
	
	context.InstallOnTerritory(target, installation)
	
	return true
}

// ScorchedEarth card implementation
type ScorchedEarth struct {
	BaseCard
}

// NewScorchedEarth creates a new ScorchedEarth card
func NewScorchedEarth() *ScorchedEarth {
	return &ScorchedEarth{
		BaseCard: BaseCard{
			ID:      "scorched_earth",
			Name:    "Scorched Earth",
			Type:    Operation,
			Faction: Weyland,
			Cost:    4,
		},
	}
}

// CanPlay checks if ScorchedEarth can be played
func (c *ScorchedEarth) CanPlay(context *GameContext, target *Territory) bool {
	if target == nil {
		return false
	}
	
	weyland := context.GetFactionByID(Weyland)
	
	// Check if player has enough credits
	if weyland.Resources["credits"] < c.Cost.(int) {
		return false
	}
	
	// Scorched Earth can only be played if a runner is tagged
	hasTaggedRunner := false
	for _, faction := range context.Factions {
		if faction.Type == "runner" && faction.Tags > 0 {
			hasTaggedRunner = true
			break
		}
	}
	
	return hasTaggedRunner
}

// Play executes the card's effect
func (c *ScorchedEarth) Play(context *GameContext, target *Territory) bool {
	// Pay the cost
	context.ModifyResource(Weyland, "credits", -c.Cost.(int))
	
	// Effect: Damage to all runners in territory and infrastructure damage
	for factionID, faction := range context.Factions {
		if faction.Type == "runner" {
			// Apply damage to each runner
			context.DamageRunner(factionID, 3)
		}
	}
	
	// Damage runner installations
	for i := range target.Installations {
		if target.Installations[i].Faction == Criminal || 
		   target.Installations[i].Faction == Anarch || 
		   target.Installations[i].Faction == Shaper {
			target.Installations[i].Status = Damaged
			
			// Reduce effectiveness of effects
			for j := range target.Installations[i].Effects {
				if v, ok := target.Installations[i].Effects[j].Value.(int); ok {
					if v > 0 {
						target.Installations[i].Effects[j].Value = int(math.Max(1, float64(v/2)))
					} else if v < 0 {
						target.Installations[i].Effects[j].Value = int(math.Min(-1, float64(v/2)))
					}
				}
			}
		}
	}
	
	// Decrease stability and resource value
	target.Attributes.StabilityIndex = int(math.Max(0, float64(target.Attributes.StabilityIndex-10)))
	target.Attributes.ResourceValue = int(math.Max(1, float64(target.Attributes.ResourceValue-1)))
	target.Attributes.Population = int(math.Max(1, float64(target.Attributes.Population-1)))
	
	// Increase corporate influence
	target.Attributes.CorporateInfluence = int(math.Min(100, float64(target.Attributes.CorporateInfluence+15)))
	
	// Add a new effect to the territory
	aftermath := Installation{
		ID:       fmt.Sprintf("scorched_earth_aftermath_%d", time.Now().UnixNano()),
		Faction:  Weyland,
		Type:     "operation",
		Status:   Active,
		Duration: 2,
		Effects: []CardEffect{
			{Type: "territory_influence", Value: 15},
			{Type: "runner_damage_aura", Value: 1},
		},
	}
	
	context.InstallOnTerritory(target, aftermath)
	
	return true
}

// Function to create a card by ID
func CreateCard(id string) Card {
	switch id {
	case "backdoor_access":
		return NewBackdoorAccess()
	case "network_expansion":
		return NewNetworkExpansion()
	case "bank_job":
		return NewBankJob()
	case "surveillance_grid":
		return NewSurveillanceGrid()
	case "scorched_earth":
		return NewScorchedEarth()
	default:
		return nil
	}
}
