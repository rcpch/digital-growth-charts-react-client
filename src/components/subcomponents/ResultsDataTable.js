import { useState } from "react";
import { Table, Icon, Header } from "semantic-ui-react";
import { ResultsDataTableRow } from "./ResultsDataTableRow";

export const ResultsDataTable = ({ dataTitle, data }) => {
  const [isCorrected, setIsCorrected] = useState(true);
  const rotate = isCorrected ? "rotate(180deg)" : "rotate(0)";
  return (
    <>
      <Header>
        {dataTitle} ({isCorrected ? "Corrected" : "Chronological"}
        <Icon
          name="add circle"
          onClick={() => setIsCorrected(!isCorrected)}
          style={{ transform: rotate, transition: "all 0.2s linear" }}
        />
        )
      </Header>

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
              <>
                <ResultsDataTableRow
                  measurement={measurement}
                  key={index}
                  // isCorrected={isCorrected}
                  correctedChronological={"corrected"}
                />
                <ResultsDataTableRow
                  measurement={measurement}
                  key={index}
                  // isCorrected={isCorrected}
                  correctedChronological={"chronological"}
                />
              </>
            );
          })}
        </Table.Body>
      </Table>
    </>
  );
};
