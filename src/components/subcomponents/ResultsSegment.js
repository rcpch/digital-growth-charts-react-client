import { Segment } from "semantic-ui-react";
import { ResultsDataTable } from "./ResultsDataTable";

export const ResultsSegment = ({ apiResult, reference }) => {
  const heights = apiResult[reference].height;
  const weights = apiResult[reference].weight;
  const bmis = apiResult[reference].bmi;
  const ofcs = apiResult[reference].ofc;

  return (
    <Segment>
      {heights.length > 0 && (
        <ResultsDataTable
          dataTitle={"Heights"}
          data={heights}
        ></ResultsDataTable>
      )}
      {weights.length > 0 && (
        <ResultsDataTable
          dataTitle={"Weights"}
          data={weights}
        ></ResultsDataTable>
      )}
      {bmis.length > 0 && (
        <ResultsDataTable dataTitle={"BMIs"} data={bmis}></ResultsDataTable>
      )}
      {ofcs.length > 0 && (
        <ResultsDataTable dataTitle={"OFCs"} data={ofcs}></ResultsDataTable>
      )}
    </Segment>
  );
};
