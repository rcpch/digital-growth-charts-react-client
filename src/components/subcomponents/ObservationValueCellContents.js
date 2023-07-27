import React from "react";

import { units } from "../../functions/units";

export default function ObservationValueCellContents({ measurement }) {
  const value = measurement.child_observation_value.observation_value;
  const measurementMethod = measurement.child_observation_value.measurement_method;
  return (
    <>
      {value} {units(measurementMethod)}
    </>
  );
}
