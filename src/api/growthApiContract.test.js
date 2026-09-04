import { describe, expect, it } from "vitest";

import legacyMeasurements from "../example-scenarios/normal/uk-who/height/female/data.json";
import midParentalHeight from "../example-scenarios/normal/uk-who/height/female/mid-parental-height.json";
import {
  GrowthApiContractError,
  validateFictionalChildResponse,
  validateMidParentalHeightResponse,
  validateMeasurementResponse,
} from "./growthApiContract";

const legacyMeasurement = legacyMeasurements[0];
const provenance = {
  growth_reference: "uk-who",
  calculation_engine: {
    name: "rcpchgrowth",
    version: "4.6.0",
    commit: "unknown",
  },
};
const expectations = {
  reference: "uk-who",
  measurementMethod: "height",
  sex: "female",
};

describe("validateMeasurementResponse", () => {
  it("accepts the legacy v4 response shape during migration", () => {
    expect(validateMeasurementResponse(legacyMeasurement, expectations)).toBe(
      legacyMeasurement
    );
  });

  it("accepts a provenance-bearing v5 response", () => {
    const measurement = { ...legacyMeasurement, provenance };

    expect(
      validateMeasurementResponse(measurement, {
        ...expectations,
        requireProvenance: true,
      })
    ).toBe(measurement);
  });

  it("rejects a response for a different reference", () => {
    const measurement = {
      ...legacyMeasurement,
      provenance: { ...provenance, growth_reference: "cdc" },
    };

    expect(() =>
      validateMeasurementResponse(measurement, expectations)
    ).toThrow(/growth_reference does not match/);
  });

  it("rejects mismatched patient and measurement identity", () => {
    expect(() =>
      validateMeasurementResponse(legacyMeasurement, {
        ...expectations,
        sex: "male",
        measurementMethod: "weight",
      })
    ).toThrow(/sex does not match.*measurement_method does not match/);
  });

  it("rejects missing chart coordinates before rendering", () => {
    const measurement = structuredClone(legacyMeasurement);
    delete measurement.plottable_data.centile_data.corrected_decimal_age_data;

    expect(() =>
      validateMeasurementResponse(measurement, expectations)
    ).toThrow(GrowthApiContractError);
  });

  it("rejects non-finite observation values", () => {
    const measurement = structuredClone(legacyMeasurement);
    measurement.child_observation_value.observation_value = Number.NaN;

    expect(() =>
      validateMeasurementResponse(measurement, expectations)
    ).toThrow(/observation_value must be finite/);
  });
});

describe("validateMidParentalHeightResponse", () => {
  it("accepts the complete utility response used by the chart", () => {
    expect(validateMidParentalHeightResponse(midParentalHeight)).toBe(
      midParentalHeight
    );
  });

  it("rejects missing utility coordinates", () => {
    const response = structuredClone(midParentalHeight);
    delete response.mid_parental_height_centile_data;

    expect(() => validateMidParentalHeightResponse(response)).toThrow(
      /centile_data must be a non-empty array/
    );
  });
});

describe("validateFictionalChildResponse", () => {
  it("validates every measurement in an API array", () => {
    expect(
      validateFictionalChildResponse(legacyMeasurements, expectations)
    ).toHaveLength(legacyMeasurements.length);
  });

  it("rejects the wrong endpoint response shape", () => {
    expect(() =>
      validateFictionalChildResponse(legacyMeasurement, expectations)
    ).toThrow(/non-empty array/);
  });
});
