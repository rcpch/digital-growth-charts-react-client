import { Select } from "semantic-ui-react";
import PropTypes from "prop-types";

function SexSelect(props) {
  return (
    <>
    
    <Select
      aria-label="Sex"
      fluid
      name="sex"
      placeholder="Sex"
      value={props.sex}
      onChange={(e, val) => props.handleSexChange(val)}
      options={props.sexOptions}
    />
    </>
  );
}

SexSelect.propTypes = {
  sex: PropTypes.string.isRequired,
  handleSexChange: PropTypes.func.isRequired,
  sexOptions: PropTypes.arrayOf(
    PropTypes.shape({ key: PropTypes.any, value: PropTypes.any, text: PropTypes.string })
  ).isRequired,
};

export default SexSelect;
