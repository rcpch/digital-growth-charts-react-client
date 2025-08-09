import React, { useState, useEffect } from "react";
import { Message, ButtonGroup, Button } from "semantic-ui-react";

const options = ["Preterm Baby", "Infant", "Child", "Teenager"];

const Presets = (props) => {
  const [selected, setSelected] = useState(options[0]); // default to "Preterm Baby"

  useEffect(() => {
    if (props.onChange) props.onChange(selected);
  }, [selected, props]);

  return (
    <>
      <Message>
        <p>The following examples are Presets to demonstrate the functionality of the charts.</p>
        <p>
          Please note that these examples are fictional and do not represent real patients. You can
          create fictional patients also by using the "Generator" tab.
        </p>
        <p>To use the charts, please enter your own measurements in the "Measurements" tab.</p>
      </Message>

      <ButtonGroup fluid className="preset-buttons" role="radiogroup" aria-label="Presets">
        {options.map((label) => (
          <Button
            key={label}
            toggle
            active={selected === label}
            role="radio"
            aria-checked={selected === label}
            onClick={() => setSelected(label)} // radio-like (no unselect)
          >
            {label}
          </Button>
        ))}
      </ButtonGroup>
    </>
  );
};

export default Presets;