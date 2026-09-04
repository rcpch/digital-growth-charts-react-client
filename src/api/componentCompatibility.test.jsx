// @vitest-environment jsdom

import { createRequire } from "node:module";
import { cleanup, render, screen } from "@testing-library/react";
import semver from "semver";
import { afterEach, describe, expect, it } from "vitest";

import { RCPCHChart } from "@rcpch/digital-growth-charts-react-component-library";
import legacyMeasurements from "../example-scenarios/normal/uk-who/height/female/data.json";
import { validateMeasurementResponse } from "./growthApiContract";

const require = createRequire(import.meta.url);
const componentPackage = require(
  "@rcpch/digital-growth-charts-react-component-library/package.json"
);
const reactPackage = require("react/package.json");
const reactDomPackage = require("react-dom/package.json");

const measurement = validateMeasurementResponse(
  {
    ...legacyMeasurements[0],
    provenance: {
      growth_reference: "uk-who",
      calculation_engine: {
        name: "rcpchgrowth",
        version: "4.6.0",
        commit: "0123456789abcdef0123456789abcdef01234567",
      },
    },
  },
  {
    reference: "uk-who",
    measurementMethod: "height",
    sex: "female",
    requireProvenance: true,
  }
);

const renderChart = (chartType) =>
  render(
    <RCPCHChart
      title={`Compatibility ${chartType} chart`}
      measurementMethod="height"
      reference="uk-who"
      sex="female"
      measurements={{ height: [measurement], weight: [], bmi: [], ofc: [] }}
      chartType={chartType}
      theme="monochrome"
      clinicianFocus
      enableExport={false}
      enableZoom={false}
      exportChartCallback={() => {}}
    />
  );

afterEach(cleanup);

describe("installed chart package compatibility", () => {
  it("declares peer ranges compatible with the installed React runtime", () => {
    expect(
      semver.satisfies(
        reactPackage.version,
        componentPackage.peerDependencies.react
      )
    ).toBe(true);
    expect(
      semver.satisfies(
        reactDomPackage.version,
        componentPackage.peerDependencies["react-dom"]
      )
    ).toBe(true);
  });

  it.each(["centile", "sds"])(
    "renders a validated API response on a %s chart",
    (chartType) => {
      const { container } = renderChart(chartType);

      expect(
        screen.getByRole("heading", {
          name: `Compatibility ${chartType} chart`,
        })
      ).toBeTruthy();
      expect(screen.queryByText("The chart could not be displayed")).toBeNull();
      expect(
        container.querySelectorAll(
          '[data-testid="chronologicalMeasurementPoint"]'
        ).length
      ).toBeGreaterThan(0);
    }
  );
});
