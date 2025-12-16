## End of Line: Game Mechanics Document

**Version:** 1.0 (Prototype Focus)

### 1. Executive Summary

**Game Name:** End of Line

**High Concept:** End of Line is a browser-based, multiplayer PvPvE roguelike deckbuilder. Players align with asymmetric Corporation or Runner factions, competing for control over a cyberpunk city's hex-grid territory. Gameplay alternates between a strategic Overworld layer (territory control, resource management, long-term planning via cards) and tactical Scenario Missions (instanced, card-based encounters, often RPG-like). Success hinges on mastering the interplay between these layers, with persistent character/faction progression offering roguelike depth.

**Key Features:**

- **Asymmetric Factions:** Corporations (strategic commanders) vs. Runners (tactical soldiers).
    
- **Dual-Layer Gameplay:** Strategic Overworld map influencing Tactical Scenario missions, and vice-versa.
    
- **Territory Control:** Hex-grid city map with dynamic influence, resource generation, and control mechanics.
    
- **Dual Card Systems:** Distinct card pools and mechanics for Overworld strategy and Scenario tactics.
    
- **Deckbuilding & Roguelike Progression:** Build and evolve decks; persistent upgrades unlock across runs.
    
- **PvPvE Environment:** Compete against human opponents while navigating AI-controlled threats and city events.
    
- **Browser-Based Multiplayer:** Accessible, real-time and potentially asynchronous gameplay.
    

**Target Audience:** Fans of strategic card games (Netrunner), cyberpunk settings, RPGs, roguelike deckbuilders, and territory control games.

**Unique Value Proposition:** End of Line merges the strategic depth of asymmetric territory control with the tactical excitement of instanced deckbuilding missions, framed within a persistent roguelike structure. The core innovation lies in the dynamic feedback loop between the city-level strategic game and the mission-level tactical encounters.

---

### 2. Core Game Concept

End of Line unfolds in CyberCity, a metropolis dominated by megacorporations. Players choose a faction and engage in a struggle for control across two interconnected layers:

1. **The Overworld (Strategic Layer):** A hex-based map of CyberCity. Gameplay here is turn-based or uses a slower real-time clock. Players use **Overworld Cards** to deploy infrastructure, establish networks, advance agendas, manage resources, and exert influence over territories.
    
    - **Corporation Role (Commander/GM):** Focuses on building, defending, generating resources, setting traps, advancing long-term agendas, and defining the "scenario conditions" runners face. Their actions shape the map and the challenges within it.
        
    - **Runner Role (Soldier/PC):** Focuses on scouting, disrupting corporate plans, establishing hidden networks, executing targeted strikes (missions), and exploiting weaknesses in the corporate structure. Their actions are often reactions to or subversions of the Corp's strategic setup.
        
2. **Scenario Missions (Tactical Layer):** Instanced, focused encounters triggered by Overworld actions or states. Gameplay here is typically turn-based, using **Scenario Cards** for actions like hacking, combat, stealth, and utility. Missions often have RPG-like objectives.
    
    - **Corporation Role Interaction:** Corporations primarily influence scenarios before they happen via Overworld setup (installing ICE, setting security levels). Direct interaction during a mission is limited (AI defenses, pre-set traps), except potentially for specific factions like Haas-Bioroid which might deploy controllable units.
        
    - **Runner Role Execution:** Runners directly participate in missions, playing cards, managing tactical resources (like Memory Units), overcoming obstacles (ICE, guards), and achieving objectives (stealing data, sabotage). Multiple Runners can potentially team up for complex missions.
        

**The Interplay is Key:** Overworld state dictates mission parameters (difficulty, layout, available objectives, initial resources). Mission outcomes directly impact the Overworld (changing influence, destroying assets, stealing agendas, providing resources/cards).

---

### 3. Faction Design

Factions are fundamentally asymmetric, reflecting the core Corp vs. Runner dynamic.

#### Corporation Factions (Commanders)

- **Goal:** Territory domination, agenda completion, resource accumulation. Long-term strategic control.
    
- **Gameplay Focus:** Building infrastructure, deploying defenses (ICE, Security), managing economy, advancing hidden agendas, reacting to Runner threats on the Overworld map. Setting the stage.
    
- **Card Focus (Overworld):** Infrastructure, Assets, Agendas, Operations (strategic effects).
    
- **Card Focus (Scenario):** ICE, Traps, defensive Assets (mostly placed via Overworld actions, activated during Scenarios).
    
