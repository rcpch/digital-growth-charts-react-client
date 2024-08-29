import { Select } from "semantic-ui-react";

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

export default IntervalTypeSelect;
