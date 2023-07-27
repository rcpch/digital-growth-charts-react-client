import * as React from "react";
import { useState } from "react";
import { Table, Header, Checkbox, Form } from "semantic-ui-react";
import { ResultsDataTableRow } from "./ResultsDataTableRow";

export const ResultsDataTable = ({
  dataTitle,
  data,
  chronologicalStyles,
  fontChoice,
}) => {

  const [ageChoice, setAgeChoice] = useState("corrected");
  const [decimalAge, setDecimalAge] = useState(false);

  return (
    <div style={{ fontFamily: fontChoice }}>
      <Form>
        <Form.Group>
          <Header textAlign="left">{dataTitle}</Header>
          <Form.Group inline style={{marginLeft:"1em"}}>
            <Form.Radio
              label="Corrected"
              value="corrected"
              checked={ageChoice === "corrected"}
              onChange={(e, { value }) => setAgeChoice(value)}
              style={{
                fontWeight: ageChoice === "corrected" ? "bold" : "normal",
              }}
            />
            <Form.Radio
              label="Chronological"
              value="chronological"
              checked={ageChoice === "chronological"}
              onChange={(e, { value }) => setAgeChoice(value)}
              style={{
                fontWeight: ageChoice === "chronological" ? "bold" : "normal",
                ...chronologicalStyles,
              }}
            />
            <Form.Radio
              label="Both"
              value="both"
              checked={ageChoice === "both"}
              onChange={(e, { value }) => setAgeChoice(value)}
              style={{
                fontWeight: ageChoice === "both" ? "bold" : "normal",
              }}
            />
          </Form.Group>
          <Checkbox
            toggle
            onChange={() => setDecimalAge(!decimalAge)}
            fitted={false}
            label="Decimal age?"
            style={{marginLeft: "1em"}}
          />
        </Form.Group>
      </Form>

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
                decimalAge={decimalAge}
                chronologicalStyles={chronologicalStyles}
              />
            );
          })}
        </Table.Body>
      </Table>
    </div>
  );
};