- **Example Factions:**
    
    - **Weyland:** Brute force, resource dominance, physical security, meat damage. Strong territory builders.
        
    - **NBN:** Information control, tagging, media manipulation, surveillance. Excel at tracking and punishing Runners.
        
    - **Jinteki:** Deception, traps, net damage, bio-engineering. Focus on psychological warfare and hidden threats.
        
    - **Haas-Bioroid:** Efficiency, automation, advanced AI/Bioroids. May have more direct tactical options via controllable units.
        

#### Runner Factions (Soldiers)

- **Goal:** Agenda disruption/theft, specialized territory control (e.g., network hubs), mission completion, survival. Tactical disruption and objective focus.
    
- **Gameplay Focus:** Infiltrating secure locations (triggering Scenarios), bypassing defenses, acquiring resources illicitly, executing specific mission objectives, building efficient tactical decks. Reacting to and subverting the stage set by Corps.
    
- **Card Focus (Overworld):** Network building, Resource acquisition events, Disruption operations.
    
- **Card Focus (Scenario):** Icebreakers (Programs), Hardware, Events (tactical tricks), Resources (temporary boosts).
    
- **Example Factions:**
    
    - **Criminal:** Stealth, bypass, economic manipulation, connections. Excel at hitting undefended resources and avoiding direct confrontation.
        
    - **Anarch:** Chaos, viruses, destruction, direct confrontation. Strong at breaking defenses but often at a cost.
        
    - **Shaper:** Innovation, efficiency, program manipulation, hardware focus. Excel at building complex rigs and finding optimal solutions.
        

---

### 4. Core Gameplay Loops

#### A. Strategic Overworld Loop (Slower Pace)

1. **Upkeep Phase:** Gain resources based on controlled territories, resolve ongoing effects (e.g., virus counters tick up, infrastructure maintenance costs paid).
    
2. **Action Phase:** Players (Corps and Runners) take turns playing **Overworld Cards** and spending resources/actions to:
    
    - **Corps:** Install infrastructure/assets/ICE on territories, advance agendas, deploy security, launch strategic operations (e.g., security sweep, media campaign).
        
    - **Runners:** Establish network links, play resource-generating events, scout territories, initiate disruption operations (e.g., sabotage, incite unrest), prepare for a run (triggering a Scenario).
        
3. **Resolution Phase:** Overworld card effects resolve, influence shifts, territory attributes update. Check for triggered events or victory conditions.
    

#### B. Tactical Scenario Loop (Faster Pace, Instanced)

1. **Trigger:** Initiated by a Runner Overworld action (e.g., "Run on Server X") or potentially a Corp action (e.g., "Deploy Security Team to apprehend Runner"). Overworld state (security level, installed ICE/Assets in target territory) determines mission parameters.
    
2. **Setup:** Mission instance generated based on parameters. Runner(s) draw starting hand from their **Scenario Deck**. Corp defenses (ICE, traps) are placed based on Overworld installations.
    
3. **Action Phase (Turn-Based):**
    
    - **Runner Turn:** Gain actions/resources, play **Scenario Cards** (install programs/hardware, play events), move through the scenario map (physical or virtual), interact with objectives, attempt to bypass ICE.
        
    - **Corp Response/AI Turn:** Automated defenses activate, ICE subroutines trigger if encountered, traps spring, AI guards react. (Limited direct Corp player control, unless specific faction/mechanic allows).
        
4. **Resolution:** Mission objective achieved (success) or Runner forced out/defeated (failure).
    
5. **Outcome Application:** Mission result immediately impacts the **Overworld Layer**.
    

#### C. Interplay Loop (The Crucial Connection)

This loop describes the feedback between the two layers:

1. **Overworld State → Scenario Setup:**
    
    - **Territory Security Level:** Sets base difficulty, number/strength of AI guards/obstacles.
        
    - **Corp Infrastructure/ICE Installations:** Define the specific challenges (ICE types, trap density, server layout) within the Scenario.
        
    - **Runner Network Presence:** May provide starting advantages, alternate entry points, or resource boosts for the Scenario.
        
    - **Active Agendas/Corp Operations:** Can add specific objectives or modifiers to the Scenario.
        
    - **Current Events/Territory Stability:** Can add environmental hazards or opportunities within the Scenario.
        
