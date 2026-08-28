import { describe, expect, it } from "vitest";

import { validateFictionalChildResponse } from "../api/growthApiContract";

const dataFiles = import.meta.glob("./**/data.json", { eager: true });
const midParentalHeightFiles = import.meta.glob(
  "./**/mid-parental-height.json",
  { eager: true }
);

const pathIdentity = (path) => {
  const [condition, reference, measurementMethod, sex] = path
    .replace("./", "")
    .split("/");
  return { condition, reference, measurementMethod, sex };
};

describe("fictional child fixture registry", () => {
  it("validates every bundled API-shaped dataset", () => {
    expect(Object.keys(dataFiles).length).toBeGreaterThan(0);

    for (const [path, module] of Object.entries(dataFiles)) {
      const { reference, measurementMethod, sex } = pathIdentity(path);
      const measurements = module.default ?? module;

      expect(() =>
        validateFictionalChildResponse(measurements, {
          reference,
          measurementMethod,
          sex,
        })
      ).not.toThrow();
    }
  });

  it("keeps each dataset ordered and tied to one patient", () => {
    for (const [path, module] of Object.entries(dataFiles)) {
      const { sex } = pathIdentity(path);
      const measurements = module.default ?? module;
      const birthDates = new Set(
        measurements.map((measurement) => measurement.birth_data.birth_date)
      );
      const gestations = new Set(
        measurements.map(
          (measurement) =>
            `${measurement.birth_data.gestation_weeks}+${measurement.birth_data.gestation_days}`
        )
      );
      const observationDates = measurements.map((measurement) =>
        Date.parse(measurement.measurement_dates.observation_date)
      );

      expect(birthDates, path).toHaveLength(1);
      expect(gestations, path).toHaveLength(1);
      expect(
        measurements.every((measurement) => measurement.birth_data.sex === sex),
        path
      ).toBe(true);
      expect(observationDates, path).toStrictEqual(
        [...observationDates].sort((left, right) => left - right)
      );
    }
  });

  it("has both-sex mid-parental-height fixtures for each declared condition", () => {
    const conditions = [
      "growth-hormone-deficiency",
      "normal",
      "short-stature",
      "tall-stature",
    ];

    for (const condition of conditions) {
      for (const sex of ["female", "male"]) {
        expect(
          midParentalHeightFiles[
            `./${condition}/uk-who/height/${sex}/mid-parental-height.json`
          ]
        ).toBeDefined();
      }
    }
  });
});
