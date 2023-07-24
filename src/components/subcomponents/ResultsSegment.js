import { Segment, Select } from "semantic-ui-react";
import { ResultsDataTable } from "./ResultsDataTable";
import { useState } from "react";

export const ResultsSegment = ({ apiResult, reference }) => {
  const heights = apiResult[reference].height;
  const weights = apiResult[reference].weight;
  const bmis = apiResult[reference].bmi;
  const ofcs = apiResult[reference].ofc;

  const resultDataOptions = [
    {
      key: "heights",
      text: "Heights",
      value: "heights",
    },
    {
      key: "weights",
      text: "Weights",
      value: "weights",
    },
    {
      key: "bmis",
      text: "BMIs",
      value: "bmis",
    },
    {
      key: "ofcs",
      text: "OFCs",
      value: "ofcs",
    },
  ];

  const [choice, setChoice] = useState("");

  function handleSelectChoice({ value }) {
    setChoice(value);
  }

  return (
    <Segment>
      <Select
        placeholder="Select data to show"
        options={resultDataOptions}
        onChange={(e, choice) => handleSelectChoice(choice)}
      ></Select>
      {choice === "heights" && (
        <ResultsDataTable
          dataTitle={"Heights"}
          data={heights}
        ></ResultsDataTable>
      )}
      {choice === "weights" && (
        <ResultsDataTable
          dataTitle={"Weights"}
          data={weights}
        ></ResultsDataTable>
      )}
      {choice === "bmis" && (
        <ResultsDataTable dataTitle={"BMIs"} data={bmis}></ResultsDataTable>
      )}
      {choice === "ofcs" && (
        <ResultsDataTable dataTitle={"OFCs"} data={ofcs}></ResultsDataTable>
      )}
    </Segment>
  );
};
