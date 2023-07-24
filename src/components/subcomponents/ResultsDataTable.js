import * as React from "react";
import { Table, Icon, Header } from "semantic-ui-react";
import { ResultsDataTableRow } from "./ResultsDataTableRow";

export const ResultsDataTable = ({ dataTitle, data }) => {
  return (
    <React.Fragment>
      <Header>
        {dataTitle} (Corrected age results
        <Icon name="add circle" />)
      </Header>

      {data.length > 0 ? (
        <Table basic="very" celled collapsing compact>
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
                <ResultsDataTableRow measurement={measurement} key={index} />
              );
            })}
          </Table.Body>
        </Table>
      ) : (
        <h1>No data!</h1>
      )}
    </React.Fragment>
  );
};
