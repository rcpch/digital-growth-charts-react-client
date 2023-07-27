import { Form, Header, Segment, Select } from "semantic-ui-react";
import { ResultsDataTable } from "./ResultsDataTable";
import {ResultsDataOptionsHeader} from './ResultsDataOptionsHeader';
import { useState } from "react";

export const ResultsSegment = ({ apiResult, reference }) => {
  const fonts = [
    "Montserrat",
    "Roboto",
    "Lato",
    "Open Sans",
    "Source Sans Pro",
    "Noto Sans",
  ];
  const fontOptions = fonts.map((font) => {
    return {
      key: font,
      value: font,
      text: font,
      style: { fontFamily: font },
    };
  });
  const [fontChoice, setFontChoice] = useState(fonts[0]);
  function handleSelectFontChoice({ value }) {
    setFontChoice(value);
  }

  const data = {
    heights: apiResult[reference].height,
    weights: apiResult[reference].weight,
    bmis: apiResult[reference].bmi,
    ofcs: apiResult[reference].ofc,
  };
  const textMapper = {
    heights: "Heights",
    weights: "Weights",
    bmis: "BMIs",
    ofcs: "OFCs",
  };

  const resultDataOptions = Object.entries(data)
    .filter((items) => items[1].length > 0)
    .map((items) => {
      return {
        key: `${items[0]}`,
        value: `${items[0]}`,
        text: `${textMapper[items[0]]}`,
      };
    });

  const defaultValues = resultDataOptions.map((item) => item["key"]);

  const initialChoices = [];
  resultDataOptions.forEach((item) => {
    initialChoices.push({
      dataTitle: textMapper[item["key"]],
      data: data[item["key"]],
    });
  });
  const [choices, setChoices] = useState(initialChoices);

  function handleSelectMeasurementChoice({ value }) {
    let newChoices = [];
    value.forEach((item) => {
      newChoices.push({ dataTitle: textMapper[item], data: data[item] });
    });
    setChoices(newChoices);
  }

  const chronologicalStyles = {
    fontStyle: "italic",
    color: "#6c757d",
  };

  return (
    <>
      <Segment>
        <Form>
          <Form.Field>
            <ResultsDataOptionsHeader
              choicesLength={choices.length}
              optionsLength={resultDataOptions.length}
            />
            <Form.Select
              multiple
              selection
              options={resultDataOptions}
              defaultValue={defaultValues}
              onChange={(e, choice) => handleSelectMeasurementChoice(choice)}
            ></Form.Select>
          </Form.Field>
          <Form.Field>
            <Header as="h5" textAlign="left">
              Data Table Font
            </Header>
            <Select
              selection
              options={fontOptions}
              defaultValue={"Montserrat"}
              onChange={(e, choice) => handleSelectFontChoice(choice)}
            ></Select>
          </Form.Field>
        </Form>
      </Segment>

      {choices.map((item) => {
        return (
          <Segment key={item["dataTitle"]}>
            <ResultsDataTable
              dataTitle={item["dataTitle"]}
              data={item["data"]}
              chronologicalStyles={chronologicalStyles}
              fontChoice={fontChoice}
            />
          </Segment>
        );
      })}
    </>
  );
};
