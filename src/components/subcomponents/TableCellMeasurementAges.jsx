import { Table } from "semantic-ui-react";
import PropTypes from "prop-types";

export default function TableCellMeasurementAges({
  measurementDates,
  decimalAge,
  ageChoice,
  chronologicalStyles,
}) {
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

TableCellMeasurementAges.propTypes = {
  measurementDates: PropTypes.shape({
    corrected_decimal_age: PropTypes.number.isRequired,
    chronological_decimal_age: PropTypes.number.isRequired,
    corrected_calendar_age: PropTypes.string.isRequired,
    chronological_calendar_age: PropTypes.string.isRequired,
  }).isRequired,
  decimalAge: PropTypes.bool.isRequired,
  ageChoice: PropTypes.oneOf(["corrected", "chronological", "both"]).isRequired,
  chronologicalStyles: PropTypes.object,
};
