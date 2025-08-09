import React, { useState, useEffect } from "react";
import { Message, ButtonGroup, Button, Form } from "semantic-ui-react";
import MeasurementMethodSelect from "./subcomponents/MeasurementMethodSelect";
import ReferenceSelect from "./subcomponents/ReferenceSelect";
import SexSelect from "./subcomponents/SexChoice";

const ageOptions = [{ label: "Preterm Baby", value: "preterm" }, { label: "Infant", value: "infant" }, { label: "Child", value: "child" }, { label: "Teenager", value: "teenager" }];
import measurementOptions from "../selectData/measurementOptions";
import sexOptions from "../selectData/sexOptions";
import referenceOptions from "../selectData/referenceOptions";
import RCPCHRadioButtonGroup from "./subcomponents/RadioButtonGroup";

const Presets = (props) => {

  const ageOptions = [{ label: "Preterm Baby", value: "preterm" }, { label: "Infant", value: "infant" }, { label: "Child", value: "child" }, { label: "Teenager", value: "teenager" }];
  const [selectedAge, setSelectedAge] = useState(ageOptions[2].value);

  const conditionOptions = [
    { label: "Normal", value: "normal" },
    { label: "Faltering Growth", value: "faltering" },
    { label: "Obesity", value: "obesity" },
    { label: "Pubertal Delay", value: "pubertal-delay" },
    { label: "Short Stature", value: "short-stature" },
    { label: "Tall Stature", value: "tall-stature" },
    { label: "Microcephaly", value: "microcephaly" },
    { label: "Macrocephaly", value: "macrocephaly" },
    { label: "Coeliac Disease", value: "coeliac-disease" },
    { label: "Cystic Fibrosis", value: "cystic-fibrosis" },
    { label: "Growth Hormone Deficiency", value: "growth-hormone-deficiency" },
  ]
  const [conditionOption, setConditionOption] = useState(conditionOptions[0].value);

  const handleChangeMeasurementMethod = (newMeasurementMethod) => {
    props.updateGlobalState("measurementMethod", newMeasurementMethod);
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
          <label style={{ textAlign: "left" }}>Age Group</label>
          <RCPCHRadioButtonGroup
            vertical={false}
            options={ageOptions}
            selectedValue={selectedAge}
            onChange={(value) => {
              setSelectedAge(value);
            }}
          />
        </Form.Field>
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
            Submit Preset
          </Button>
        </Form.Field>
      </Form>
    </>
  );
};

export default Presets;