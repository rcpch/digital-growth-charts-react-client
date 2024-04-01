export class ChartTheme {
  constructor(chart, gridlines, axes, centiles, sds, measurements) {
    this.chart = chart;
    this.gridlines = gridlines;
    this.axes = axes;
    this.centiles = centiles;
    this.sds = sds;
    this.measurements = measurements;
  }
  get chart() {
    return this._chart;
  }
  get gridlines() {
    return this._gridlines;
  }
  get axes() {
    return this._axes;
  }
  get centiles() {
    return this._centiles;
  }
  get sds() {
    return this._sds;
  }
  get measurements() {
    return this._measurements;
  }

  set chart(val) {
    this._chart = val;
  }
  set gridlines(val) {
    this._gridlines = val;
  }
  set axes(val) {
    this._axes = val;
  }
  set centiles(val) {
    this._centiles = val;
  }
  set sds(val) {
    this._sds = val;
  }
  set measurements(val) {
    this._measurements = val;
  }
}

export class ChartObject {
  constructor(
    backgroundColour,
    titleStyle,
    subTitleStyle,
    tooltipBackgroundColour,
    tooltipStroke,
    tooltipTextStyle,
    termFill,
    termStroke,
    infoBoxFill,
    infoBoxStroke,
    infoBoxTextStyle,
    toggleButtonInactiveColour,
    toggleButtonActiveColour,
    toggleButtonTextColour
  ) {
    this.backgroundColour = backgroundColour;
    this.titleStyle = titleStyle;
    this.subTitleStyle = subTitleStyle;
    this.tooltipBackgroundColour = tooltipBackgroundColour;
    this.tooltipStroke = tooltipStroke;
    this.tooltipTextStyle = tooltipTextStyle;
    this.termFill = termFill;
    this.termStroke = termStroke;
    this.infoBoxFill = infoBoxFill;
    this.infoBoxStroke = infoBoxStroke;
    this.infoBoxTextStyle = infoBoxTextStyle;
    this.toggleButtonInactiveColour = toggleButtonInactiveColour;
    this.toggleButtonActiveColour = toggleButtonActiveColour;
    this.toggleButtonTextColour = toggleButtonTextColour;
  }
  get backgroundColour() {
    return this._backgroundColour;
  }
  get titleStyle() {
    return this._titleStyle;
  }
  get subTitleStyle() {
    return this._subTitleStyle;
  }
  get tooltipBackgroundColour() {
    return this._tooltipBackgroundColour;
  }
  get tooltipStroke() {
    return this._tooltipStroke;
  }
  get tooltipTextStyle() {
    return this._tooltipTextStyle;
  }
  get termFill() {
    return this._termFill;
  }
  get termStroke() {
    return this._termStroke;
  }
  get infoBoxFill() {
    return this._infoBoxFill;
  }
  get infoBoxStroke() {
    return this._infoBoxStroke;
  }
  get infoBoxTextStyle() {
    return this._infoBoxTextStyle;
  }
  get toggleButtonActiveColour() {
    return this._toggleButtonActiveColour;
  }
  get toggleButtonInactiveColour() {
    return this._toggleButtonInactiveColour;
  }
  get toggleButtonTextColour() {
    return this._toggleButtonTextColour;
  }
  set termFill(val) {
    this._termFill = val;
  }
  set termStroke(val) {
    this._termStroke = val;
  }
  set infoBoxFill(val) {
    this._infoBoxFill = val;
  }
  set infoBoxStroke(val) {
    this._infoBoxStroke = val;
  }
  set infoBoxTextStyle(val) {
    this._infoBoxTextStyle = val;
  }
  set backgroundColour(val) {
    this._backgroundColour = val;
  }
  set tooltipBackgroundColour(val) {
    this._tooltipBackgroundColour = val;
  }
  set tooltipStroke(val) {
    this._tooltipStroke = val;
  }
  set tooltipTextStyle(val) {
    this._tooltipTextStyle = val;
  }
  set titleStyle(val) {
    this._titleStyle = val;
  }
  set subTitleStyle(val) {
    this._subTitleStyle = val;
  }
  set toggleButtonTextColour(val) {
    this._toggleButtonTextColour = val;
  }
  set toggleButtonInactiveColour(val) {
    this._toggleButtonInactiveColour = val;
  }
  set toggleButtonActiveColour(val) {
    this._toggleButtonActiveColour = val;
  }
}

export class PaddingObject {
  constructor(left, right, top, bottom) {
    this.left = left;
    this.right = right;
    this.top = top;
    this.bottom = bottom;
  }
  get left() {
    return this._left;
  }
  get right() {
    return this._right;
  }
  get top() {
    return this._top;
  }
  get bottom() {
    return this._bottom;
  }

  set left(val) {
    this._left = val;
  }
  set right(val) {
    this._right = val;
  }
  set top(val) {
    this._top = val;
  }
  set bottom(val) {
    this._bottom = val;
  }
}

