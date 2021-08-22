import React from 'react';
import { Dimmer, Loader } from 'semantic-ui-react';

import { RCPCHChart } from '@rcpch/digital-growth-charts-react-component-library';

function ChartData(props) {
  const isLoading = props.isLoading;
  const titles = setTitle(props);
  
  return (
    <div>
      <Dimmer active={isLoading}>
        <Loader>Fetching Data</Loader>
      </Dimmer>
      <RCPCHChart
        reference={props.reference}
        measurementMethod={props.measurementMethod}
        sex={props.sex}
        title={titles.title}
        subtitle={titles.subtitle}
        measurementsArray={props.measurementsArray} // this is the plottable child data
        chartStyle={props.chartStyle}
        measurementStyle={props.measurementStyle}
        centileStyle={props.centileStyle}
        gridlineStyle={props.gridlineStyle}
        axisStyle={props.axisStyle}
        enableZoom
      />
    </div>
  );
}

function setTitle(props) {
  // set the title of the chart
  let title = '';
  let subTitle = '';
  if (props.reference === 'uk-who') {
    title = 'UK-WHO';
  } else if (props.reference === 'turner') {
    title = "Turner's Syndrome";
  } else if (props.reference === 'trisomy-21') {
    title = "Trisomy 21 (Down's Syndrome)";
  }

  let sexText = '';
  let measurementText = '';
  if (props.sex === 'male') {
    sexText = 'Boys';
  } else {
    sexText = 'Girls';
  }

  switch (props.measurementMethod) {
    case 'height':
      measurementText = 'Height / Length';
      break;
    case 'weight':
      measurementText = 'Weight';
      break;
    case 'bmi':
      measurementText = 'Body Mass Index';
      break;
    case 'ofc':
      measurementText = 'Head Circumference';
      break;
    default:
      measurementText = '';
      break;
  }

  subTitle = measurementText + ' - ' + sexText;

  return { subtitle: subTitle, title: title };
}

export default ChartData;
