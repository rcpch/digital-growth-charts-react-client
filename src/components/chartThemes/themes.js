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
    constructor(backgroundColour, width, height, tooltipColour){
        this.backgroundColour = backgroundColour
        this.width = width
        this.height = height
        this.tooltipColour = tooltipColour
    }
}

export class GridlineObject{
    constructor(gridlines, stroke, strokeWidth, dashed){
        this.gridlines=gridlines
        this.stroke=stroke
        this.strokeWidth = strokeWidth
        this.dashed=dashed
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
}

export class CentilesObject{
    constructor(centileStroke, centileStrokeWidth, delayedPubertyAreaFill){
        this.centileStroke=centileStroke
        this.centileStrokeWidth=centileStrokeWidth
        this.delayedPubertyAreaFill=delayedPubertyAreaFill
    }
}

export class MeasurementsObject{
    constructor(measurementFill, measurementSize, measurementShape){
        this.measurementFill=measurementFill        
        this.measurementSize=measurementSize
        this.measurementShape=measurementShape    }
}

