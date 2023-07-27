import React from "react";

import { Header } from "semantic-ui-react";

export const ResultsDataOptionsHeader = ({
  choicesLength,
  optionsLength,
}) => {
  let text;
  if (choicesLength === optionsLength) {
    text = "All choices selected";
  } else {
    text = `Chosen ${choicesLength} / ${optionsLength}`;
  }
  return (
    <Header as="h5" textAlign="left">
      Select Measurement ({text})
    </Header>
  );
}
