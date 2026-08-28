import { describe, expect, it } from "vitest";

import {
  firstRecordedSex,
  validatePatientMeasurement,
} from "./measurementValidation";

const maleHeight = {
  birth_date: "2020-01-01",
  observation_date: "2024-01-01",
  observation_value: 102,
  gestation_weeks: 40,
  gestation_days: 0,
  sex: "male",
};

const measurements = {
  height: [maleHeight],
  weight: [],
  bmi: [],
  ofc: [],
  parentalHeights: {},
};

describe("validatePatientMeasurement", () => {
  it("accepts another method for the same patient", () => {
    const weight = {
      ...maleHeight,
      observation_value: 16,
    };

    expect(validatePatientMeasurement(measurements, weight)).toBe("");
  });

  it("rejects a different sex across measurement methods", () => {
    const femaleWeight = {
      ...maleHeight,
      observation_value: 16,
      sex: "female",
    };

    expect(validatePatientMeasurement(measurements, femaleWeight)).toBe(
      "differing sexes"
    );
  });

  it("rejects a different DOB and gestation across measurement methods", () => {
    const otherPatient = {
      ...maleHeight,
      birth_date: "2020-01-02",
      gestation_weeks: 39,
      observation_value: 16,
    };

    expect(validatePatientMeasurement(measurements, otherPatient)).toBe(
      "differing date of births and differing gestations"
    );
  });
});

describe("firstRecordedSex", () => {
  it("reads API result provenance from any populated measurement method", () => {
    expect(
      firstRecordedSex({
        height: [],
        weight: [{ birth_data: { sex: "female" } }],
        bmi: [],
        ofc: [],
      })
    ).toBe("female");
  });
});
