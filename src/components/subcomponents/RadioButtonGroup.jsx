import PropTypes from "prop-types";
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

RCPCHRadioButtonGroup.propTypes = {
    options: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            value: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.number,
                PropTypes.bool,
            ]).isRequired,
        })
    ).isRequired,
    selectedValue: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.bool,
        PropTypes.oneOf([null]),
    ]),
    onChange: PropTypes.func.isRequired,
    vertical: PropTypes.bool,
};

RCPCHRadioButtonGroup.defaultProps = {
    vertical: false,
    selectedValue: null,
};

export default RCPCHRadioButtonGroup;