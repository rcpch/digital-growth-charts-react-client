import * as React from "react";
import { Table, Header } from "semantic-ui-react";
import { ResultsDataTableRow } from "./ResultsDataTableRow";

export const ResultsDataTable = ({ dataTitle, data, ageChoice }) => {
  
  return (
    <React.Fragment>
      <Header>{dataTitle}</Header>

      <Table basic="very" celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Date of Measurement</Table.HeaderCell>
            <Table.HeaderCell>Measurement</Table.HeaderCell>
            <Table.HeaderCell>Age</Table.HeaderCell>
            <Table.HeaderCell>Centile</Table.HeaderCell>
            <Table.HeaderCell>SDS</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data.map((measurement, index) => {
            return (
              <ResultsDataTableRow
                measurement={measurement}
                key={index}
                ageChoice={ageChoice}
              />
            );
          })}
        </Table.Body>
      </Table>
    </React.Fragment>
  );
};
