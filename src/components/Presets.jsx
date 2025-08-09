import React, { useState, useEffect } from "react";
import { Message, ButtonGroup, Button, Form } from "semantic-ui-react";
import MeasurementMethodSelect from "./subcomponents/MeasurementMethodSelect";
import ReferenceSelect from "./subcomponents/ReferenceSelect";
import SexSelect from "./subcomponents/SexChoice";
import { measurementMethodLabelForKey } from "../functions/measurementMethod";

const ageOptions = [{ label: "Preterm Baby", value: "preterm" }, { label: "Infant", value: "infant" }, { label: "Child", value: "child" }, { label: "Teenager", value: "teenager" }];
import measurementOptions from "../selectData/measurementOptions";
import sexOptions from "../selectData/sexOptions";
import referenceOptions from "../selectData/referenceOptions";
import RCPCHRadioButtonGroup from "./subcomponents/RadioButtonGroup";

const Presets = (props) => {

  const ageOptions = [{ label: "Preterm Baby", value: "preterm" }, { label: "Infant", value: "infant" }, { label: "Child", value: "child" }, { label: "Teenager", value: "teenager" }];
  const [selectedAge, setSelectedAge] = useState(ageOptions[2].value);

  const conditionOptionList = [
    { label: "Normal", value: "normal", measurementMethod: "height" },
    { label: "Faltering Growth", value: "faltering", measurementMethod: "weight" },
    { label: "Prematurity", value: "prematurity", measurementMethod: "weight" },
    { label: "Malnutrition", value: "malnutrition", measurementMethod: "bmi" },
    { label: "Obesity", value: "obesity", measurementMethod: "bmi" },
    { label: "Pubertal Delay", value: "pubertal-delay", measurementMethod: "height" },
    { label: "Short Stature", value: "short-stature", measurementMethod: "height" },
    { label: "Tall Stature", value: "tall-stature", measurementMethod: "height" },
    { label: "Microcephaly", value: "microcephaly", measurementMethod: "ofc" },
    { label: "Macrocephaly", value: "macrocephaly", measurementMethod: "ofc" },
    { label: "Coeliac Disease", value: "coeliac-disease", measurementMethod: "height" },
    { label: "Cystic Fibrosis", value: "cystic-fibrosis", measurementMethod: "weight" },
    { label: "Growth Hormone Deficiency", value: "growth-hormone-deficiency", measurementMethod: "height" },
  ]
  
  const filterConditionOptionsToMeasurementMethod = (measurementMethod) => {
    return conditionOptionList.filter(option => option.measurementMethod === measurementMethod).sort((a, b) => a.label.localeCompare(b.label));
  };
  // Initialize condition options based on the default measurement method
  const [conditionOptions, setConditionOptions] = useState(filterConditionOptionsToMeasurementMethod("height"));
  const [conditionOption, setConditionOption] = useState(filterConditionOptionsToMeasurementMethod("height")[0].value);


  const handleChangeMeasurementMethod = (newMeasurementMethod) => {
    // Update the global state with the new measurement method
    props.updateGlobalState("measurementMethod", newMeasurementMethod);
    // filter the condition options based on the selected measurement method
    const filteredConditions = filterConditionOptionsToMeasurementMethod(newMeasurementMethod);
    setConditionOptions(filteredConditions);
  };
  
  const handleChangeReference = ({ value }) => {
    if (value !== "uk-who" && value !== "cdc" && value !== "who") {
      props.updateGlobalState("mid-parental-height", "reset"); //midparental height only present on UK-WHO and CDC reference
    }
    props.updateGlobalState("reference", value);
  };

  const handleChangeSex = (val) => {
    props.updateGlobalState("sex", val.value);
  };


  const makeDynamic = (option) => {
    const newDisabled = props.globalState.disabled[option.key];
    return { ...option, disabled: newDisabled };
  };
  const dynamicMeasurementOptions = measurementOptions.map(makeDynamic);

  const handlePresetsSubmit = (formData) => {
    // handle the form submission for presets
    const { age, condition } = formData;
    props.handlePresetsSubmit({
      age,
      condition
    });
  };

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
      <Form className="preset-form" key="preset-form">
        <Form.Field>
          <ReferenceSelect
            handleChangeReference={handleChangeReference}
            value={props.globalState.reference}
            reference={props.globalState.reference}
            referenceOptions={referenceOptions}
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
           onClick={() => handlePresetsSubmit({
             age: selectedAge,
             condition: conditionOption,
           })}
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

export default Presets;