import React from "react";
import { Segment, Table } from "semantic-ui-react";
import { TableBody } from "../subcomponents/TableBody";

export const ResultsSegment = ({ apiResult, reference }) => (
  <Segment>
    <Table basic="very" celled collapsing compact>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell></Table.HeaderCell>
          <Table.HeaderCell>Corrected Results</Table.HeaderCell>
          <Table.HeaderCell>Chronological Results</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {apiResult[reference].height.length > 0 && (
          <Table.Row>
            <Table.HeaderCell></Table.HeaderCell>
            <Table.HeaderCell>Heights</Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
          </Table.Row>
        )}
        {apiResult[reference].height.length > 0 &&
          apiResult[reference].height.map((measurement, index) => {
            return <TableBody measurement={measurement} key={index} />;
          })}
        {apiResult[reference].weight.length > 0 && (
          <Table.Row>
            <Table.HeaderCell></Table.HeaderCell>
            <Table.HeaderCell>Weights</Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
          </Table.Row>
        )}
        {apiResult[reference].weight.length > 0 &&
          apiResult[reference].weight.map((measurement, index) => {
            return <TableBody key={index} measurement={measurement} />;
          })}
        {apiResult[reference].bmi.length > 0 && (
          <Table.Row>
            <Table.HeaderCell></Table.HeaderCell>
            <Table.HeaderCell>BMIs</Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
          </Table.Row>
        )}
        {apiResult[reference].bmi.length > 0 &&
          apiResult[reference].bmi.map((measurement, index) => {
            return <TableBody key={index} measurement={measurement} />;
          })}
        {apiResult[reference].ofc.length > 0 && (
          <Table.Row>
            <Table.HeaderCell></Table.HeaderCell>
            <Table.HeaderCell>Head Circumferences</Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
          </Table.Row>
        )}
        {apiResult[reference].ofc.length > 0 &&
          apiResult[reference].ofc.map((measurement, index) => {
            return <TableBody key={index} measurement={measurement} />;
          })}
      </Table.Body>
    </Table>
  </Segment>
);
