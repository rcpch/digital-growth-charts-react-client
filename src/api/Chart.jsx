import { Dimmer, Loader } from "semantic-ui-react";

import { RCPCHChart } from "@rcpch/digital-growth-charts-react-component-library";

import { addToClipboard } from "../functions/addToClipboard";
import { canvasFromSVG } from "../functions/canvasFromSVG";

const ChartData=(props)=> {
  const isLoading = props.isLoading;

  let measurements = props.measurementsArray; // if SDS charts, the array already is in the structure { measurementMethod: [measurementsArray]}
  if (props.chartType === "centile") {
    // as of 7.0.0 the results now need to be presented as an object where the key is the measurement method
    measurements = { [props.measurementMethod]: props.measurementsArray };
  }

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
        measurements={measurements} // this is the plottable child data: NOTE IN Charts 7.0.0 this has changed
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
