import React from 'react';
import {
    Select,
  } from 'semantic-ui-react';

  
function ReferenceSelect(props){

    return <Select
        name="reference"
        placeholder="UK-WHO"
        value={props.reference}
        onChange={(e, val)=>props.handleChangeReference(val)}
        options={props.referenceOptions}
    />
}

export default ReferenceSelect