import {ChartTheme, ChartObject, GridlineObject, CentilesObject, MeasurementsObject, AxesObject} from './themes'

/* 
Theme 4 - monochrome

Data:   #000000 - black
Area:   #b3b3b3 - midgrey
tooltip: #FFFFF - white

gridlines: #d9d9d9 - light grey
text: #000000 - black
background colour: #FFFFFF - white
centile width: 1.5 px

font: Montserrat regular
 
*/

const centileColour = "#000000"
const pubertyFill = "#b3b3b3"
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

const RCPCHThemeMonochrome = new ChartTheme(RCPCHChart, RCPCHGridlines, RCPCHAxes, RCPCHCentiles, RCPCHMeasurements)
export default RCPCHThemeMonochrome