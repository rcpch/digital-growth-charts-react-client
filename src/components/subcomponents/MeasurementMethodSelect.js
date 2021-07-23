import React from 'react';
import {
    Select
  } from 'semantic-ui-react';

  
function MeasurementMethodSelect(props){

    return <Select
        name="measurement_method"
        placeholder="Measurement"
        value={props.measurementMethod}
        onChange={(e, val) => props.handleChangeMeasurementMethod(val.value)}
        options={props.measurementOptions}
    />
}

export default MeasurementMethodSelect