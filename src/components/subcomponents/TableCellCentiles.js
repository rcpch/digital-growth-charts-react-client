import React from "react";

import { Table } from "semantic-ui-react";

export default function TableCellCentiles({
  measurementCentiles,
  ageChoice,
  chronologicalStyles,
}) {
  const correctedCentile = measurementCentiles.corrected_centile;
  const chronologicalCentile = measurementCentiles.chronological_centile;
  return (
    <Table.Cell data-testid="centile_td_test">
      {(ageChoice === "corrected" || ageChoice === "both") && (
        <p>{correctedCentile}</p>
      )}
      {(ageChoice === "chronological" || ageChoice === "both") && (
        <p style={chronologicalStyles}>{chronologicalCentile}</p>
      )}
    </Table.Cell>
  );
}
