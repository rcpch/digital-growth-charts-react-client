import { Dimmer, Loader } from "semantic-ui-react";

import { RCPCHChart } from "@rcpch/digital-growth-charts-react-component-library";

import { addToClipboard } from "../functions/addToClipboard";
import { canvasFromSVG } from "../functions/canvasFromSVG";

function ChartData(props) {
  const isLoading = props.isLoading;

  return (
    <div>
      <Dimmer active={isLoading}>
        <Loader>Fetching Data</Loader>
      </Dimmer>
      <RCPCHChart
        reference={props.reference}
        measurementMethod={props.measurementMethod}
        sex={props.sex}
        title={"Name - Hospital Number"}
        measurementsArray={props.measurementsArray} // this is the plottable child data
        midParentalHeightData={props.midParentalHeightData}
        theme={props.theme}
        enableZoom
        chartType={props.chartType}
        enableExport={true}
        exportChartCallback={exportChartCallback}
        clinicianFocus={props.clinicianFocus}
      />
    </div>
  );
}

function exportChartCallback(svg) {
  canvasFromSVG(svg).then((result) => {
    addToClipboard(result);
  });
}

export default ChartData;
