import { Segment, Tab, Menu } from "semantic-ui-react";
import { ResultsDataTable } from "./subcomponents/ResultsDataTable";
import { useState } from "react";

const ResultsSegment = ({ apiResult, reference }) => {
  // const fonts = [
  //   "Montserrat",
  //   "Roboto",
  //   "Lato",
  //   "Open Sans",
  //   "Source Sans Pro",
  //   "Noto Sans",
  // ];
  // const fontOptions = fonts.map((font) => {
  //   return {
  //     key: font,
  //     value: font,
  //     text: font,
  //     style: { fontFamily: font },
  //   };
  // });
  // const [fontChoice, setFontChoice] = useState(fonts[0]);
  // function handleSelectFontChoice({ value }) {
  //   setFontChoice(value);
  // }

  const panesBlueprint = [
    {
      menuItem: "Heights",
      measurementName: "height",
      key: "Heights",
      data: apiResult[reference].height,
      disabled: apiResult[reference].height.length === 0,
    },
    {
      menuItem: "Weights",
      measurementName: "weight",
      key: "Weights",
      data: apiResult[reference].weight,
      disabled: apiResult[reference].weight.length === 0,
    },
    {
      menuItem: "BMIs",
      measurementName: "bmi",
      key: "BMIs",
      data: apiResult[reference].bmi,
      disabled: apiResult[reference].bmi.length === 0,
    },
    {
      menuItem: "Head Circumferences",
      measurementName: "ofc",
      key: "Head Circumferences",
      data: apiResult[reference].ofc,
      disabled: apiResult[reference].ofc.length === 0,
    },
  ];

  const [choice, setChoice] = useState(0);

  function handleSelectMeasurementChoice(selection) {
    setChoice(selection.activeIndex);
  }

  const chronologicalStyles = {
    fontStyle: "italic",
    color: "#6c757d",
  };

  const panes = panesBlueprint.map((details, index) => {
    return {
      menuItem: (
        <Menu.Item disabled={details.disabled} key={details.measurementName}>
          {details.menuItem}
        </Menu.Item>
      ),
      render: () => {
        return (
          <Tab.Pane key={details.measurementName} attached="top">
            <ResultsDataTable
              dataTitle={details.measurementName}
              data={details.data}
              chronologicalStyles={chronologicalStyles}
              // fontChoice={fontChoice}
            />
          </Tab.Pane>
        );
      },
    };
  });

  return (
    <>
      <Segment>
        <Tab
          key="tabPanes"
          menu={{
            attached: "top",
            secondary: true,
            pointing: true,
          }}
          panes={panes}
          activeIndex={choice}
          onTabChange={(e, choice) => handleSelectMeasurementChoice(choice)}
        />
        {/* </Form.Field> */}
        {/* <Form.Field>
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
        </Form> */}
      </Segment>
    </>
  );
};

export default ResultsSegment