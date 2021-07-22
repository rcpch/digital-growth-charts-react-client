import React from 'react';
import {
    Select,
  } from 'semantic-ui-react';

  
function SexSelect(props){

    return <Select
        name="sex"
        placeholder="Sex"
        value={props.sex}
        onChange={props.handleSexChange}
        options={props.sexOptions}
    />
}

export default SexSelect