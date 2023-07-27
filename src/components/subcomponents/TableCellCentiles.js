import React from "react";

import { Table } from "semantic-ui-react";

export default function TableCellCentiles({ measurementCentiles }) {
  return <Table.Cell>{measurementCentiles.map((item) => item)}</Table.Cell>;
}
