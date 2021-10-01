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
Theme 1

Data:  #7159aa - purple
Area:  #c6bddd - purple (tint 40%)
tooltip: #fdc300 - yellow

gridlines: #d9d9d9 - light grey
text: #000000 - black
background colour: #FFFFFF - white
centile width: 1.5 px

font: Montserrat normal

*/

const centileColour = '#7159aa';
const pubertyFill = '#c6bddd';
const tooltipBackGroundColour = '#fdc300';
// const tooltipTextColour = "#FFFFFF"
const gridlineColour = '#d9d9d9';
const gridlineWidth = 0.25;
const backgroundColour = '#FFFFFF';
const centileWidth = 1.5;
// const axisLabelColour = "#000000"
const axisstroke = '#000000';
const measurementsFill = '#000000';
const measurementsStroke = '#000000';
const measurementsSize = 2;
// const axisLabelSize = 10
// const tickLabelSize = 8
// const axisLabelFont = "Montserrat"
const midparentalHeightStroke = "#8d7abb"
const midparentalHeightStrokeWidth = 1.5
const midparentalHeightFill="#e2ddee"

const titleStyle = new TextStyleObject('Arial', '#000000', 14, 'bold');
const subTitleStyle = new TextStyleObject('Arial', '#000000', 14, 'normal');

const tooltipTextStyle = new TextStyleObject(
  'Montserrat',
  '#000000',
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
  '#CDCDCD',
  '#CDCDCD',
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
  measurementsStroke,
  measurementsSize
);

const RCPCHTheme1 = new ChartTheme(
  RCPCHChart,
  RCPCHGridlines,
  RCPCHAxes,
  RCPCHCentiles,
  RCPCHMeasurements
);

export default RCPCHTheme1;
