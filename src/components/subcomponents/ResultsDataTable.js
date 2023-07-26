import * as React from "react";
import { useState } from "react";
import { Table, Header, Radio, Form } from "semantic-ui-react";
import { ResultsDataTableRow } from "./ResultsDataTableRow";

export const ResultsDataTable = ({ dataTitle, data }) => {
  const [ageChoice, setAgeChoice] = useState("corrected");
  return (
    <React.Fragment>
      <Header>{dataTitle}</Header>

      <Table basic="very" celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Date of Measurement</Table.HeaderCell>
            <Table.HeaderCell>Measurement</Table.HeaderCell>
            <Table.HeaderCell>
              <Form inline style={{display:'flex', justifyContent:'space-between'}}>
                <>Age</>
                <Form.Group inline style={{margin: "0em", fontWeight: "normal"}}>
                  <Radio
                    label="Corrected"
                    value="corrected"
                    checked={ageChoice === "corrected"}
                    onChange={(e, { value }) => setAgeChoice(value)}
                    style={{marginRight: "0.75714em"}}
                  />
                  <Radio
                    label="Chronological"
                    value="chronological"
                    checked={ageChoice === "chronological"}
                    onChange={(e, { value }) => setAgeChoice(value)}
                    style={{marginRight: "0.75714em", fontStyle:'italic'}}
                  />
                  <Radio
                    label="Both"
                    value="both"
                    checked={ageChoice === "both"}
                    onChange={(e, { value }) => setAgeChoice(value)}
                    style={{marginRight: "0.75714em"}}
                  />
                </Form.Group>
              </Form>
            </Table.HeaderCell>
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
