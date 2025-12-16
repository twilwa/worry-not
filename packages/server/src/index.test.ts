import { getVersion } from "@end-of-line/shared";
// ABOUTME: Tests for server API endpoints
// ABOUTME: Validates server can import from shared package
import { describe, expect, it } from "vitest";
import app from "./index.js";

describe("Server Integration", () => {
  it("should import from @end-of-line/shared", () => {
    expect(getVersion()).toBe("0.1.0");
  });

  it("should have Hono app configured", () => {
    expect(app.port).toBe(3001);
    expect(typeof app.fetch).toBe("function");
  });

  it("should return correct API response structure", async () => {
    const req = new Request("http://localhost:3001/");
    const res = await app.fetch(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toEqual({
      name: "End of Line API",
      version: "0.1.0",
    });
  });

  it("should have health endpoint", async () => {
    const req = new Request("http://localhost:3001/health");
    const res = await app.fetch(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toEqual({ status: "ok" });
  });
});
