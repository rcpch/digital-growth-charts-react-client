// React
import React, { useState, setState } from "react";

// Semantic UI React
import { Segment, Grid, Message, Flag, Tab, Menu } from "semantic-ui-react";

// RCPCH Components
// import RCPCHChartComponent from "digital-growth-charts-react-chart-library";
import MeasurementForm from "../components/MeasurementForm";

function MeasurementSegment(props) {
  // const [heights, height_SDS] = useState([]);
  const [activeItem, setActiveItem] = useState("height");

  const panes = [
    { MenuItem: "height", render: () => <Tab.Pane>Height</Tab.Pane> },
    { MenuItem: "weight", render: () => <Tab.Pane>Weight</Tab.Pane> },
    { MenuItem: "bmi", render: () => <Tab.Pane>BMI</Tab.Pane> },
    { MenuItem: "ofc", render: () => <Tab.Pane>OFC</Tab.Pane> },
  ];

  return (
    <Grid centered stackable>
      <Grid.Column width={5}>
        <Segment raised>
          <Message>
            <Flag name="gb" />
            This calculator uses the UK-WHO references to calculate gold
            standard accurate child growth parameters. In the future we are
            planning to add other growth references such as specialist Trisomy
            21 and Turner's Syndrome references, CDC and WHO.
          </Message>

          <Message color="red">
            This site is under development. No responsibility is accepted for
            the accuracy of results produced by this tool.
          </Message>
        </Segment>
      </Grid.Column>

      <Grid.Column width={5}>
        <Segment raised>
          <MeasurementForm className="measurement-form" />
        </Segment>
      </Grid.Column>
      <Grid.Column width={5}>
        <Segment raised>
          <Menu>
            <Menu.Item
              name="height"
              active={activeItem === "height"}
              onClick={() => setActiveItem("height")}
            ></Menu.Item>
            <Menu.Item
              name="weight"
              active={activeItem === "weight"}
              onClick={() => setActiveItem("weight")}
            ></Menu.Item>
            <Menu.Item
              name="bmi"
              active={activeItem === "bmi"}
              onClick={() => setActiveItem("bmi")}
            ></Menu.Item>
            <Menu.Item
              name="ofc"
              active={activeItem === "ofc"}
              onClick={() => setActiveItem("ofc")}
            ></Menu.Item>
          </Menu>
          <Tab panes={panes}></Tab>
        </Segment>
      </Grid.Column>
    </Grid>
  );
}

export default MeasurementSegment;
