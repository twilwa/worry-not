import { getVersion } from "@end-of-line/shared";
// ABOUTME: Tests for App component
// ABOUTME: Validates that client can import from shared package
import { describe, expect, it } from "vitest";

describe("App Component Integration", () => {
  it("should import from @end-of-line/shared", () => {
    expect(getVersion()).toBe("0.1.0");
  });

  it("should have shared package available", () => {
    expect(typeof getVersion).toBe("function");
  });
});
