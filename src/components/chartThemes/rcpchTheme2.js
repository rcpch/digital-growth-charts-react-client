import {
  ChartTheme,
  ChartObject,
  GridlineObject,
  CentilesObject,
  MeasurementsObject,
  AxesObject,
  TextStyleObject,
  PaddingObject,
} from './themes';

/* 
Theme 2

Data:  #ff8000 - orange
Area:  #ffc080 - orange (tint 40%)
tooltip: #3366cc - strong blue

gridlines: #d9d9d9 - light grey
text: #000000 - black
background colour: #FFFFFF - white
centile width: 1.5 px

font: Montserrat normal

*/

const centileColour = '#ff8000';
const pubertyFill = '#ffc080';
const tooltipBackGroundColour = '#3366cc';
// const tooltipTextColour = "#FFFFFF"
const gridlineColour = '#d9d9d9';
const gridlineWidth = 0.25;
const backgroundColour = '#FFFFFF';
const centileWidth = 1.5;
// const axisLabelColour = "#000000"
const axisstroke = '#000000';
const measurementsFill = '#000000';
const highlightedMeasurementFill = "#7159aa"; // purple
const midparentalHeightStroke = '#ff8000'
const midparentalHeightStrokeWidth = 0.25
const midparentalHeightFill='#ffc080'

const titleStyle = new TextStyleObject('Arial', '#000000', 14, 'bold');
const subTitleStyle = new TextStyleObject('Arial', '#000000', 14, 'normal');

const tooltipTextStyle = new TextStyleObject(
  'Montserrat',
  '#FFFFFF',
  0.25,
  'normal'
);
const infoBoxTextStyle = new TextStyleObject(
  'Montserrat',
  '#000000',
  6,
  'normal'
);

const axisLabelTextStyle = new TextStyleObject('Arial', '000000', 10, 'normal');
const tickLabelTextStyle = new TextStyleObject('Arial', '000000', 8, 'normal');
const chartPadding = new PaddingObject(50, 50, 25, 40);

const RCPCHChart = new ChartObject(
  backgroundColour,
  700,
  475,
  chartPadding,
  titleStyle,
  subTitleStyle,
  tooltipBackGroundColour,
  tooltipBackGroundColour,
  tooltipTextStyle,
  '#CDCDCD',
  '#CDCDCD',
  tooltipBackGroundColour,
  tooltipBackGroundColour,
  infoBoxTextStyle,
  '#E497C1',
  '#cb3083',
  '#FFFFFF'
);

const RCPCHGridlines = new GridlineObject(
  true,
  gridlineColour,
  gridlineWidth,
  false
);

const RCPCHCentiles = new CentilesObject(
  centileColour,
  centileWidth,
  pubertyFill,
  midparentalHeightStroke,
  midparentalHeightStrokeWidth,
  midparentalHeightFill
);

const RCPCHAxes = new AxesObject(
  axisstroke,
  axisLabelTextStyle,
  tickLabelTextStyle
);

const RCPCHMeasurements = new MeasurementsObject(
  measurementsFill,
  highlightedMeasurementFill
);

const RCPCHTheme2 = new ChartTheme(
  RCPCHChart,
  RCPCHGridlines,
  RCPCHAxes,
  RCPCHCentiles,
  RCPCHMeasurements
);

export default RCPCHTheme2;
