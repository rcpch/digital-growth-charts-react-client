import { Select } from "semantic-ui-react";
import PropTypes from "prop-types";

function MeasurementMethodSelect(props) {
  return (
    <Select
      fluid
      name="measurement_method"
      placeholder="Measurement"
      value={props.measurementMethod}
      onChange={(e, val) => props.handleChangeMeasurementMethod(val.value)}
      options={props.measurementOptions}
    />
  );
}

MeasurementMethodSelect.propTypes = {
  measurementMethod: PropTypes.string.isRequired,
  handleChangeMeasurementMethod: PropTypes.func.isRequired,
  measurementOptions: PropTypes.arrayOf(
    PropTypes.shape({ key: PropTypes.any, value: PropTypes.any, text: PropTypes.string })
  ).isRequired,
};

export default MeasurementMethodSelect;
