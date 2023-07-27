import React from "react";

import { Table } from "semantic-ui-react";

export default function TableCellObservationDate({ measurement }) {
  const observationDate = measurement.measurement_dates.observation_date;

  return <Table.Cell>{observationDate}</Table.Cell>;
}
