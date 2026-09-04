import {
  GrowthApiContractError,
  validateFictionalChildResponse,
  validateMidParentalHeightResponse,
  validateMeasurementResponse,
} from "./growthApiContract.js";

const supportedReferences = new Set([
  "uk-who",
  "who",
  "cdc",
  "turner",
  "trisomy-21",
  "trisomy-21-aap",
]);

export const buildGrowthApiUrl = (baseUrl, reference, mode) => {
  let parsedBaseUrl;
  try {
    parsedBaseUrl = new URL(baseUrl);
  } catch {
    throw new GrowthApiContractError(["API base URL must be an absolute URL"]);
  }

  if (!new Set(["http:", "https:"]).has(parsedBaseUrl.protocol)) {
    throw new GrowthApiContractError(["API base URL must use HTTP or HTTPS"]);
  }

  const normalizedBaseUrl = parsedBaseUrl.toString().replace(/\/$/, "");
  if (mode === "mid-parental-height") {
    return `${normalizedBaseUrl}/utilities/mid-parental-height`;
  }
  if (!supportedReferences.has(reference)) {
    throw new GrowthApiContractError([`Unsupported growth reference: ${reference}`]);
  }
  if (!new Set(["calculation", "fictional-child-data"]).has(mode)) {
    throw new GrowthApiContractError([`Unsupported API mode: ${mode}`]);
  }
  return `${normalizedBaseUrl}/${reference}/${mode}`;
};

const errorMessageFromBody = (body, response) => {
  if (body && typeof body.statusCode !== "undefined" && body.message) {
    return `${body.statusCode} ${body.message}`;
  }
  if (Array.isArray(body?.detail)) {
    const messages = body.detail
      .map((detail) => detail?.msg)
      .filter(Boolean)
      .join("; ");
    if (messages) return `${response.status} ${messages}`;
  }
  if (typeof body === "string" && body.length > 0) {
    return `${response.status} ${body}`;
  }
  return `${response.status} ${response.statusText || "API request failed"}`;
};

export const requestGrowthApi = async ({
  inputParameters,
  reference,
  mode,
  baseUrl = import.meta.env?.VITE_APP_GROWTH_API_BASEURL,
  publicDemoKey = import.meta.env?.VITE_APP_PUBLIC_DEMO_KEY,
  requireProvenance = import.meta.env?.VITE_APP_REQUIRE_PROVENANCE === "true",
  fetchImpl = globalThis.fetch,
  signal,
}) => {
  const url = buildGrowthApiUrl(baseUrl, reference, mode);
  const headers = { "Content-Type": "application/json" };
  if (publicDemoKey) headers["Subscription-Key"] = publicDemoKey;

  const response = await fetchImpl(url, {
    body: JSON.stringify(inputParameters),
    method: "POST",
    headers,
    signal,
  });

  const responseText = await response.text();
  let body;
  try {
    body = responseText ? JSON.parse(responseText) : null;
  } catch {
    body = responseText;
  }

  if (!response.ok) {
    const error = new Error(errorMessageFromBody(body, response));
    error.statusCode = response.status;
    error.retryAfter = response.headers.get("Retry-After");
    throw error;
  }

  if (typeof body === "string" || body === null) {
    throw new GrowthApiContractError(["successful response must contain JSON"]);
  }

  const expectations = {
    reference,
    measurementMethod: inputParameters.measurement_method,
    sex: inputParameters.sex,
    requireProvenance,
  };

  if (mode === "calculation") {
    return validateMeasurementResponse(body, expectations);
  }
  if (mode === "fictional-child-data") {
    return validateFictionalChildResponse(body, expectations);
  }
  return validateMidParentalHeightResponse(body);
};
