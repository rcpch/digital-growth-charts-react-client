import { Form, Segment } from "semantic-ui-react";
import { ResultsDataTable } from "./ResultsDataTable";
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

  const [ageChoice, setAgeChoice] = useState("corrected");
  const [decimalAge, setDecimalAge] = useState(false);

  const chronologicalStyles = {
    fontStyle: "italic",
    color: "#6c757d",
  };

  return (
    <Segment>
      <Form>
        <Form.Group inline>
          <label>Data Table Font</label>
          <Form.Select
            selection
            options={fontOptions}
            defaultValue={"Montserrat"}
            onChange={(e, choice) => handleSelectFontChoice(choice)}
          ></Form.Select>
        </Form.Group>
        <Form.Group inline>
          <label>Measurement</label>
          <Form.Select
            multiple
            selection
            options={resultDataOptions}
            defaultValue={defaultValues}
            onChange={(e, choice) => handleSelectMeasurementChoice(choice)}
          ></Form.Select>
        </Form.Group>
        <Form.Group inline>
          <label>Age Result Type</label>
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
        <Form.Group inline>
          <label>Decimal Age</label>
          <Form.Checkbox
            toggle
            onChange={() => setDecimalAge(!decimalAge)}
            fitted={false}
          />
        </Form.Group>
      </Form>

      {choices.map((item) => {
        return (
          <ResultsDataTable
            dataTitle={item["dataTitle"]}
            data={item["data"]}
            ageChoice={ageChoice}
            decimalAge={decimalAge}
            key={item["dataTitle"]}
            chronologicalStyles={chronologicalStyles}
            fontChoice={fontChoice}
          />
        );
      })}
    </Segment>
  );
};
