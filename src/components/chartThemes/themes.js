export class ChartTheme{
    constructor(chart, gridlines, axes, centiles, measurements){
        this.chart = chart
        this.gridlines = gridlines
        this.axes = axes
        this.centiles = centiles
        this.measurements = measurements
    }
    get chart(){
        return this._chart
    }
    get gridlines(){
        return this._gridlines
    }
    get axes(){
        return this._axes
    }
    get centiles(){
        return this._centiles
    }
    get measurements(){
        return this._measurements
    }

    set chart(val){
        this._chart=val
    }
    set gridlines(val){
        this._gridlines=val
    }
    set axes(val){
        this._axes=val
    }
    set centiles(val){
        this._centiles=val
    }
    set measurements(val){
        this._measurements=val
    }
}

export class ChartObject{
    constructor(backgroundColour, width, height, tooltipBackgroundColour, tooltipTextColour){
        this.backgroundColour = backgroundColour
        this.width = width
        this.height = height
        this.tooltipBackgroundColour = tooltipBackgroundColour
        this.tooltipTextColour = tooltipTextColour
    }
    get backgroundColour(){
        return this._backgroundColour
    }
    get width(){
        return this._width
    }
    get height(){
        return this._height
    }
    get tooltipBackgroundColour(){
        return this._tooltipBackgroundColour
    }
    get tooltipTextColour(){
        return this._tooltipTextColour
    }
    set backgroundColour(val){
        this._backgroundColour=val
    }
    set width(val){
        this._width=val
    }
    set height(val){
        this._height=val
    }
    set tooltipBackgroundColour(val){
        this._tooltipBackgroundColour=val
    }
    set tooltipTextColour(val){
        this._tooltipTextColour=val
    }
}

export class GridlineObject{
    constructor(gridlines, stroke, strokeWidth, dashed){
        this.gridlines=gridlines
        this.stroke=stroke
        this.strokeWidth = strokeWidth
        this.dashed=dashed
    }
    get gridlines(){
        return this._gridlines
    }
    get stroke(){
        return this._stroke
    }
    get strokeWidth(){
        return this._strokeWidth
    }
    get dashed(){
        return this._dashed
    }
    set gridlines(val){
        this._gridlines=val
    }
    set stroke(val){
        this._stroke=val
    }
    set strokeWidth(val){
        this._strokeWidth=val
    }
    set dashed(val){
        this._dashed=val
    }
}

export class AxesObject{
    constructor(axisStroke, axisLabelColour, axisLabelFont, axisLabelSize, tickLabelSize){
        this.axisStroke=axisStroke
        this.axisLabelFont=axisLabelFont
        this.axisLabelColour=axisLabelColour
        this.axisLabelSize=axisLabelSize
        this.tickLabelSize=tickLabelSize
    }
    get axisStroke(){
        return this._axisStroke
    }
    get axisLabelFont(){
        return this._axisLabelFont
    }
    get axisLabelColour(){
        return this._axisLabelColour
    }
    get axisLabelSize(){
        return this._axisLabelSize
    }
    get tickLabelSize(){
        return this._tickLabelSize
    }
    set axisStroke(val){
        this._axisStroke=val
    }
    set axisLabelFont(val){
        this._axisLabelFont=val
    }
    set axisLabelColour(val){
        this._axisLabelColour=val
    }
    set axisLabelSize(val){
        this._axisLabelSize=val
    }
    set tickLabelSize(val){
        this._tickLabelSize=val
    }
}
export class CentilesObject{
    constructor(centileStroke, centileStrokeWidth, delayedPubertyAreaFill){
        this.centileStroke=centileStroke
        this.centileStrokeWidth=centileStrokeWidth
        this.delayedPubertyAreaFill=delayedPubertyAreaFill
    }
    get centileStroke(){
        return this._centileStroke
    }
    get centileStrokeWidth(){
        return this._centileStrokeWidth
    }
    get delayedPubertyAreaFill(){
        return this._delayedPubertyAreaFill
    }
    set centileStroke(val){
        this._centileStroke=val
    }
    set centileStrokeWidth(val){
        this._centileStrokeWidth=val
    }
    set delayedPubertyAreaFill(val){
        this._delayedPubertyAreaFill=val
    }
}

export class MeasurementsObject{
    constructor(measurementFill, measurementSize, measurementShape){
        this.measurementFill=measurementFill        
        this.measurementSize=measurementSize
        this.measurementShape=measurementShape    }
    get measurementFill(){
        return this._measurementFill
    }
    get measurementSize(){
        return this._measurementSize
    }
    get measurementShape(){
        return this._measurementShape
    }
    set measurementFill(val){
        this._measurementFill=val
    }
    set measurementSize(val){
        this._measurementSize=val
    }
    set measurementShape(val){
        this._measurementShape=val
    }
}

