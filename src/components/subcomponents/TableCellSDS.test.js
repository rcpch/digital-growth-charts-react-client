import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import TableCellSDS from "./TableCellSDS";

test("should show SDS for corrected and chronological", () => {
  const corrected_sds = 2.257548443069184;
  const chronological_sds = -0.01643015120464208;

  const ageChoice = "both";

  render(
    <table>
      <tbody>
        <tr>
          <TableCellSDS
            measurementSDS={{
              corrected_sds: corrected_sds,
              chronological_sds: chronological_sds,
            }}
            ageChoice={ageChoice}
            chronologicalStyles={{}}
          />
        </tr>
      </tbody>
    </table>
  );

  const corrected_SDS = screen.getByText("2.258");
  expect(corrected_SDS).toBeVisible();

  const chronological_SDS = screen.getByText("-0.016");
  expect(chronological_SDS).toBeVisible();
});

test("should show ONLY corrected SDS, NOT chronological when ageChoice==='corrected'", () => {
  const corrected_sds = 2.257548443069184;
  const chronological_sds = -0.01643015120464208;

  const ageChoice = "corrected";

  render(
    <table>
      <tbody>
        <tr>
          <TableCellSDS
            measurementSDS={{
              corrected_sds: corrected_sds,
              chronological_sds: chronological_sds,
            }}
            ageChoice={ageChoice}
            chronologicalStyles={{}}
          />
        </tr>
      </tbody>
    </table>
  );

  const corrected_SDS = screen.getByText("2.258");
  expect(corrected_SDS).toBeVisible();

  const chronological_centile = screen.queryAllByText("-0.016");
  expect(chronological_centile).toHaveLength(0);
});

test("should show ONLY chronological SDS, NOT corrected  when ageChoice==='chronological'", () => {
  const corrected_sds = 2.257548443069184;
  const chronological_sds = -0.01643015120464208;

  const ageChoice = "chronological";

  render(
    <table>
      <tbody>
        <tr>
          <TableCellSDS
            measurementSDS={{
              corrected_sds: corrected_sds,
              chronological_sds: chronological_sds,
            }}
            ageChoice={ageChoice}
            chronologicalStyles={{}}
          />
        </tr>
      </tbody>
    </table>
  );

  const chronological_centile = screen.getByText("-0.016");
  expect(chronological_centile).toBeVisible();

  const corrected_SDS = screen.queryAllByText("2.258");
  expect(corrected_SDS).toHaveLength(0);
});
