
import React from "react";

import { Table } from "semantic-ui-react";

export default function TableCellSDS({ measurementSDS }) {
  return <Table.Cell>{measurementSDS.map((item) => item)}</Table.Cell>;
}
