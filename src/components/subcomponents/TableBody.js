import * as React from "react";
import { Table } from "semantic-ui-react";
import { units } from "./../../functions/units";

export const TableBody = (props) => {
  const measurement = props.measurement;
  return (
    <React.Fragment>
      <Table.Row>
        <Table.Cell>Ages</Table.Cell>
        <Table.Cell>
          {measurement.measurement_dates.chronological_calendar_age}
        </Table.Cell>
        <Table.Cell>
          {measurement.measurement_dates.corrected_calendar_age ??
            measurement.plottable_data.centile_data.corrected_decimal_age_data
              .corrected_gestational_age}
        </Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>Measurement</Table.Cell>
        <Table.Cell>
          {measurement.child_observation_value.observation_value}{" "}
          {units(measurement.child_observation_value.measurement_method)}
        </Table.Cell>
        <Table.Cell></Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>SDS</Table.Cell>
        <Table.Cell>
          {Math.round(
            measurement.measurement_calculated_values.corrected_sds * 1000
          ) / 1000}
        </Table.Cell>
        <Table.Cell>
          {Math.round(
            measurement.measurement_calculated_values.chronological_sds * 1000
          ) / 1000}
        </Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>Centiles</Table.Cell>
        <Table.Cell>
          {measurement.measurement_calculated_values.corrected_centile}
        </Table.Cell>
        <Table.Cell>
          {measurement.measurement_calculated_values.chronological_centile}
        </Table.Cell>
      </Table.Row>
    </React.Fragment>
  );
};
