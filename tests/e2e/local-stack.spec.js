import { expect, test } from "@playwright/test";

// Exercises the local-everything preset (s/e2e-local): the Demo Client
// built from source against the local Chart Component checkout, running
// against a real locally built API server backed by the local
// rcpchgrowth-python engine. Chart data itself comes from the bundled
// fictional-child fixtures rather than a live API call from the browser;
// the real API contract is checked separately by s/e2e-local via
// `npm run test:live` against the local server. See spec/e2e.md.
test("the local Chart Component renders against local fixtures with no errors", async ({
  page,
}) => {
  const consoleErrors = [];
  const pageErrors = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "RCPCH Digital Growth Charts demo" })
  ).toBeVisible();

  await page.getByText("Example Charts", { exact: true }).click();
  await page.getByRole("radio", { name: "Normal" }).click();
  await page
    .getByRole("button", { name: "Generate Height Chart" })
    .click({ timeout: 30_000 });

  const measurementPoints = page.locator(
    '[data-testid="chronologicalMeasurementPoint"]'
  );
  await expect.poll(() => measurementPoints.count()).toBeGreaterThan(0);
  await expect(page.getByText("The chart could not be displayed")).toHaveCount(0);

  await page.getByRole("button", { name: "Results" }).click();
  await expect(page.getByRole("table")).toContainText("SDS");

  expect(pageErrors).toEqual([]);
  expect(consoleErrors).toEqual([]);
});
