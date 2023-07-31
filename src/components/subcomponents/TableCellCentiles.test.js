import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import TableCellCentiles from "./TableCellCentiles";

test("should show centile for corrected and chronological", () => {
  const measurementCentiles = {
    corrected_centile: 95,
    chronological_centile: 49,
  };
  const ageChoice = "both";

  render(
    <table>
      <tbody>
        <tr>
          <TableCellCentiles
            measurementCentiles={measurementCentiles}
            ageChoice={ageChoice}
            chronologicalStyles={{}}
          />
        </tr>
      </tbody>
    </table>
  );

  const corrected_centile = screen.getByText("95");
  expect(corrected_centile).toBeVisible();

  const chronological_centile = screen.getByText("49");
  expect(chronological_centile).toBeVisible();
});

test("should show ONLY corrected centile, NOT chronological if ageChoice==='corrected'", () => {
  const measurementCentiles = {
    corrected_centile: 95,
    chronological_centile: 49,
  };
  const ageChoice = "corrected";

  render(
    <table>
      <tbody>
        <tr>
          <TableCellCentiles
            measurementCentiles={measurementCentiles}
            ageChoice={ageChoice}
            chronologicalStyles={{}}
          />
        </tr>
      </tbody>
    </table>
  );

  const corrected_centile = screen.getByText("95");
  expect(corrected_centile).toBeVisible();

  const chronological_centile = screen.queryAllByText("49");
  expect(chronological_centile).toHaveLength(0);
});

test("should show ONLY chronological centile, NOT corrected if ageChoice==='chronological'", () => {
  const measurementCentiles = {
    corrected_centile: 95,
    chronological_centile: 49,
  };
  const ageChoice = "chronological";

  render(
    <table>
      <tbody>
        <tr>
          <TableCellCentiles
            measurementCentiles={measurementCentiles}
            ageChoice={ageChoice}
            chronologicalStyles={{}}
          />
        </tr>
      </tbody>
    </table>
  );

  const chronological_centile = screen.getByText("49");
  expect(chronological_centile).toBeVisible();

  const corrected_centile = screen.queryAllByText("95");
  expect(corrected_centile).toHaveLength(0);
});
