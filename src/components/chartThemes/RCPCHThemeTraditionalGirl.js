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
Traditional: girl

// girl 201 85 157 - #c9559d

Data:   #c9559d - pink
Area:   df99c4 - pink tint 40%
tooltip: #b3b3b3 - midgrey

gridlines: #d9d9d9 - light grey
text: #000000 - black
background colour: #FFFFFF - white
centile width: 1.5 px

font: Montserrat normal

*/

const centileColour = '#c9559d';
const pubertyFill = '#df99c4';
const tooltipBackgroundColour = '#df99c4';
const tooltipTextColour = '#000000';
const gridlineColour = '#d9d9d9';
const gridlineWidth = 0.25;
const backgroundColour = '#FFFFFF';
const centileWidth = 1.5;
const axisstroke = '#000000';
const measurementsFill = '#000000';
const highlightedMeasurementFill = '#c9559d'; // centile colour
const midparentalHeightStroke = '#c9559d';
const midparentalHeightStrokeWidth = 0.25;
const midparentalHeightFill = '#df99c4';

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
    '#df99c4',
    '#c9559d',
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

const RCPCHThemeTraditionalGirl = new ChartTheme(
    RCPCHChart,
    RCPCHGridlines,
    RCPCHAxes,
    RCPCHCentiles,
    RCPCHMeasurements
);

export default RCPCHThemeTraditionalGirl;
