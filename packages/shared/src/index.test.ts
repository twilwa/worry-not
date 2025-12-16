// ABOUTME: Tests for shared package main exports
// ABOUTME: Validates monorepo setup and basic functionality
import { describe, expect, it } from "vitest";
import { getVersion, validateMonorepo } from "./index.js";

describe("Monorepo Setup Validation", () => {
  it("should validate monorepo configuration", () => {
    expect(validateMonorepo()).toBe(true);
  });

  it("should return correct version", () => {
    expect(getVersion()).toBe("0.1.0");
  });

  it("should export functions correctly", () => {
    expect(typeof validateMonorepo).toBe("function");
    expect(typeof getVersion).toBe("function");
  });
});
