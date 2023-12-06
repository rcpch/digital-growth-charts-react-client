import React from "react";

import { Table } from "semantic-ui-react";

export default function TableCellObservationDate({ measurement }) {
  const observationDate = new Date(
    measurement.measurement_dates.observation_date
  ).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return <Table.Cell>{observationDate}</Table.Cell>;
}
