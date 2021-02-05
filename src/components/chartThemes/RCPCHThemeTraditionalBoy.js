import {ChartTheme, ChartObject, GridlineObject, CentilesObject, MeasurementsObject, AxesObject} from './themes'

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

font: Montserrat regular

*/

const centileColour = "#00a3de"
const pubertyFill = "#66c8eb"
const tooltipBackgroundColour = "#b3b3b3"
const tooltipTextColour = "#000000"
const gridlineColour = "#d9d9d9"
const gridlineWidth = 0.25
const backgroundColour = "#FFFFFF"
const centileWidth = 1.5
const axisLabelColour = "#000000"
const axisstroke = "#000000"
const measurementsFill = "#000000"
const measurementsShape = 'circle'
const measurementsSize = 2
const axisLabelSize = 10
const tickLabelSize = 8
const axisLabelFont = "Montserrat"


const RCPCHChart = new ChartObject(
    backgroundColour,
    700,
    500,
    tooltipBackgroundColour,
    tooltipTextColour
)

const RCPCHGridlines = new GridlineObject(
   true,
   gridlineColour,
   gridlineWidth,
   false
)

const RCPCHCentiles = new CentilesObject(
   centileColour,
   centileWidth,
   pubertyFill
)

const RCPCHAxes = new AxesObject(
   axisstroke,
   axisLabelColour,
   axisLabelFont,
   axisLabelSize,
   tickLabelSize
)

const RCPCHMeasurements = new MeasurementsObject(
   measurementsFill,
   measurementsSize,
   measurementsShape
)

const RCPCHThemeTraditionalBoy = new ChartTheme(RCPCHChart, RCPCHGridlines, RCPCHAxes, RCPCHCentiles, RCPCHMeasurements)

export default RCPCHThemeTraditionalBoy