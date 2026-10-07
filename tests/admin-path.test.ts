import { describe, expect, it } from "vitest";
import { isValidAdminPath } from "@/lib/admin-path";

describe("isValidAdminPath", () => {
  it("accepts long lowercase paths containing random characters", () => {
    expect(isValidAdminPath("/panel-a1b2c3d4e5f60718293a4b5c6d7e8f90")).toBe(true);
  });

  it("rejects the default and short admin paths", () => {
    expect(isValidAdminPath("/admin")).toBe(false);
    expect(isValidAdminPath("/panel-short")).toBe(false);
  });

  it("rejects placeholders and invalid path characters", () => {
    expect(isValidAdminPath("/replace-with-a-long-random-path-1234567890")).toBe(false);
    expect(isValidAdminPath("/panel_invalid-path-123456789012345678")).toBe(false);
  });
});
