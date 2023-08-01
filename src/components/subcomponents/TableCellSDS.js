import React from "react";

import { Table } from "semantic-ui-react";

export default function TableCellSDS({
  measurementSDS,
  ageChoice,
  chronologicalStyles,
}) {
  const correctedSDS = Math.round(measurementSDS.corrected_sds * 1000) / 1000;
  const chronologicalSDS =
    Math.round(measurementSDS.chronological_sds * 1000) / 1000;
  return (
    <Table.Cell data-testid="sds_td_test">
      {(ageChoice === "corrected" || ageChoice === "both") && (
        <p>{correctedSDS}</p>
      )}
      {(ageChoice === "chronological" || ageChoice === "both") && (
        <p style={chronologicalStyles}>{chronologicalSDS}</p>
      )}
    </Table.Cell>
  );
}
