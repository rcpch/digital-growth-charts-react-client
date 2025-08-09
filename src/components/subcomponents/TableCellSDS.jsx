import { Table } from "semantic-ui-react";
import PropTypes from "prop-types";

export default function TableCellSDS({
  measurementSDS,
  ageChoice,
  chronologicalStyles,
}) {
  const correctedSDS = Math.round(measurementSDS.corrected_sds * 1000) / 1000;
  const chronologicalSDS =
    Math.round(measurementSDS.chronological_sds * 1000) / 1000;
  return (
    <Table.Cell>
      {(ageChoice === "corrected" || ageChoice === "both") && (
        <p>{correctedSDS}</p>
      )}
      {(ageChoice === "chronological" || ageChoice === "both") && (
        <p style={chronologicalStyles}>{chronologicalSDS}</p>
      )}
    </Table.Cell>
  );
}

TableCellSDS.propTypes = {
  measurementSDS: PropTypes.shape({
    corrected_sds: PropTypes.number.isRequired,
    chronological_sds: PropTypes.number.isRequired,
  }).isRequired,
  ageChoice: PropTypes.oneOf(["corrected", "chronological", "both"]).isRequired,
  chronologicalStyles: PropTypes.object,
};
