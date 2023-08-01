import React from "react";

import { Table } from "semantic-ui-react";

export default function TableCellObservationDate({ measurement }) {
  const observationDate = measurement.measurement_dates.observation_date;

  return <Table.Cell data-testid="date_td_test">{observationDate}</Table.Cell>;
}
