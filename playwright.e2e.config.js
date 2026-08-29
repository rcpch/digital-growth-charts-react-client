import { defineConfig, devices } from "@playwright/test";
import process from "node:process";

// Config for the local-everything E2E preset (s/e2e-local). Unlike
// playwright.config.js, this does not start its own web server: the Demo
// Client dev server is started and torn down by s/e2e-local against a
// locally running API server. See spec/e2e.md.
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  reporter: "list",
  outputDir: "./test-results/e2e-local/artifacts",
  use: {
    baseURL: process.env.E2E_CLIENT_BASE_URL || "http://127.0.0.1:58680",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