export class TextStyleObject {
  constructor(name, colour, size, style) {
    this.name = name;
    this.colour = colour;
    this.size = size;
    this.weight = style;
  }
  get name() {
    return this._name;
  }
  get colour() {
    return this._colour;
  }
  get size() {
    return this._size;
  }
  get style() {
    return this._style;
  }
  set name(val) {
    this._name = val;
  }
  set colour(val) {
    this._colour = val;
  }
  set size(val) {
    this._size = val;
  }
  set style(val) {
    this._style = val;
  }
}

export class GridlineObject {
  constructor(gridlines, stroke, strokeWidth, dashed) {
    this.gridlines = gridlines;
    this.stroke = stroke;
    this.strokeWidth = strokeWidth;
    this.dashed = dashed;
  }
  get gridlines() {
    return this._gridlines;
  }
  get stroke() {
    return this._stroke;
  }
  get strokeWidth() {
    return this._strokeWidth;
  }
  get dashed() {
    return this._dashed;
  }
  set gridlines(val) {
    this._gridlines = val;
  }
  set stroke(val) {
    this._stroke = val;
  }
  set strokeWidth(val) {
    this._strokeWidth = val;
  }
  set dashed(val) {
    this._dashed = val;
  }
}

export class AxesObject {
  constructor(axisStroke, axisLabelTextStyle, tickLabelStyle) {
    this.axisStroke = axisStroke;
    this.axisLabelTextStyle = axisLabelTextStyle;
    this.tickLabelTextStyle = tickLabelStyle;
  }
  get axisStroke() {
    return this._axisStroke;
  }
  get axisLabelTextStyle() {
    return this._axisLabelTextStyle;
  }
  get tickLabelTextStyle() {
    return this._tickLabelTexSize;
  }
  set axisStroke(val) {
    this._axisStroke = val;
  }
  set axisLabelTextStyle(val) {
    this._axisLabelTextStyle = val;
  }
  set tickLabelTextStyle(val) {
    this._tickLabelTexSize = val;
  }
}
export class CentilesObject {
  constructor(
    centileStroke,
    centileStrokeWidth,
    delayedPubertyAreaFill,
    midParentalCentileStroke,
    midParentalCentileStrokeWidth,
    midParentalAreaFill
  ) {
    this.centileStroke = centileStroke;
    this.centileStrokeWidth = centileStrokeWidth;
    this.delayedPubertyAreaFill = delayedPubertyAreaFill;
    this.midParentalCentileStroke = midParentalCentileStroke;
    this.midParentalCentileStrokeWidth = midParentalCentileStrokeWidth;
    this.midParentalAreaFill = midParentalAreaFill;
  }
  get centileStroke() {
    return this._centileStroke;
  }
  get centileStrokeWidth() {
    return this._centileStrokeWidth;
  }
  get delayedPubertyAreaFill() {
    return this._delayedPubertyAreaFill;
  }
  get midParentalAreaFill() {
    return this._midParentalAreaFill;
  }
  get midParentalCentileStroke() {
    return this._midParentalStroke;
  }
  get midParentalCentileStrokeWidth() {
    return this._midParentalStrokeWidth;
  }
  set centileStroke(val) {
    this._centileStroke = val;
  }
  set centileStrokeWidth(val) {
    this._centileStrokeWidth = val;
  }
  set delayedPubertyAreaFill(val) {
    this._delayedPubertyAreaFill = val;
  }
  set midParentalCentileStroke(val) {
    this._midParentalStroke = val;
  }
  set midParentalCentileStrokeWidth(val) {
    this._midParentalCentileStrokeWidth = val;
  }
  set midParentalAreaFill(val) {
    this._midParentalAreaFill = val;
  }
}

export class SDSObject {
  constructor(
    lineStrokeWidth,
    heightStroke,
    weightStroke,
    ofcStroke,
    bmiStroke
  ) {
    this.lineStrokeWidth = lineStrokeWidth;
    this.heightStroke = heightStroke;
    this.weightStroke = weightStroke;
    this.ofcStroke = ofcStroke;
    this.bmiStroke = bmiStroke;
  }
  get lineStrokeWidth() {
    return this._lineStrokeWidth;
  }
  get heightStroke() {
    return this._heightStroke;
  }
  get weightStroke() {
    return this._weightStroke;
  }
  get ofcStroke() {
    return this._ofcStroke;
  }
  get bmiStroke() {
    return this._bmiStroke;
  }

  set lineStrokeWidth(val) {
    this._lineStrokeWidth = val;
  }
  set heightStroke(val) {
    this._heightStroke = val;
  }
  set weightStroke(val) {
    this._weightStroke = val;
  }
  set bmiStroke(val) {
    this._bmiStroke = val;
  }
  set ofcStroke(val) {
    this._ofcStroke = val;
  }
}

export class MeasurementsObject {
  constructor(measurementFill, highlightedMeasurementFill) {
    this.measurementFill = measurementFill;
    this.highlightedMeasurementFill = highlightedMeasurementFill;
  }
  get measurementFill() {
    return this._measurementFill;
  }
  get highlightedMeasurementFill() {
    return this._highlightedMeasurementFill;
  }
  set measurementFill(val) {
    this._measurementFill = val;
  }
  set highlightedMeasurementFill(val) {
    this._highlightedMeasurementFill = val;
  }
}
