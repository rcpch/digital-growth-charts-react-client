const measurementArrays = (measurementsByMethod) =>
  Object.values(measurementsByMethod).filter(Array.isArray);

export const allMeasurements = (measurementsByMethod) =>
  measurementArrays(measurementsByMethod).flat();

export const resultSex = (result) => result.birth_data?.sex ?? result.sex;

export const firstRecordedSex = (measurementsByMethod) => {
  const firstResult = allMeasurements(measurementsByMethod).find(resultSex);
  return firstResult ? resultSex(firstResult) : null;
};

export const validatePatientMeasurement = (
  measurementsByMethod,
  latestMeasurement
) => {
  const existingMeasurements = allMeasurements(measurementsByMethod);

  for (const existingMeasurement of existingMeasurements) {
    if (JSON.stringify(existingMeasurement) === JSON.stringify(latestMeasurement)) {
      return "duplicate";
    }

    const differences = [];
    const existingGestation =
      existingMeasurement.gestation_weeks * 7 +
      existingMeasurement.gestation_days;
    const latestGestation =
      latestMeasurement.gestation_weeks * 7 + latestMeasurement.gestation_days;

    if (existingMeasurement.sex !== latestMeasurement.sex) {
      differences.push("differing sexes");
    }
    if (existingMeasurement.birth_date !== latestMeasurement.birth_date) {
      differences.push("differing date of births");
    }
    if (existingGestation !== latestGestation) {
      differences.push("differing gestations");
    }

    if (differences.length === 1) {
      return differences[0];
    }
    if (differences.length === 2) {
      return differences.join(" and ");
    }
    if (differences.length === 3) {
      return `${differences[0]}, ${differences[1]} and ${differences[2]}`;
    }
  }

  return "";
};
