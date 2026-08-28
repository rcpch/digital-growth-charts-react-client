export class GrowthApiContractError extends Error {
  constructor(issues) {
    super(`Digital Growth Charts API contract mismatch: ${issues.join("; ")}`);
    this.name = "GrowthApiContractError";
    this.issues = issues;
  }
}

export const canonicalGrowthReference = (reference) =>
  reference === "turner" ? "turners-syndrome" : reference;

const isObject = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value);

const isFiniteNumber = (value) =>
  typeof value === "number" && Number.isFinite(value);

const addRequiredObjectIssue = (issues, value, path) => {
  if (!isObject(value)) {
    issues.push(`${path} must be an object`);
    return false;
  }
  return true;
};

const validateCoordinate = (issues, value, path) => {
  if (!addRequiredObjectIssue(issues, value, path)) return;
  if (!isFiniteNumber(value.x)) issues.push(`${path}.x must be finite`);
  if (!isFiniteNumber(value.y)) issues.push(`${path}.y must be finite`);
};

const validateProvenance = (issues, provenance, expectedReference) => {
  if (!addRequiredObjectIssue(issues, provenance, "provenance")) return;

  if (
    expectedReference &&
    provenance.growth_reference !== canonicalGrowthReference(expectedReference)
  ) {
    issues.push("provenance.growth_reference does not match the request");
  }

  if (
    !addRequiredObjectIssue(
      issues,
      provenance.calculation_engine,
      "provenance.calculation_engine"
    )
  ) {
    return;
  }

  const engine = provenance.calculation_engine;
  if (typeof engine.name !== "string" || engine.name.length === 0) {
    issues.push("provenance.calculation_engine.name must be present");
  }
  if (typeof engine.version !== "string" || engine.version.length === 0) {
    issues.push("provenance.calculation_engine.version must be present");
  }
  if (typeof engine.commit !== "string" || engine.commit.length === 0) {
    issues.push("provenance.calculation_engine.commit must be present");
  }
};

export const validateMeasurementResponse = (
  response,
  {
    reference,
    measurementMethod,
    sex,
    requireProvenance = false,
  } = {}
) => {
  const issues = [];
  if (!addRequiredObjectIssue(issues, response, "response")) {
    throw new GrowthApiContractError(issues);
  }

  const requiredObjects = [
    "birth_data",
    "measurement_dates",
    "child_observation_value",
    "measurement_calculated_values",
    "plottable_data",
    "bone_age",
    "events_data",
  ];
  for (const key of requiredObjects) {
    addRequiredObjectIssue(issues, response[key], key);
  }

  if (isObject(response.birth_data) && sex && response.birth_data.sex !== sex) {
    issues.push("birth_data.sex does not match the request");
  }

  if (
    isObject(response.child_observation_value) &&
    measurementMethod &&
    response.child_observation_value.measurement_method !== measurementMethod
  ) {
    issues.push("child_observation_value.measurement_method does not match the request");
  }

  if (
    isObject(response.child_observation_value) &&
    !isFiniteNumber(response.child_observation_value.observation_value)
  ) {
    issues.push("child_observation_value.observation_value must be finite");
  }

  if (isObject(response.measurement_dates)) {
    for (const key of ["observation_date"]) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(response.measurement_dates[key] ?? "")) {
        issues.push(`measurement_dates.${key} must use YYYY-MM-DD`);
      }
    }
  }

  if (isObject(response.plottable_data)) {
    for (const chartType of ["centile_data", "sds_data"]) {
      const chartData = response.plottable_data[chartType];
      if (!addRequiredObjectIssue(issues, chartData, `plottable_data.${chartType}`)) {
        continue;
      }
      for (const ageType of [
        "chronological_decimal_age_data",
        "corrected_decimal_age_data",
      ]) {
        validateCoordinate(
          issues,
          chartData[ageType],
          `plottable_data.${chartType}.${ageType}`
        );
      }
    }
  }

  if (requireProvenance || response.provenance !== undefined) {
    validateProvenance(issues, response.provenance, reference);
  }

  if (issues.length > 0) throw new GrowthApiContractError(issues);
  return response;
};

export const validateFictionalChildResponse = (
  response,
  expectations = {}
) => {
  if (!Array.isArray(response) || response.length === 0) {
    throw new GrowthApiContractError([
      "fictional-child-data response must be a non-empty array",
    ]);
  }

  return response.map((measurement) =>
    validateMeasurementResponse(measurement, expectations)
  );
};

export const validateMidParentalHeightResponse = (response) => {
  const issues = [];
  if (!addRequiredObjectIssue(issues, response, "response")) {
    throw new GrowthApiContractError(issues);
  }

  for (const key of [
    "mid_parental_height",
    "mid_parental_height_sds",
    "mid_parental_height_centile",
    "mid_parental_height_lower_value",
    "mid_parental_height_upper_value",
  ]) {
    if (!isFiniteNumber(response[key])) issues.push(`${key} must be finite`);
  }
  for (const key of [
    "mid_parental_height_centile_data",
    "mid_parental_height_lower_centile_data",
    "mid_parental_height_upper_centile_data",
  ]) {
    if (!Array.isArray(response[key]) || response[key].length === 0) {
      issues.push(`${key} must be a non-empty array`);
    }
  }

  if (issues.length > 0) throw new GrowthApiContractError(issues);
  return response;
};
