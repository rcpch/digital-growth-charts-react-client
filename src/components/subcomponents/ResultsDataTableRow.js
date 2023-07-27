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
  const roundedCorrectedSDS =
    Math.round(measurement.measurement_calculated_values.corrected_sds * 1000) /
    1000;
  const roundedChronologicalSDS =
    Math.round(
      measurement.measurement_calculated_values.chronological_sds * 1000
    ) / 1000;

  const corrSDSAsP = <p>{roundedCorrectedSDS}</p>;
  const chronSDSAsP = (
    <p style={chronologicalStyles}>{roundedChronologicalSDS}</p>
  );

  const measurementSDS = [];

  switch (ageChoice) {
    case "corrected":
      measurementSDS.push(corrSDSAsP);
      break;
    case "chronological":
      measurementSDS.push(chronSDSAsP);
      break;
    default:
      measurementSDS.push(corrSDSAsP, chronSDSAsP);
      break;
  }

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
      <TableCellSDS measurementSDS={measurementSDS} />
    </Table.Row>
  );
};
