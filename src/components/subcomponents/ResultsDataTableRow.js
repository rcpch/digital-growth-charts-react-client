import * as React from "react";
import { Table } from "semantic-ui-react";
import { units } from "../../functions/units";

export const ResultsDataTableRow = ({ measurement, ageChoice }) => {
  let measurementCorrectedAge = null;
  let measurementChronologicalAge = null;

  switch (ageChoice) {
    case "corrected":
      measurementCorrectedAge =
        measurement.measurement_dates.corrected_calendar_age;
      break;
    case "chronological":
      measurementChronologicalAge =
        measurement.measurement_dates.chronological_calendar_age;
      break;
    default:
      measurementCorrectedAge =
        measurement.measurement_dates.corrected_calendar_age;
      measurementChronologicalAge =
        measurement.measurement_dates.chronological_calendar_age;
      break;
  }

  return (
    <Table.Row>
      <Table.Cell>{measurement.measurement_dates.observation_date}</Table.Cell>
      <Table.Cell>
        {measurement.child_observation_value.observation_value}{" "}
        {units(measurement.child_observation_value.measurement_method)}
      </Table.Cell>
      <Table.Cell>
       {measurementCorrectedAge ? (<p>{measurementCorrectedAge}</p>) : (null) }
       {measurementChronologicalAge ? (<p style={{fontStyle:'italic'}}>{measurementChronologicalAge}</p>) : (null) }

      </Table.Cell>
      <Table.Cell>
        {measurement.measurement_calculated_values.corrected_centile}
      </Table.Cell>
      <Table.Cell>
        {Math.round(
          measurement.measurement_calculated_values.corrected_sds * 1000
        ) / 1000}
      </Table.Cell>
    </Table.Row>
  );
};
