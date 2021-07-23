import React from 'react';
import {
    Select,
  } from 'semantic-ui-react';

  
function SexSelect(props){

    return <Select
        name="sex"
        placeholder="Sex"
        value={props.sex}
        onChange={(e, val)=>props.handleSexChange(val)}
        options={props.sexOptions}
    />
}

export default SexSelect