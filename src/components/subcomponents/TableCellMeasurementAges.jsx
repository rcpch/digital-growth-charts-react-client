import React from "react";
import { Table } from "semantic-ui-react";

export default function TableCellMeasurementAges({
  measurementDates,
  decimalAge,
  ageChoice,
  chronologicalStyles,
}) {
  console.log(measurementDates,
    decimalAge,
    ageChoice,
    chronologicalStyles,)
  const correctedAge = decimalAge
    ? measurementDates.corrected_decimal_age.toFixed(3)
    : measurementDates.corrected_calendar_age;

  const chronologicalAge = decimalAge
    ? measurementDates.chronological_decimal_age.toFixed(3)
    : measurementDates.chronological_calendar_age;
  return (
    <Table.Cell>
      {(ageChoice === "corrected" || ageChoice === "both") && (
        <p>{correctedAge}</p>
      )}
      {(ageChoice === "chronological" || ageChoice === "both") && (
        <p style={chronologicalStyles}>{chronologicalAge}</p>
      )}
    </Table.Cell>
  );
}
