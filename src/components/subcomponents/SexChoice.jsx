import { Select } from "semantic-ui-react";

function SexSelect(props) {
  return (
    <>
    <label style={{ textAlign: "left" }}>
      Sex:
    </label>
    <Select
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

export default SexSelect;
