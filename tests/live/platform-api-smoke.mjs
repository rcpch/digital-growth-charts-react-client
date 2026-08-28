import { createRequire } from "node:module";

import { requestGrowthApi } from "../../src/api/growthApiClient.js";

const require = createRequire(import.meta.url);
const clientPackage = require("../../package.json");
const componentPackage = require(
  "@rcpch/digital-growth-charts-react-component-library/package.json"
);

const baseUrl = process.env.LIVE_GROWTH_API_BASE_URL;
if (!baseUrl) {
  throw new Error(
    "Set LIVE_GROWTH_API_BASE_URL to the candidate API base URL before running the live smoke test."
  );
}

const publicDemoKey = process.env.LIVE_PUBLIC_DEMO_KEY;
const requireProvenance = process.env.LIVE_REQUIRE_PROVENANCE === "true";
const references = [
  "uk-who",
  "who",
  "cdc",
  "turner",
  "trisomy-21",
  "trisomy-21-aap",
];

const inputParameters = {
  birth_date: "2012-01-01",
  observation_date: "2022-01-01",
  observation_value: 135,
  measurement_method: "height",
  sex: "female",
  gestation_weeks: 40,
  gestation_days: 0,
};

console.log(
  JSON.stringify({
    clientVersion: clientPackage.version,
    componentVersion: componentPackage.version,
    apiBaseUrl: baseUrl,
    requireProvenance,
  })
);

for (const reference of references) {
  const result = await requestGrowthApi({
    inputParameters,
    reference,
    mode: "calculation",
    baseUrl,
    publicDemoKey,
    requireProvenance,
  });

  console.log(
    JSON.stringify({
      reference,
      status: "ok",
      growthReference: result.provenance?.growth_reference ?? "legacy",
      engineVersion: result.provenance?.calculation_engine?.version ?? "legacy",
    })
  );
}

for (const reference of ["uk-who", "who", "cdc"]) {
  for (const sex of ["female", "male"]) {
    await requestGrowthApi({
      inputParameters: {
        height_maternal: 165,
        height_paternal: 180,
        reference,
        sex,
      },
      reference,
      mode: "mid-parental-height",
      baseUrl,
      publicDemoKey,
    });
    console.log(JSON.stringify({ reference, sex, utility: "ok" }));
  }
}
