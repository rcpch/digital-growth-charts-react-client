import React from "react";
import { Table } from "semantic-ui-react";

export default function TableCellMeasurementAges({ measurementAges }) {
  return <Table.Cell>{measurementAges.map((item) => item)}</Table.Cell>;
}
