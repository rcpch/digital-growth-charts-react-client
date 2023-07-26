import * as React from "react";
import { Table } from "semantic-ui-react";
import { units } from "../../functions/units";

export const ResultsDataTableRow = ({
  measurement,
  ageChoice,
  decimalAge,
  chronologicalStyles,
}) => {
  const roundedCorrectedSDS =
    Math.round(measurement.measurement_calculated_values.corrected_sds * 1000) /
    1000;
  const roundedChronologicalSDS =
    Math.round(
      measurement.measurement_calculated_values.chronological_sds * 1000
    ) / 1000;

  let measurementAges = [];
  let measurementCentiles = [];
  let measurementSDS = [];

  const corrAgeAsP = decimalAge ? (
    <p>{measurement.measurement_dates.corrected_decimal_age.toFixed(3)}</p>
  ) : (
    <p>{measurement.measurement_dates.corrected_calendar_age}</p>
  );
  const chronAgeAsP = decimalAge ? (
    <p  style={chronologicalStyles}>
      {measurement.measurement_dates.chronological_decimal_age.toFixed(3)}
    </p>
  ) : (
    <p  style={chronologicalStyles}>
      {measurement.measurement_dates.chronological_calendar_age}
    </p>
  );
  const corrCentileAsP = (
    <p>{measurement.measurement_calculated_values.corrected_centile}</p>
  );
  const chronCentileAsP = (
    <p style={chronologicalStyles}>
      {measurement.measurement_calculated_values.chronological_centile}
    </p>
  );
  const corrSDSAsP = <p>{roundedCorrectedSDS}</p>;
  const chronSDSAsP = (
    <p style={chronologicalStyles}>{roundedChronologicalSDS}</p>
  );

  switch (ageChoice) {
    case "corrected":
      measurementAges.push(corrAgeAsP);
      measurementCentiles.push(corrCentileAsP);
      measurementSDS.push(corrSDSAsP);
      break;
    case "chronological":
      measurementAges.push(chronAgeAsP);
      measurementCentiles.push(chronCentileAsP);
      measurementSDS.push(chronSDSAsP);
      break;
    default:
      measurementAges.push(corrAgeAsP, chronAgeAsP);
      measurementCentiles.push(corrCentileAsP, chronCentileAsP);
      measurementSDS.push(corrSDSAsP, chronSDSAsP);
      break;
  }

  return (
    <Table.Row>
      <Table.Cell>{measurement.measurement_dates.observation_date}</Table.Cell>
      <Table.Cell>
        {measurement.child_observation_value.observation_value}{" "}
        {units(measurement.child_observation_value.measurement_method)}
      </Table.Cell>
      <Table.Cell>{measurementAges.map((item) => item)}</Table.Cell>
      <Table.Cell>{measurementCentiles.map((item) => item)}</Table.Cell>
      <Table.Cell>{measurementSDS.map((item) => item)}</Table.Cell>
    </Table.Row>
  );
};
