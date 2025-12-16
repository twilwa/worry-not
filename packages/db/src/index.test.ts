// ABOUTME: Tests for database package exports
// ABOUTME: Validates db package structure and schema exports
import { describe, expect, it } from "vitest";
import { getDbStatus, schema } from "./index.js";

describe("Database Package", () => {
  it("should export schema", () => {
    expect(schema).toBeDefined();
    expect(schema.users).toBeDefined();
  });

  it("should report database status", () => {
    const status = getDbStatus();
    expect(status.ready).toBe(true);
  });

  it("should have users table definition", () => {
    expect(schema.users).toBeDefined();
    expect(typeof schema.users).toBe("object");
  });
});
