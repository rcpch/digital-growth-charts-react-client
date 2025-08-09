import { Table } from "semantic-ui-react";
import PropTypes from "prop-types";

import { units } from "../../functions/units";

export default function TableCellObservationValue({ measurement }) {
  const value = measurement.child_observation_value.observation_value;
  const measurementMethod = measurement.child_observation_value.measurement_method;
  return (
    <Table.Cell>
      {value} {units(measurementMethod)}
    </Table.Cell>
  );
}

TableCellObservationValue.propTypes = {
  measurement: PropTypes.shape({
    child_observation_value: PropTypes.shape({
      observation_value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      measurement_method: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};