2. **Scenario Outcome → Overworld State Change:**
    
    - **Successful Run (Agenda Stolen):** Agenda removed from Corp control on Overworld, Runner gains VP/objective progress.
        
    - **Successful Run (Sabotage):** Corp infrastructure/asset is damaged or destroyed on the Overworld map, impacting Corp resources/influence.
        
    - **Successful Run (Data Theft):** Runner gains resources (Credits, Intel), potentially reveals hidden Corp info on Overworld.
        
    - **Failed Run (Runner Defeated/Traced):** Runner may lose resources, suffer penalties (tags), or have their network presence damaged on Overworld. Corp may gain influence/security in the territory.
        
    - **Any Run:** Increases Corp awareness, potentially raising security level or triggering Corp response operations on the Overworld in subsequent turns.
        
3. **Overworld State → Deckbuilding/Market:**
    
    - **Territory Control:** Influences which cards appear in the shared or faction-specific "Market" from which players acquire both Overworld and Scenario cards. Controlling a tech district might make advanced programs available; controlling a black market might offer illicit Runner gear.
        
    - **Faction Reputation/Influence:** Can unlock access to specific faction cards or provide discounts.
        
    - **Resources:** Overworld resource generation fuels card acquisition.
        

---

### 5. Key Mechanics

- **Overworld Territory Control:**
    
    - **Hex Grid:** City divided into sectors with distinct types (Corporate, Fringe, Underground) and attributes (Security, Resources, Stability).
        
    - **Influence:** Players place influence via cards/actions. Thresholds (e.g., 40%, 60%, 80%) grant increasing levels of control and benefits. Contested territories offer reduced benefits. Corps typically use infrastructure/assets; Runners use hidden networks/safehouses.
        
    - **Resources:** Generated passively based on territory control (Credits, Data, Faction-Specific). Used for playing cards, activating abilities, acquiring new cards.
        
