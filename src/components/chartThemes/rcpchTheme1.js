import {
    ChartTheme,
    ChartObject,
    GridlineObject,
    CentilesObject,
    MeasurementsObject,
    AxesObject,
    TextStyleObject,
    PaddingObject,
    SDSObject,
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
const gridlineColour = '#d9d9d9';
const gridlineWidth = 0.25;
const backgroundColour = '#FFFFFF';
const centileWidth = 1.5;
const axisstroke = '#000000';
const measurementsFill = '#000000';
const highlightedMeasurementFill = '#7159aa';

const midparentalHeightStroke = '#7159aa';
const midparentalHeightStrokeWidth = 3.0;
const midparentalHeightFill = '#c6bddd';

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

const lineStrokeWidth = 1.5;
const heightSDSStroke = '#7159aa';
const weightSDSStroke = '#ff8000';
const ofcSDSStroke = '#e60700';
const bmiSDSStroke = '#c2a712';

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
    '#c6bddd',
    '#7159aa',
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

const RCPCHSDS = new SDSObject(
    lineStrokeWidth,
    heightSDSStroke,
    weightSDSStroke,
    ofcSDSStroke,
    bmiSDSStroke
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

const RCPCHTheme1 = new ChartTheme(
    RCPCHChart,
    RCPCHGridlines,
    RCPCHAxes,
    RCPCHCentiles,
    RCPCHSDS,
    RCPCHMeasurements
);

export default RCPCHTheme1;
