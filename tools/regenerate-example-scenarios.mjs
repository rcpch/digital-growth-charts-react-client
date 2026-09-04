import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { requestGrowthApi } from "../src/api/growthApiClient.js";

// Regenerates the bundled src/example-scenarios/**/data.json example
// scenarios from a hard-coded scenario manifest
// (src/example-scenarios/scenario-manifest.json) by calling the real API's
// fictional-child-data generator endpoint, rather than hand-editing or
// freezing API responses directly. See spec/roadmap.md R12 and
// spec/queries.md for the review this output still needs.
//
// Usage:
//   LIVE_GROWTH_API_BASE_URL=http://127.0.0.1:58600 s/regenerate-example-scenarios
//   LIVE_GROWTH_API_BASE_URL=... s/regenerate-example-scenarios normal/uk-who   # filter by path substring

const baseUrl = process.env.LIVE_GROWTH_API_BASE_URL;
if (!baseUrl) {
  throw new Error(
    "Set LIVE_GROWTH_API_BASE_URL to the API to generate example scenarios from."
  );
}
const publicDemoKey = process.env.LIVE_PUBLIC_DEMO_KEY;
const pathFilter = process.argv[2];

const rootDir = fileURLToPath(new URL("..", import.meta.url));
const manifestPath = `${rootDir}src/example-scenarios/scenario-manifest.json`;
const manifest = JSON.parse(readFileSync(manifestPath, "utf-8"));

const scenarios = pathFilter
  ? manifest.filter((scenario) => scenario.path.includes(pathFilter))
  : manifest;

if (scenarios.length === 0) {
  throw new Error(`No scenarios in the manifest match "${pathFilter}".`);
}

const failures = [];

for (const scenario of scenarios) {
  const inputParameters = {
    measurement_method: scenario.measurementMethod,
    sex: scenario.sex,
    start_chronological_age: scenario.startChronologicalAge,
    end_age: scenario.endAge,
    gestation_weeks: scenario.gestationWeeks,
    gestation_days: scenario.gestationDays,
    measurement_interval_type: scenario.measurementIntervalType,
    measurement_interval_number: scenario.measurementIntervalNumber,
    start_sds: scenario.startSds,
    noise: scenario.noise,
    drift_range: scenario.driftRange,
    drift: scenario.drift,
    noise_range: scenario.noiseRange,
    reference: scenario.reference,
  };

  process.stdout.write(`Generating ${scenario.path} ... `);
  try {
    const result = await requestGrowthApi({
      inputParameters,
      reference: scenario.reference,
      mode: "fictional-child-data",
      baseUrl,
      publicDemoKey,
    });

    const outPath = `${rootDir}src/example-scenarios/${scenario.path}/data.json`;
    writeFileSync(outPath, `${JSON.stringify(result, null, 2)}\n`);

    const hasProvenance = Boolean(result[0]?.provenance);
    console.log(
      `wrote ${result.length} measurements (provenance: ${
        hasProvenance ? "present" : "ABSENT"
      })`
    );
  } catch (error) {
    console.log(`FAILED: ${error.message}`);
    failures.push({ path: scenario.path, message: error.message });
  }
}

if (failures.length > 0) {
  console.error(`\n${failures.length} scenario(s) failed:`);
  for (const failure of failures) {
    console.error(`  ${failure.path}: ${failure.message}`);
  }
  process.exitCode = 1;
}
