// ABOUTME: Database schema definitions using Drizzle ORM
// ABOUTME: Placeholder for game tables (territories, cards, players, etc.)
import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
