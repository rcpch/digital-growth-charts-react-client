import { Select } from "semantic-ui-react";
import PropTypes from "prop-types";

function IntervalTypeSelect(props) {
  return (
    <Select
      name="interval"
      placeholder="days"
      value={props.intervalType}
      onChange={props.handleChangeIntervalType}
      options={props.intervalTypeOptions}
    />
  );
}

IntervalTypeSelect.propTypes = {
  intervalType: PropTypes.string.isRequired,
  handleChangeIntervalType: PropTypes.func.isRequired,
  intervalTypeOptions: PropTypes.arrayOf(
    PropTypes.shape({ key: PropTypes.any, value: PropTypes.any, text: PropTypes.string })
  ).isRequired,
};

export default IntervalTypeSelect;
