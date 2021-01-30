import {ChartTheme, ChartObject, GridlineObject, CentilesObject, MeasurementsObject, AxesObject} from './themes'

/* 
Theme 2

Data:  #ff8000 - orange
Area:  #ffc080 - orange (tint 40%)
tooltip: #3366cc - strong blue

gridlines: #d9d9d9 - light grey
text: #000000 - black
background colour: #FFFFFF - white
centile width: 1.5 px

font: Montserrat regular

*/

const centileColour = "#ff8000"
const pubertyFill = "#ffc080"
const tooltipBackGroundColour = "#3366cc"
const tooltipTextColour = "#FFFFFF"
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
     tooltipBackGroundColour,
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

const RCPCHTheme2 = new ChartTheme(RCPCHChart, RCPCHGridlines, RCPCHAxes, RCPCHCentiles, RCPCHMeasurements)

export default RCPCHTheme2