- **Dual Card System:**
    
    - **Overworld Cards:** Strategic focus. Types: Infrastructure, Operations, Agendas (Corp), Network, Events, Resources (Runner). Slower play, persistent effects.
        
    - **Scenario Cards:** Tactical focus. Types: ICE, Assets, Traps (Corp Defenses), Programs, Hardware, Events, Resources (Runner Tools). Faster play, immediate effects within a mission.
        
    - **Deckbuilding:** Players construct separate Overworld and Scenario decks. Max size may scale with progression. Standard draw/discard mechanics, potentially with unique twists (e.g., Aeon's End no-shuffle discard for tactical deck).
        
    - **Market/Acquisition:** A shared or rotating market (inspired by Valley of the Kings/Tyrants) where players spend Overworld resources to buy both types of cards. Market inventory influenced by territory control.
        
- **Scenario Mission Gameplay:**
    
    - **Triggers:** Overworld actions (Runner initiating a run, Corp deploying security) or reaching certain Overworld states (agenda vulnerability).
        
    - **Structure:** Setup (based on Overworld state) -> Turn-Based Action Phase (card play, movement, interaction) -> Resolution (success/failure) -> Overworld Impact.
        
    - **Objectives:** Data theft, sabotage, infiltration, defense, VIP extraction/protection, etc. Often asymmetric (Runner tries to steal, Corp tries to protect).
        
- **Character/Faction Progression (Roguelike Element):**
    
    - Experience gained from Overworld actions and Scenario missions.
        
    - Leveling up grants access to new cards, abilities (Overworld/Scenario), and potentially specialization paths (e.g., Criminal -> Infiltrator or Fixer).
        
    - Persistent unlocks (new cards added to potential pool, starting bonuses, faction abilities) carry over between runs/sessions. Failure might mean restarting a character/run but retaining meta-progression.
        
- **PvPvE Integration:**
    
    - **PvP:** Direct competition for territory control, resource denial, counter-playing Overworld strategies, potentially interfering in opponent Scenarios (e.g., Corp tracing an active run).
        
    - **PvE:** AI-controlled neutral factions/security forces, automated defenses in Scenarios, random city events impacting all players, territory hazards. Provides ambient challenge and complicates PvP interactions.
        
- **Victory Conditions:**
    
    - Multiple paths: Territory Dominance (% controlled), Agenda Points (Corp scoring/Runner stealing), Economic Victory (resource threshold), Key Mission Completion (narrative victory). A point system might track progress across paths. Game likely ends when a faction meets a condition or after a set number of turns/time limit.
        

---

### 6. Gameplay Example Walkthrough

1. **Overworld - Corp Turn (Weyland):** Weyland controls the "Industrial Zone" (Influence 70%). They play an **Overworld Card** "Fortified Infrastructure" (Cost: 5 Credits) on the Industrial Zone.
    
    - **Overworld Effect:** Industrial Zone Security Level increases from 3 to 4. Weyland Influence increases to 75%. Weyland spends 5 Credits.
        
2. **Overworld - Runner Turn (Anarch):** Anarch sees the fortified zone. They need resources. They play an **Overworld Card** "Smash and Grab" (Cost: 2 Credits) targeting the adjacent, less secure "Fringe Zone" (Corp Influence 40%).
    
    - **Overworld Effect:** Anarch gains 4 Credits immediately. Fringe Zone Stability decreases by 10%. This action triggers a potential Corp response or increased awareness in the Fringe Zone for next turn. Anarch spends 2 Credits.
        
3. **Overworld - Runner Turn (Anarch) - Cont.:** Anarch decides to hit the newly fortified "Industrial Zone". They play an **Overworld Action** "Initiate Run on R&D Server" targeting the Industrial Zone.
    
    - **Interplay Effect:** This triggers a **Scenario Mission**.
        
4. **Scenario Mission - Setup:**
    
    - **Parameters (from Overworld):** Mission Difficulty set by Security Level 4. Weyland's "Fortified Infrastructure" means the Scenario map includes extra defensive turrets and stronger ICE templates (e.g., Reinforced Wall).
        
    - **Deck:** Anarch uses their **Scenario Deck**. Draws 5 cards.
        
    - **Map:** Instance of the Industrial Zone R&D server is generated.
        
5. **Scenario Mission - Turn 1 (Anarch):**
    
    - Anarch plays **Scenario Card** "Datasucker" (Virus Program).
        
    - Plays **Scenario Card** "Demolisher" (Icebreaker).
        
    - Uses actions to approach the first ICE.
        
6. **Scenario Mission - Corp Response:**
    
    - The first ICE is revealed: Reinforced Wall (Strength 4 Barrier, based on Weyland presence and Infrastructure).
        
7. **Scenario Mission - Turn 2 (Anarch):**
    
    - Anarch plays **Scenario Event** "Stimhack", gaining temporary credits and actions but taking 1 Brain Damage (a persistent negative effect carried back to Overworld potentially).
        
    - Uses boosted credits to pump "Demolisher" strength.
        
    - Breaks Reinforced Wall subroutines. The ICE is not trashed easily due to Weyland's theme. Anarch gains a virus counter on "Datasucker".
        
8. **Scenario Mission - Resolution (Example: Success):** Anarch eventually reaches the R&D server, accesses cards, and finds/steals a "Project Atlas" Agenda card.
    
    - **Interplay Effect:** Scenario ends.
        
9. **Overworld - Aftermath:**
    
    - **Weyland:** Loses the "Project Atlas" card from their potential scoring pool on the Overworld. Their score potential decreases.
        
    - **Anarch:** Gains VP/progress towards their victory condition. Gains XP for progression.
        
    - **Industrial Zone:** Security might temporarily increase further due to the breach. Weyland might get an alert prompting a response action next turn. The "Fortified Infrastructure" remains unless specifically sabotaged in the run.
        

---

### 7. Prototyping Focus

To validate the core concept quickly, the initial prototype should focus on:

1. **Core Overworld Loop:** Implement basic hex map, ability to place influence/simple assets via card play (e.g., 1 Corp faction, 1 Runner faction), basic resource generation tied to influence.
    
2. **Core Scenario Loop:** Implement a minimal Scenario instance triggered by an Overworld action. Include basic card draw/play for the Runner, simple objectives (e.g., reach point A), and basic AI obstacles representing Corp defenses (e.g., 1-2 types of static ICE).
    
3. **The Interplay Connection:**
    
    - **Overworld → Scenario:** Ensure at least one Overworld state variable (e.g., Territory Security Level) demonstrably affects the Scenario setup (e.g., number of obstacles).
        
    - **Scenario → Overworld:** Ensure the Scenario outcome (Success/Fail) demonstrably affects the Overworld state (e.g., changes influence in the target territory, grants resources).
        
4. **Minimal Factions:** Implement 1 Corp (e.g., Weyland - focuses on building/defense) and 1 Runner (e.g., Anarch - focuses on breaking/disruption) with a small, distinct set of Overworld and Scenario cards reflecting their roles.
    

This focused prototype will test the fundamental interaction between the two layers, which is the core innovation and riskiest part of the design.