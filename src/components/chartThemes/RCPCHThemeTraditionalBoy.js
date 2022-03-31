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
RCPCH traditional: boy

// boy 0 163 222 - #00a3de

Data:   #00a3de - blue
Area:   #66c8eb - blue tint 49%
tooltip: #b3b3b3 - midgrey

gridlines: #d9d9d9 - light grey
text: #000000 - black
background colour: #FFFFFF - white
centile width: 1.5 px

font: Montserrat normal

*/

const centileColour = '#00a3de';
const pubertyFill = '#66c8eb';
const tooltipBackgroundColour = '#66c8eb';
const tooltipTextColour = '#000000';
const gridlineColour = '#d9d9d9';
const gridlineWidth = 0.25;
const backgroundColour = '#FFFFFF';
const centileWidth = 1.5;
// const axisLabelColour = "#000000"
const axisstroke = '#000000';
const measurementsFill = '#000000';
const highlightedMeasurementFill = '#00a3de'; // centile colour
// const axisLabelSize = 10
// const tickLabelSize = 8
// const axisLabelFont = "Montserrat"
const midparentalHeightStroke = '#00a3de';
const midparentalHeightStrokeWidth = 0.25;
const midparentalHeightFill = '#66c8eb';

const titleStyle = new TextStyleObject('Arial', '#000000', 14, 'bold');
const subTitleStyle = new TextStyleObject('Arial', '#000000', 14, 'normal');

const tooltipTextStyle = new TextStyleObject(
    'Montserrat',
    tooltipTextColour,
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
    tooltipBackgroundColour,
    tooltipBackgroundColour,
    tooltipTextStyle,
    '#CDCDCD',
    '#CDCDCD',
    tooltipBackgroundColour,
    tooltipBackgroundColour,
    infoBoxTextStyle,
    '#66c8eb',
    '#00a3de',
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

const RCPCHThemeTraditionalBoy = new ChartTheme(
    RCPCHChart,
    RCPCHGridlines,
    RCPCHAxes,
    RCPCHCentiles,
    RCPCHMeasurements
);

export default RCPCHThemeTraditionalBoy;
