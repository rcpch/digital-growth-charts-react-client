import PropTypes from "prop-types";

const Slider = (props) => {
  return (
    <div style={{ textAlign: "left" }}>
      <label style={{ padding: "10px" }}>{props.min} </label>

      <input
        type="range"
        min={props.min}
        max={props.max}
        value={props.value}
        step={props.step}
        className="slider"
        onChange={(e) => props.onChange(e.target.value)}
      />

      <label style={{ padding: "10px" }}>{props.max}</label>

      <h5 style={{ display: "inline" }}>
        {props.label}: {props.value} {props.isPercentage ? "%" : "SDS"}
      </h5>
    </div>
  );
};

Slider.propTypes = {
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  step: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  isPercentage: PropTypes.bool,
};

Slider.defaultProps = {
  isPercentage: false,
};

export default Slider;
