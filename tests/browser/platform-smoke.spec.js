import { expect, test } from "@playwright/test";

test("the production client renders installed chart centile and SDS output", async ({
  page,
}) => {
  const consoleErrors = [];
  const pageErrors = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("./");
  await expect(
    page.getByRole("heading", { name: "RCPCH Digital Growth Charts demo" })
  ).toBeVisible();
  await expect(
    page.getByText("Demonstration only - not for clinical use")
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
  await expect(page.getByRole("button", { name: "Results" })).toBeEnabled();

  await page.getByRole("button", { name: "Show SDS Chart" }).click();
  await expect.poll(() => measurementPoints.count()).toBeGreaterThan(0);
  await expect(page.getByText("The chart could not be displayed")).toHaveCount(0);

  await page.getByRole("button", { name: "Results" }).click();
  await expect(page.getByRole("table")).toContainText("61 cm");
  await expect(page.getByRole("table")).toContainText("SDS");

  expect(pageErrors).toEqual([]);
  expect(consoleErrors).toEqual([]);
});

test("the primary workflow does not overflow a phone viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("./");

  const dimensions = await page.evaluate(() => ({
    viewport: window.innerWidth,
    document: document.documentElement.scrollWidth,
  }));

  expect(dimensions.document).toBeLessThanOrEqual(dimensions.viewport);
});
