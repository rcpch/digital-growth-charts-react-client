import { Table } from "semantic-ui-react";
import PropTypes from "prop-types";

export default function TableCellCentiles({
  measurementCentiles,
  ageChoice,
  chronologicalStyles,
}) {
  const correctedCentile = measurementCentiles.corrected_centile;
  const chronologicalCentile = measurementCentiles.chronological_centile;
  return (
    <Table.Cell>
      {(ageChoice === "corrected" || ageChoice === "both") && (
        <p>{correctedCentile}</p>
      )}
      {(ageChoice === "chronological" || ageChoice === "both") && (
        <p style={chronologicalStyles}>{chronologicalCentile}</p>
      )}
    </Table.Cell>
  );
}

TableCellCentiles.propTypes = {
  measurementCentiles: PropTypes.shape({
    corrected_centile: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    chronological_centile: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
  }).isRequired,
  ageChoice: PropTypes.oneOf(["corrected", "chronological", "both"]).isRequired,
  chronologicalStyles: PropTypes.object,
};
