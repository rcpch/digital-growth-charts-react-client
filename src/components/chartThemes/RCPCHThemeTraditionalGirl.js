import {ChartTheme, ChartObject, GridlineObject, CentilesObject, MeasurementsObject, AxesObject} from './themes'

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

font: Montserrat regular

*/

const centileColour = "#c9559d"
const pubertyFill = "df99c4"
const tooltipBackgroundColour = "df99c4"
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

const RCPCHThemeTraditionalGirl = new ChartTheme(RCPCHChart, RCPCHGridlines, RCPCHAxes, RCPCHCentiles, RCPCHMeasurements)

export default RCPCHThemeTraditionalGirl