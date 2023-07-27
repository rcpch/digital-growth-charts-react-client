import * as React from "react";
import { Table } from "semantic-ui-react";

import TableCellObservationValue from "./TableCellObservationValue";
import TableCellMeasurementAges from "./TableCellMeasurementAges";
import TableCellObservationDate from "./TableCellObservationDate";
import TableCellCentiles from "./TableCellCentiles";
import TableCellSDS from "./TableCellSDS";

export const ResultsDataTableRow = ({
  measurement,
  ageChoice,
  decimalAge,
  chronologicalStyles,
}) => {
  return (
    <Table.Row>
      <TableCellObservationDate measurement={measurement} />
      <TableCellObservationValue measurement={measurement} />
      <TableCellMeasurementAges
        measurementDates={measurement.measurement_dates}
        decimalAge={decimalAge}
        ageChoice={ageChoice}
        chronologicalStyles={chronologicalStyles}
      />
      <TableCellCentiles
        measurementCentiles={measurement.measurement_calculated_values}
        ageChoice={ageChoice}
        chronologicalStyles={chronologicalStyles}
      />
      <TableCellSDS
        measurementSDS={measurement.measurement_calculated_values}
        ageChoice={ageChoice}
        chronologicalStyles={chronologicalStyles}
      />
    </Table.Row>
  );
};
