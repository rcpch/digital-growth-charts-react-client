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
            {options.map((option) => {
                const isActive = selectedValue === option.value;
                const isDisabled = !!option.disabled;
                return (
                    <Button
                        key={option.value}
                        toggle
                        active={isActive}
                        disabled={isDisabled}
                        role="radio"
                        aria-checked={isActive}
                        aria-disabled={isDisabled}
                        tabIndex={isDisabled ? -1 : 0}
                        onClick={isDisabled ? undefined : () => onChange(option.value)}
                    >
                        {option.label}
                    </Button>
                );
            })}
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
            disabled: PropTypes.bool,
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