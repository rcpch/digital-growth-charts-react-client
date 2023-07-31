import { render, screen } from "@testing-library/react";
import TableCellObservationDate from "./TableCellObservationDate";
import { Table } from "semantic-ui-react";

test("should show correct observation date text in tr", () => {
  const measurementProp = {
    measurement_dates: { observation_date: "1760-04-10" },
  };

  render(
    <Table>
      <Table.Body>
        <Table.Row>
          <TableCellObservationDate measurement={measurementProp} />
        </Table.Row>
      </Table.Body>
    </Table>
  );

  const observationDate = screen.getByText("1760-04-10");

  expect(observationDate.textContent).toBe("1760-04-10");
});
