import { useState } from "react";
import PropTypes from "prop-types";
import { Message, Button, Form } from "semantic-ui-react";
import MeasurementMethodSelect from "./subcomponents/MeasurementMethodSelect";
import ReferenceSelect from "./subcomponents/ReferenceSelect";
import SexSelect from "./subcomponents/SexChoice";
import { measurementMethodLabelForKey } from "../functions/measurementMethod";

import measurementOptions from "../selectData/measurementOptions";
import sexOptions from "../selectData/sexOptions";
import referenceOptions from "../selectData/referenceOptions";
import RCPCHRadioButtonGroup from "./subcomponents/RadioButtonGroup";

const Presets = (props) => {

  const conditionOptionList = [
    { label: "Normal", value: "normal", measurementMethod: "height", disabled: false },
    { label: "Faltering Growth", value: "faltering-growth", measurementMethod: "weight", disabled: false },
    { label: "Prematurity", value: "prematurity", measurementMethod: "weight", disabled: false },
    { label: "Malnutrition", value: "malnutrition", measurementMethod: "bmi", disabled: true },
    { label: "Obesity", value: "obesity", measurementMethod: "bmi", disabled: false },
    { label: "Pubertal Delay", value: "pubertal-delay", measurementMethod: "height", disabled: false },
    { label: "Short Stature", value: "short-stature", measurementMethod: "height", disabled: false },
    { label: "Tall Stature", value: "tall-stature", measurementMethod: "height", disabled: false },
    { label: "Microcephaly", value: "microcephaly", measurementMethod: "ofc", disabled: false },
    { label: "Macrocephaly", value: "macrocephaly", measurementMethod: "ofc", disabled: false },
    { label: "Coeliac Disease", value: "coeliac-disease", measurementMethod: "weight", disabled: false },
    { label: "Growth Hormone Deficiency", value: "growth-hormone-deficiency", measurementMethod: "height", disabled: false },
  ]

  const filterConditionOptionsToMeasurementMethod = (measurementMethod) => {
    if (props.globalState.reference !== "uk-who") {
      return conditionOptionList.filter(option => option.measurementMethod === measurementMethod && !option.disabled).sort((a, b) => a.label.localeCompare(b.label)).map(option => ({
        ...option,
        disabled: true
      }));
    }
    return conditionOptionList.filter(option => option.measurementMethod === measurementMethod).sort((a, b) => a.label.localeCompare(b.label));
  };
  // Initialize condition options based on the default measurement method
  const [conditionOptions, setConditionOptions] = useState(() => filterConditionOptionsToMeasurementMethod("height"));
  // Start with no condition selected so the user must choose one
  const [conditionOption, setConditionOption] = useState(null);


  const handleChangeMeasurementMethod = (newMeasurementMethod) => {
    // Update the global state with the new measurement method
    props.updateGlobalState("measurementMethod", newMeasurementMethod);
    // filter the condition options based on the selected measurement method
    const filteredConditions = filterConditionOptionsToMeasurementMethod(newMeasurementMethod);
    setConditionOptions(filteredConditions);
    // Reset selection until the user explicitly chooses a condition
    setConditionOption(null);
  };

  const handleChangeReference = ({ value }) => {
    props.updateGlobalState("reference", value);
  };

  const handleChangeSex = (val) => {
    props.updateGlobalState("sex", val.value);
  };


  const makeDynamic = (option) => {
    if (option.key !== "uk-who" && option.key!== "height" && option.key !== "weight" && option.key !== "bmi" && option.key !== "ofc") {
      return { ...option, disabled: true, text: `${option.text} (coming soon...)` }; // Indicate disabled options in the UI
    }
    return { ...option, disabled: false };
  };
  const dynamicMeasurementOptions = measurementOptions.map(makeDynamic);
  const dynamicReferenceOptions = referenceOptions.map(makeDynamic);

  // A condition is considered selected only if it matches one of the current options
  const isConditionSelected = conditionOptions.some(o => o.value === conditionOption);

  const handlePresetsSubmit = ({ age, condition }) => {
    // Forward to parent handler
    props.handlePresetsSubmit({ age, condition });
  };

  return (
    <>
      <Message>
        <p>The following are example scenarios to demonstrate the functionality of the charts.</p>
        <p>
          Please note that these examples are fictional and do not represent real patients. You can
          create fictional patients also by using the &quot;Generator&quot; tab.
        </p>
        <p>To use the charts, please enter your own measurements in the &quot;Measurements&quot; tab.</p>
      </Message>
      <Form className="preset-form" key="preset-form">
        <Form.Field>
          <ReferenceSelect
            handleChangeReference={handleChangeReference}
            value={props.globalState.reference}
            reference={props.globalState.reference}
            referenceOptions={dynamicReferenceOptions}
            aria-label="Select Reference"
          />
        </Form.Field>
        <Form.Field>
          <SexSelect
            handleSexChange={handleChangeSex}
            sexOptions={sexOptions}
            value={props.globalState.sex}
            sex={props.globalState.sex}
          />
        </Form.Field>
        <Form.Field>
          <MeasurementMethodSelect
            measurementMethod={props.globalState.measurementMethod}
            handleChangeMeasurementMethod={handleChangeMeasurementMethod}
            measurementOptions={dynamicMeasurementOptions}
          />
        </Form.Field>
        <hr></hr>
        <Form.Field>
          <label style={{ textAlign: "left" }}>Condition</label>
          <RCPCHRadioButtonGroup
            vertical={true}
            options={conditionOptions}
            selectedValue={conditionOption}
            onChange={(value) => {
              setConditionOption(value);
            }}
          />
        </Form.Field>
        <Form.Field>
          <Button
           type="submit"
           disabled={!isConditionSelected}
           onClick={() => {
             if (isConditionSelected) {
               handlePresetsSubmit({ age: null, condition: conditionOption });
             }
           }}
          >
            Generate {
              measurementMethodLabelForKey(props.globalState.measurementMethod)
            } Chart
          </Button>
        </Form.Field>
      </Form>
    </>
  );
};

Presets.propTypes = {
  updateGlobalState: PropTypes.func.isRequired,
  handlePresetsSubmit: PropTypes.func.isRequired,
  globalState: PropTypes.shape({
    disabled: PropTypes.object,
    reference: PropTypes.string,
    sex: PropTypes.string,
    measurementMethod: PropTypes.string,
  }).isRequired,
};

export default Presets;
