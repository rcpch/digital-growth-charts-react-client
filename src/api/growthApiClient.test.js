import { describe, expect, it, vi } from "vitest";

import legacyMeasurements from "../example-scenarios/normal/uk-who/height/female/data.json";
import { buildGrowthApiUrl, requestGrowthApi } from "./growthApiClient";

const inputParameters = {
  birth_date: "1759-04-11",
  observation_date: "1759-07-11",
  observation_value: 59.4,
  measurement_method: "height",
  sex: "female",
  gestation_weeks: 40,
  gestation_days: 0,
};

const jsonResponse = (body, { status = 200, headers = {} } = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...headers },
  });

describe("buildGrowthApiUrl", () => {
  it("builds calculation and utility URLs without duplicate slashes", () => {
    expect(
      buildGrowthApiUrl("https://api.example/growth/v1/", "uk-who", "calculation")
    ).toBe("https://api.example/growth/v1/uk-who/calculation");
    expect(
      buildGrowthApiUrl(
        "https://api.example/growth/v1",
        "uk-who",
        "mid-parental-height"
      )
    ).toBe("https://api.example/growth/v1/utilities/mid-parental-height");
  });

  it("rejects missing configuration and unsupported references", () => {
    expect(() => buildGrowthApiUrl(undefined, "uk-who", "calculation")).toThrow(
      /absolute URL/
    );
    expect(() =>
      buildGrowthApiUrl("https://api.example", "future", "calculation")
    ).toThrow(/Unsupported growth reference/);
  });
});

describe("requestGrowthApi", () => {
  it("sends the exact request and validates the response", async () => {
    const fetchImpl = vi.fn(async () => jsonResponse(legacyMeasurements[0]));

    const result = await requestGrowthApi({
      inputParameters,
      reference: "uk-who",
      mode: "calculation",
      baseUrl: "https://api.example/growth/v1",
      publicDemoKey: "public-demo-key",
      fetchImpl,
    });

    expect(result).toStrictEqual(legacyMeasurements[0]);
    expect(fetchImpl).toHaveBeenCalledWith(
      "https://api.example/growth/v1/uk-who/calculation",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify(inputParameters),
        headers: {
          "Content-Type": "application/json",
          "Subscription-Key": "public-demo-key",
        },
      })
    );
  });

  it("accepts a fictional-child array and rejects an object", async () => {
    const validFetch = vi.fn(async () => jsonResponse(legacyMeasurements));
    await expect(
      requestGrowthApi({
        inputParameters,
        reference: "uk-who",
        mode: "fictional-child-data",
        baseUrl: "https://api.example/growth/v1",
        fetchImpl: validFetch,
      })
    ).resolves.toHaveLength(legacyMeasurements.length);

    const invalidFetch = vi.fn(async () => jsonResponse(legacyMeasurements[0]));
    await expect(
      requestGrowthApi({
        inputParameters,
        reference: "uk-who",
        mode: "fictional-child-data",
        baseUrl: "https://api.example/growth/v1",
        fetchImpl: invalidFetch,
      })
    ).rejects.toThrow(/non-empty array/);
  });

  it("normalizes FastAPI validation errors and preserves retry metadata", async () => {
    const fetchImpl = vi.fn(async () =>
      jsonResponse(
        { detail: [{ type: "value_error", loc: ["body"], msg: "Invalid value" }] },
        { status: 429, headers: { "Retry-After": "30" } }
      )
    );

    const request = requestGrowthApi({
      inputParameters,
      reference: "uk-who",
      mode: "calculation",
      baseUrl: "https://api.example/growth/v1",
      fetchImpl,
    });

    await expect(request).rejects.toMatchObject({
      message: "429 Invalid value",
      statusCode: 429,
      retryAfter: "30",
    });
  });

  it("rejects HTTP 200 error-shaped data before it reaches the chart", async () => {
    const fetchImpl = vi.fn(async () => jsonResponse({ detail: [] }));

    await expect(
      requestGrowthApi({
        inputParameters,
        reference: "uk-who",
        mode: "calculation",
        baseUrl: "https://api.example/growth/v1",
        fetchImpl,
      })
    ).rejects.toThrow(/API contract mismatch/);
  });
});
