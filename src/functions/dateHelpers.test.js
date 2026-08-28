import { describe, expect, it } from "vitest";

import { formatDate, parseDate } from "./dateHelpers";

describe("parseDate", () => {
  it("accepts leap days in Gregorian leap years", () => {
    expect(formatDate(parseDate("2000-02-29"))).toBe("2000-02-29");
  });

  it("rejects leap days in non-leap century years", () => {
    expect(parseDate("2100-02-29")).toBeNull();
  });

  it("rejects impossible calendar dates", () => {
    expect(parseDate("2026-04-31")).toBeNull();
  });
});
