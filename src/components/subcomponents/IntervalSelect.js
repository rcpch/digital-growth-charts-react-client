import React from 'react';
import {
    Select,
  } from 'semantic-ui-react';

  
function IntervalTypeSelect(props){

    return <Select
        name="interval"
        placeholder="days"
        value={props.intervalType}
        onChange={(e, val)=>props.handleChangeIntervalType(val)}
        options={props.intervalTypeOptions}
    />
}

export default IntervalTypeSelect