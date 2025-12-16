// ABOUTME: Weyland starter deck definition
// ABOUTME: Corp faction focused on resource generation, agenda advancement, and meat damage

import type { Card } from "../types";
import {
  createCreditCost,
  createActionCost,
  createGainCredits,
  createDealDamage,
  createInstallCard,
} from "../components";

/**
 * Weyland Consortium starter deck
 * Theme: Heavy industry, resource extraction, hostile takeovers, and brutal responses
 */
export const weylandDeck: Card[] = [
  // Resource Generation Cards
  {
    id: "weyland-001",
    name: "Corporate Investment",
    type: "OVERWORLD",
    faction: "CORP",
    cost: 1,
    components: [createActionCost(1), createGainCredits(4)],
  },
  {
    id: "weyland-002",
    name: "Mineral Rights",
    type: "OVERWORLD",
    faction: "CORP",
    cost: 2,
    components: [
      createCreditCost(2),
      createActionCost(1),
      createGainCredits(6),
    ],
  },
  {
    id: "weyland-003",
    name: "Government Contract",
    type: "OVERWORLD",
    faction: "CORP",
    cost: 0,
    components: [createActionCost(2), createGainCredits(8)],
  },

  // Agenda Advancement Cards
  {
    id: "weyland-004",
    name: "Hostile Takeover",
    type: "OVERWORLD",
    faction: "CORP",
    cost: 3,
    components: [
      createCreditCost(3),
      createActionCost(1),
      createGainCredits(7),
      createDealDamage(1, "MEAT"),
    ],
  },
  {
    id: "weyland-005",
    name: "Priority Construction",
    type: "OVERWORLD",
    faction: "CORP",
    cost: 0,
    components: [createActionCost(1), createInstallCard()],
  },

  // ICE and Defensive Cards
  {
    id: "weyland-006",
    name: "Wall of Steel",
    type: "SCENARIO",
    faction: "CORP",
    cost: 5,
    components: [createCreditCost(5), createActionCost(1), createInstallCard()],
  },
  {
    id: "weyland-007",
    name: "Hadrian's Wall",
    type: "SCENARIO",
    faction: "CORP",
    cost: 8,
    components: [createCreditCost(8), createActionCost(2), createInstallCard()],
  },
  {
    id: "weyland-008",
    name: "Ice Wall",
    type: "SCENARIO",
    faction: "CORP",
    cost: 3,
    components: [createCreditCost(3), createActionCost(1), createInstallCard()],
  },

  // Meat Damage Cards
  {
    id: "weyland-009",
    name: "Scorched Earth",
    type: "SCENARIO",
    faction: "CORP",
    cost: 5,
    components: [
      createCreditCost(5),
      createActionCost(1),
      createDealDamage(4, "MEAT"),
    ],
  },
  {
    id: "weyland-010",
    name: "Armed Response",
    type: "SCENARIO",
    faction: "CORP",
    cost: 3,
    components: [
      createCreditCost(3),
      createActionCost(1),
      createDealDamage(2, "MEAT"),
    ],
  },

  // Hybrid Cards
  {
    id: "weyland-011",
    name: "Security Breach Response",
    type: "SCENARIO",
    faction: "CORP",
    cost: 2,
    components: [
      createCreditCost(2),
      createActionCost(1),
      createDealDamage(1, "MEAT"),
      createGainCredits(3),
    ],
  },
  {
    id: "weyland-012",
    name: "Intimidation Tactics",
    type: "OVERWORLD",
    faction: "CORP",
    cost: 4,
    components: [
      createCreditCost(4),
      createActionCost(1),
      createDealDamage(3, "MEAT"),
    ],
  },

  // Economic ICE
  {
    id: "weyland-013",
    name: "Tollbooth Barrier",
    type: "SCENARIO",
    faction: "CORP",
    cost: 4,
    components: [
      createCreditCost(4),
      createActionCost(1),
      createInstallCard(),
      createGainCredits(2),
    ],
  },

  // High-Value Resource Play
  {
    id: "weyland-014",
    name: "Corporate War Chest",
    type: "OVERWORLD",
    faction: "CORP",
    cost: 5,
    components: [
      createCreditCost(5),
      createActionCost(2),
      createGainCredits(12),
    ],
  },

  // Tactical Pressure
  {
    id: "weyland-015",
    name: "Heavy Artillery",
    type: "SCENARIO",
    faction: "CORP",
    cost: 6,
    components: [
      createCreditCost(6),
      createActionCost(2),
      createDealDamage(5, "MEAT"),
    ],
  },
];
