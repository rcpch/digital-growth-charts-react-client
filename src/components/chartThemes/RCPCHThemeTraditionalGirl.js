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
const tooltip = "#b3b3b3"
const gridlineColour = "#d9d9d9"
const gridlineWidth = 0.25
const backgroundColour = "#FFFFFF"
const centileWidth = 1.5
const font="Montserrat"
const axisLabelColour = "#000000"
const axisColour = "#000000"
const measurementsColour = "#000000"

const RCPCHChart = new ChartObject(
     backgroundColour,
     809,
     700,
     tooltip
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
    axisColour,
    axisLabelColour,
    font,
    10,
    6
)

const RCPCHMeasurements = new MeasurementsObject(
    measurementsColour,
    2.5,
    "circle"
)

const RCPCHThemeTraditionalGirl = new ChartTheme(RCPCHChart, RCPCHGridlines, RCPCHCentiles, RCPCHAxes, RCPCHMeasurements)

export default RCPCHThemeTraditionalGirl