// ABOUTME: Database package entry point with Drizzle client setup
// ABOUTME: Exports schema and database connection utilities
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema/index.js";

export { schema };

/**
 * Creates a database connection
 * @param connectionString - PostgreSQL connection string
 * @returns Drizzle database instance
 */
export function createDb(connectionString: string) {
  const client = postgres(connectionString);
  return drizzle(client, { schema });
}

/**
 * Gets the default database instance (for testing)
 * @returns Database connection status
 */
export function getDbStatus(): { ready: boolean } {
  return { ready: true };
}
