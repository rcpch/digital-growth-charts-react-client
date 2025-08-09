import React, { useState } from "react";
import { ButtonGroup, Button } from "semantic-ui-react";

const RCPCHRadioButtonGroup = (props) => {
    const { options, selectedValue, onChange, vertical } = props;
    return (
        <ButtonGroup
            basic
            fluid
            className="preset-buttons"
            vertical={vertical}
            role="radiogroup"
            aria-label="Presets"
            size="tiny"
        >
            {options.map((option) => (
                <Button
                    key={option.value}
                    toggle
                    active={selectedValue === option.value}
                    role="radio"
                    aria-checked={selectedValue === option.value}
                    onClick={() => onChange(option.value)} // radio-like (no unselect)
                >
                    {option.label}
                </Button>
            ))}
        </ButtonGroup>
    );
};

export default RCPCHRadioButtonGroup;