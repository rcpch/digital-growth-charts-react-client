import { Dropdown } from "semantic-ui-react";

const ThemeSelection = ({options, onChange, text}) => {
    console.log(onChange)
    return (

    <span>
      Theme{" "}
      <Dropdown
        options={options}
        floating
        inline
        onChange={onChange}
        text={text}
      />
    </span>
  )};

  export default ThemeSelection