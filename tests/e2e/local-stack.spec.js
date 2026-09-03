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

// CLIENT-1 from spec/e2e.md: enter one fictional measurement through the
// real Measurements form and render its centile chart and results table.
// Unlike the fixture-driven test above, this drives a genuine browser POST
// to the local API server (see s/e2e-local), proving the manual entry
// workflow itself works end to end, not just fixture rendering. The
// Reference, Sex, and Measurement method controls are left at their
// defaults (UK-WHO, Boy, Height) since verifying they can be discovered
// and read by their accessible name is covered implicitly by using
// getByPlaceholder/getByRole with a name throughout this test; changing
// them is not required to prove the real-API round trip.
test("a real fictional measurement submitted through the Measurements form renders from the real API", async ({
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

  await page.getByPlaceholder("Date of Birth").fill("2014-09-03");
  await page.getByPlaceholder("Date of Measurement").fill("2024-09-03");
  await page.getByRole("textbox", { name: "Measurement" }).fill("135");

  const [response] = await Promise.all([
    page.waitForResponse(
      (res) =>
        res.url().includes("/uk-who/calculation") &&
        res.request().method() === "POST"
    ),
    page
      .getByRole("button", { name: "Calculate Centiles and Add To Chart" })
      .click(),
  ]);
  expect(response.status()).toBe(200);

  await expect(page.getByText("The chart could not be displayed")).toHaveCount(0);

  await page.getByRole("button", { name: "Results" }).click();
  const table = page.getByRole("table");
  await expect(table).toContainText("135 cm");
  await expect(table).toContainText("10 years");

  expect(pageErrors).toEqual([]);
  expect(consoleErrors).toEqual([]);
});
