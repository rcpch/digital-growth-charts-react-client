import { Select } from "semantic-ui-react";
import PropTypes from "prop-types";

function ReferenceSelect(props) {
  
  return (
    <Select
      aria-label="Growth reference"
      name="reference"
      placeholder="UK-WHO"
      value={props.reference}
      onChange={(e, val) => props.handleChangeReference(val)}
      options={props.referenceOptions}
    />
  );
}

ReferenceSelect.propTypes = {
  reference: PropTypes.string.isRequired,
  handleChangeReference: PropTypes.func.isRequired,
  referenceOptions: PropTypes.arrayOf(
    PropTypes.shape({ key: PropTypes.any, value: PropTypes.any, text: PropTypes.string })
  ).isRequired,
};

export default ReferenceSelect;
