import * as React from "react";
import { useState } from "react";
import { Table, Checkbox, Form, Button } from "semantic-ui-react";
import { ResultsDataTableRow } from "./ResultsDataTableRow";

export const ResultsDataTable = ({
  // dataTitle,
  data,
  chronologicalStyles,
  // fontChoice,
}) => {
  const [ageChoice, setAgeChoice] = useState("corrected");
  const [decimalAge, setDecimalAge] = useState(false);

  return (
    <div>
      <Form>
        <Form.Group>
          {data.length > 0 &&
            data[0].measurement_dates.corrected_decimal_age !==
              data[0].measurement_dates.chronological_decimal_age && (
              <Button.Group>
                <Button
                  value="corrected"
                  active={ageChoice === "corrected"}
                  onClick={(e, { value }) => setAgeChoice(value)}
                  style={{
                    fontWeight: ageChoice === "corrected" ? "bold" : "normal",
                  }}
                >
                  Corrected
                </Button>
                <Button
                  value="chronological"
                  active={ageChoice === "chronological"}
                  onClick={(e, { value }) => setAgeChoice(value)}
                  style={{
                    fontWeight:
                      ageChoice === "chronological" ? "bold" : "normal",
                    ...chronologicalStyles,
                  }}
                >
                  Chronological
                </Button>
                <Button
                  value="both"
                  active={ageChoice === "both"}
                  onClick={(e, { value }) => setAgeChoice(value)}
                  style={{
                    fontWeight: ageChoice === "both" ? "bold" : "normal",
                  }}
                >
                  Both
                </Button>
              </Button.Group>
            )}
          <Checkbox
            toggle
            onChange={() => setDecimalAge(!decimalAge)}
            fitted={false}
            label="Decimal age?"
            style={{ marginLeft: "1em" }}
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
