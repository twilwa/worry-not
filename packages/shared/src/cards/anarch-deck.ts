// ABOUTME: Anarch starter deck card definitions
// ABOUTME: 12-card Runner deck focused on viruses, damage dealing, and risk/reward mechanics

import type { Card } from "../types";
import {
  createCreditCost,
  createActionCost,
  createGainCredits,
  createDealDamage,
  createInstallCard,
} from "../components";

/**
 * Anarch starter deck - 12 cards
 * Theme: Destructive, high-risk/high-reward, virus-based gameplay
 */
export const anarchDeck: Card[] = [
  // Economy cards
  {
    id: "anarch-001",
    name: "Sure Gamble",
    type: "SCENARIO",
    faction: "RUNNER",
    cost: 5,
    components: [createCreditCost(5), createGainCredits(9)],
  },
  {
    id: "anarch-002",
    name: "Day Job",
    type: "OVERWORLD",
    faction: "RUNNER",
    cost: 0,
    components: [createActionCost(4), createGainCredits(10)],
  },
  {
    id: "anarch-003",
    name: "Liberated Account",
    type: "SCENARIO",
    faction: "RUNNER",
    cost: 2,
    components: [createCreditCost(2), createGainCredits(4)],
  },

  // Icebreakers
  {
    id: "anarch-004",
    name: "Corroder",
    type: "SCENARIO",
    faction: "RUNNER",
    cost: 2,
    components: [createCreditCost(2), createInstallCard()],
  },
  {
    id: "anarch-005",
    name: "Yog.0",
    type: "SCENARIO",
    faction: "RUNNER",
    cost: 0,
    components: [createInstallCard()],
  },
  {
    id: "anarch-006",
    name: "Mimic",
    type: "SCENARIO",
    faction: "RUNNER",
    cost: 3,
    components: [createCreditCost(3), createInstallCard()],
  },

  // Virus programs - Anarch signature
  {
    id: "anarch-007",
    name: "Datasucker",
    type: "SCENARIO",
    faction: "RUNNER",
    cost: 1,
    components: [createCreditCost(1), createInstallCard()],
  },
  {
    id: "anarch-008",
    name: "Imp",
    type: "SCENARIO",
    faction: "RUNNER",
    cost: 3,
    components: [createCreditCost(3), createInstallCard()],
  },

  // Destructive/Damage cards - Anarch theme
  {
    id: "anarch-009",
    name: "Demolition Run",
    type: "SCENARIO",
    faction: "RUNNER",
    cost: 2,
    components: [
      createCreditCost(2),
      createActionCost(1),
      createDealDamage(3, "NET"),
    ],
  },
  {
    id: "anarch-010",
    name: "Inject",
    type: "SCENARIO",
    faction: "RUNNER",
    cost: 0,
    components: [createDealDamage(1, "BRAIN"), createGainCredits(1)],
  },

  // High-risk/high-reward cards
  {
    id: "anarch-011",
    name: "Stimhack",
    type: "SCENARIO",
    faction: "RUNNER",
    cost: 0,
    components: [createGainCredits(9), createDealDamage(1, "BRAIN")],
  },
  {
    id: "anarch-012",
    name: "Amped Up",
    type: "SCENARIO",
    faction: "RUNNER",
    cost: 2,
    components: [
      createCreditCost(2),
      createActionCost(3),
      createDealDamage(1, "BRAIN"),
    ],
  },
];
