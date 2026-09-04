import { defineConfig, devices } from "@playwright/test";
import process from "node:process";

const previewUrl = new URL(
  process.env.BASE_PATH ?? "/",
  "http://127.0.0.1:4173"
).toString();

export default defineConfig({
  testDir: "./tests/browser",
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: "list",
  use: {
    baseURL: previewUrl,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "npm run preview -- --host 127.0.0.1 --port 4173",
    url: previewUrl,
    reuseExistingServer: !process.env.CI,
  },
});
