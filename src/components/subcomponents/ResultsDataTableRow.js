import { useState } from "react";
import { Icon, Table } from "semantic-ui-react";
import { units } from "../../functions/units";

export const ResultsDataTableRow = ({ measurement }) => {
  const [isCorrected, setIsCorrected] = useState(true);
  const rotate = isCorrected ? "rotate(180deg)" : "rotate(0)";
  return (
    <Table.Row>
      <Table.Cell>{measurement.measurement_dates.observation_date}</Table.Cell>
      <Table.Cell>
        {measurement.child_observation_value.observation_value}{" "}
        {units(measurement.child_observation_value.measurement_method)}
      </Table.Cell>
      <Table.Cell>
        {isCorrected && measurement.measurement_dates.corrected_calendar_age
          ? measurement.plottable_data.centile_data.corrected_decimal_age_data
              .corrected_gestational_age
          : measurement.plottable_data.centile_data.corrected_decimal_age_data
              .chronological_gestational_age}
      </Table.Cell>
      <Table.Cell>
        {isCorrected
          ? measurement.measurement_calculated_values.corrected_centile
          : measurement.measurement_calculated_values.chronological_centile}
      </Table.Cell>
      <Table.Cell>
        {isCorrected
          ? Math.round(
              measurement.measurement_calculated_values.corrected_sds * 1000
            ) / 1000
          : Math.round(
              measurement.measurement_calculated_values.chronological_sds * 1000
            ) / 1000}
      </Table.Cell>
      <Table.Cell>
        <Icon
          style={{ transform: rotate, transition: "all 0.2s linear" }}
          name="refresh"
          circular
          onClick={() => setIsCorrected(!isCorrected)}
        ></Icon>
      </Table.Cell>
    </Table.Row>
  );
};
