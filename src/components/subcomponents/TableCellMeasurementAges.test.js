import { render, screen } from "@testing-library/react";
import TableCellMeasurementAges from "./TableCellMeasurementAges";

test("should show correct stringifed age", () => {
  const expectedOutcome = "1 year, 11 months, 4 weeks and 2 days";

  const measurementDates = {
    corrected_decimal_age: 1.998631074606434,
    corrected_calendar_age: expectedOutcome,
  };
  const decimalAge = false;
  const ageChoice = "corrected";
  const chronologicalStyles = {};

  render(
    <table>
      <tbody>
        <tr>
          <TableCellMeasurementAges
            measurementDates={measurementDates}
            decimalAge={decimalAge}
            ageChoice={ageChoice}
            chronologicalStyles={chronologicalStyles}
          />
        </tr>
      </tbody>
    </table>
  );
  const age = screen.getByText(expectedOutcome);
  expect(age.textContent).toBe(expectedOutcome);
});
