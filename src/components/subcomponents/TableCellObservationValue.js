import React from "react";

import { Table } from "semantic-ui-react";

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
