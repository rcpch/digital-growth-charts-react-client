import React, { useEffect, useState } from "react";

import {
  Container,
  Segment,
  Form,
  Input,
  Button,
  Header,
  Icon,
} from "semantic-ui-react";
import GestationSelect from "./subcomponents/GestationSelect";
import MeasurementMethodSelect from "./subcomponents/MeasurementMethodSelect";
import ReferenceSelect from "./subcomponents/ReferenceSelect";
import SexSelect from "./subcomponents/SexChoice";
import measurementOptions from "../selectData/measurementOptions";
import sexOptions from "../selectData/sexOptions";
import referenceOptions from "../selectData/referenceOptions";
import ErrorText from "./subcomponents/ErrorText";
import BoneAgeTypeSelect from "./subcomponents/BoneAge";
import { formatDate, parseDate } from "../functions/dateHelpers";
import UtilitiesForm from "./subcomponents/UtilitiesForm";

const ROBERT_WADLOW = 272; // interesting fact - Robert Wadlow (22/2/1918 – 15/7/1940) was the world's tallest man
const JON_BROWER_MINNOCH = 635; // interesting fact -  Jon Brower Minnoch (Born USA) was the world's heaviest man
const KHALID_BIN_MOHSEN_SHAARI = 204; // Khalid bin Mohsen Shaari (2/8/1991) from Saudi Arabia had the highest recorded BMI

const MeasurementForm = (props) => {
  const [birth_date, setBirth_date] = useState(formatDate(new Date()));
  const [observation_date, setObservation_date] = useState(
    formatDate(new Date())
  );
  const [measurement, setMeasurement] = useState({
    observation_value: "",
  });
  const [gestation_weeks, setGestation_weeks] = useState(40);
  const [gestation_days, setGestation_days] = useState(0);
  const [birth_date_error, setBirth_date_error] = useState("");
  const [observation_date_error, setObservation_date_error] = useState("");
  const [observation_value_error, setObservation_value_error] =
    useState("empty");
  const [form_valid, setForm_valid] = useState(false);
  const [boneAge, setBoneAge] = useState("");
  const [boneAgeType, setBoneAgeType] = useState("greulich-pyle");
  const [boneAgeSDS, setBoneAgeSDS] = useState("");
  const [boneAgeCentile, setBoneAgeCentile] = useState("");
  const [boneAgeText, setBoneAgeText] = useState("");
  const [events, setEvents] = useState([""]);
  const [showBoneAge, setShowBoneAge] = useState(false);
  const [showEvents, setShowEvents] = useState(false);

  const handleChangeReference = ({ value }) => {
    if (value !== "uk-who") {
      props.updateGlobalState("mid-parental-height", "reset"); //midparental height on present on UK-WHO reference
    }
    props.updateGlobalState("reference", value);
  };

  const handleBoneAgeTypeChange = ({ value }) => {
    setBoneAgeType(value);
  };

  const handleBoneAgeChange = (event, data) => {
    const boneAge = data.value;
    setBoneAge(boneAge);
  };

  const handleBoneAgeSDSChange = (event, data) => {
    const boneAgeSDS = data.value;
    setBoneAgeSDS(boneAgeSDS);
  };

  const handleBoneAgeCentileChange = (event, data) => {
    const boneAgeCentile = data.value;
    setBoneAgeCentile(boneAgeCentile);
  };

  const handleBoneAgeTextChange = (event, data) => {
    const boneAgeText = data.value;
    setBoneAgeText(boneAgeText);
  };

  const handleChangeDate = (event) => {
    event.target.name === "birth_date"
      ? setBirth_date(event.target.value)
      : setObservation_date(event.target.value);
    const newDate = parseDate(event.target.value);
    if (newDate) {
      const observation_date_object =
        event.target.name === "birth_date"
          ? parseDate(observation_date)
          : newDate;
      const birth_date_object =
        event.target.name === "birth_date" ? newDate : parseDate(birth_date);
      const timeInterval =
        observation_date_object.getTime() - birth_date_object.getTime();
      if (timeInterval < 0) {
        if (event.target.name === "birth_date") {
          setBirth_date_error(
            "Date of birth cannot come after the date of measurement"
          );
        } else if (event.target.name === "observation_date") {
          setObservation_date_error(
            "Date of measurement cannot come before the date of birth."
          );
        }
      } else if (timeInterval > 631139040000) {
        if (event.target.name === "birth_date") {
          setBirth_date_error("No centile data exists over 20 years of age.");
        } else {
          setObservation_date_error(
            "No centile data exists over 20 years of age."
          );
        }
      } else {
        setBirth_date_error("");
        setObservation_date_error("");
      }
    } else {
      if (event.target.name === "birth_date") {
        setBirth_date_error("Please enter a valid date.");
      } else {
        setObservation_date_error("Please enter a valid date.");
      }
    }
  };

  const handleObservationChange = (observation, data) => {
    // this is updating an observation value
    const observation_value = data.value;
    setMeasurement({ observation_value: observation_value });
    setObservation_value_error(
      validateObservationValue(
        props.globalState.measurementMethod,
        observation_value
      )
    );
  };

  const validateObservationValue = (measurement_method, observation_value) => {
    if (observation_value === "") {
      return "empty";
    }
    if (Number.isNaN(Number(observation_value))) {
      return "Please enter a valid number.";
    }
    if (measurement_method === "height") {
      if (observation_value < 20) {
        return "The " + measurement_method + " you entered is too low.";
      } else if (observation_value > ROBERT_WADLOW) {
        return "The " + measurement_method + " you entered is too tall.";
      } else {
        return "";
      }
    }
    if (measurement_method === "weight") {
      if (observation_value < 0.01) {
        return "The " + measurement_method + " you entered is too low.";
      } else if (observation_value > JON_BROWER_MINNOCH) {
        return "The " + measurement_method + " you entered is too heavy.";
      } else {
        return "";
      }
    }
    if (measurement_method === "bmi") {
      if (observation_value < 5) {
        return "The " + measurement_method + " you entered is too low.";
      } else if (observation_value > KHALID_BIN_MOHSEN_SHAARI) {
        return "The " + measurement_method + " you entered is too high.";
      } else {
        return "";
      }
    }
    if (measurement_method === "ofc") {
      if (observation_value < 25) {
        return "The " + measurement_method + " you entered is too low.";
      } else if (observation_value > 70) {
        return "The " + measurement_method + " you entered is too high.";
      } else {
        return "";
      }
    }
  };

  const handleSubmit = () => {
    // passes the form data back to the parent (measurement segment)
    let boneageData = {};
    let eventText = {
      events: [],
    };
    if (events.length > 0 && events[0].length > 0) {
      eventText = {
        events_text: events,
      };
    }
    if (showBoneAge) {
      if (!isNaN(parseFloat(boneAge))) {
        boneageData = {
          bone_age: parseFloat(boneAge),
          bone_age_type: boneAgeType,
          bone_age_centile: isNaN(parseFloat(boneAgeCentile))
            ? null
            : parseFloat(boneAgeCentile),
          bone_age_sds: isNaN(parseFloat(boneAgeSDS))
            ? null
            : parseFloat(boneAgeSDS),
          bone_age_text: boneAgeText,
        };
      }
    }
    const measurementFormData = {
      birth_date: birth_date,
      observation_date: observation_date,
      measurement_method: props.globalState.measurementMethod,
      observation_value: measurement.observation_value,
      gestation_weeks: gestation_weeks,
      gestation_days: gestation_days,
      sex: props.globalState.sex,
    };

    const formData = Object.assign(measurementFormData, boneageData, eventText);
    props.handleMeasurementResult(formData);
  };

  const handleChangeMeasurementMethod = (newMeasurementMethod) => {
    props.updateGlobalState("measurementMethod", newMeasurementMethod);
  };

  const handleChangeGestation = (data) => {
    const { name, value } = data;
    if (name === "gestation_weeks") {
      setGestation_weeks(value);
      if (value === 42) {
        setGestation_days(0);
      }
    } else if (name === "gestation_days") {
      if (gestation_weeks === 42) {
        setGestation_days(0);
      } else {
        setGestation_days(value);
      }
    }
  };

  const handleChangeSex = (val) => {
    props.updateGlobalState("sex", val.value);
  };

  const handleResetCurrentGraph = () => {
    props.updateGlobalState("resetCurrent", true);
  };

  const handleUndoLast = () => {
    props.updateGlobalState("undoLast", true);
  };

  const handleShowEvents = (e) => {
    e.preventDefault();
    const isPressed = showEvents;
    setShowEvents(!isPressed);
    setEvents([""]);
  };

  const handleShowBoneAge = (e) => {
    e.preventDefault();
    const isPressed = showBoneAge;
    setShowBoneAge(!isPressed);
    setBoneAge("");
    setBoneAgeCentile("");
    setBoneAgeSDS("");
    setBoneAgeType("greulich-pyle");
    setBoneAgeText("");
  };

  const handleMaternalHeight = (event, data) => {
    const paternalHeight =
      props.globalState["parentalHeights"]["height_paternal"];
    const heights = {
      height_maternal: data.value,
      height_paternal: paternalHeight,
    };
    props.updateGlobalState("parentalHeights", heights);
  };

  const handlePaternalHeight = (event, data) => {
    const maternalHeight =
      props.globalState["parentalHeights"]["height_maternal"];
    const heights = {
      height_maternal: maternalHeight,
      height_paternal: data.value,
    };
    props.updateGlobalState("parentalHeights", heights);
  };

  const removeMidParentalHeight = () => {
    props.updateGlobalState("mid-parental-height", "reset");
  };

  const midParentalHeightDataPresent = () => {
    if (props.globalState["mid-parental-height"].mid_parental_height) {
      return true;
    } else {
      return false;
    }
  };

  const handleUtilitiesDataSubmit = (event) => {
    if (event.target[0].value < 100 && event.target[1].value < 100) {
      return;
    }
    const formData = {
      height_maternal: event.target[0].value,
      height_paternal: event.target[1].value,
      sex: props.globalState["sex"],
    };
    props.updateGlobalState("isMidParentalHeightRequest", true);
    props.updateGlobalState("parentalHeights", {
      maternalHeight: event.target[0].value,
      paternalHeight: event.target[1].value,
    });
    props.handleUtilitiesFormDataSubmit(formData);
  };

  useEffect(() => {
    const formIsValid = () => {
      if (
        birth_date_error === "" &&
        observation_date_error === "" &&
        observation_value_error === ""
      ) {
        return true;
      } else {
        return false;
      }
    };

    if (formIsValid()) {
      setForm_valid(formIsValid());
    }
    if (props.globalState.clearMeasurement) {
      const newMeasurement = { ...measurement };
      newMeasurement.observation_value = "";
      setMeasurement(newMeasurement);
      setObservation_value_error("empty");
      setForm_valid(false);
      setShowBoneAge(false);
      setShowEvents(false);
      setEvents([""]);
      setBoneAgeCentile("");
      setBoneAgeSDS("");
      setBoneAgeType("greulich-pyle");
      setBoneAgeText("");
      props.updateGlobalState("clearMeasurement", false);
    }
  }, [
    form_valid,
    showBoneAge,
    showEvents,
    events,
    boneAgeCentile,
    boneAgeSDS,
    boneAgeType,
    boneAgeText,
    props,
    measurement,
    birth_date_error,
    observation_date_error,
    observation_value_error,
  ]);

  const makeDynamic = (option) => {
    const newDisabled = props.globalState.disabled[option.key];
    return { ...option, disabled: newDisabled };
  };
  const dynamicMeasurementOptions = measurementOptions.map(makeDynamic);

  const dynamicSexOptions = sexOptions.map(makeDynamic);

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Form.Field required>
          <Header as="h5" textAlign="left">
            Reference
          </Header>
          <ReferenceSelect
            reference={props.globalState.reference}
            handleChangeReference={handleChangeReference}
            referenceOptions={referenceOptions}
          />
        </Form.Field>
        <Form.Field required>
          <Header as="h5" textAlign="left">
            Dates
          </Header>
          <Input
            label="Birth Date"
            type="date"
            name="birth_date"
            value={birth_date}
            placeholder="Date of Birth"
            onChange={handleChangeDate}
          />
        </Form.Field>
        <Form.Field required>
          <Input
            label="Measurement Date"
            type="date"
            name="observation_date"
            value={observation_date}
            placeholder="Date of Measurement"
            onChange={handleChangeDate}
          />
        </Form.Field>
        <ErrorText errorText={observation_date_error} />
        <ErrorText errorText={birth_date_error} />

        <Form.Group style={{ textAlign: "left" }}>
          <Form.Field style={{ marginRight: 20 }} required>
            <label>Sex</label>
            <SexSelect
              sex={props.globalState.sex}
              handleSexChange={handleChangeSex}
              sexOptions={dynamicSexOptions}
            />
          </Form.Field>
          <Form.Field>
            <label>Gestation</label>
            <GestationSelect
              name="gestation_select"
              weeks={gestation_weeks}
              days={gestation_days}
              handleGestationChange={handleChangeGestation}
            />
          </Form.Field>
        </Form.Group>

        <Form.Group>
          <Form.Field required>
            <label style={{ textAlign: "left" }}>Measurements</label>
            <MeasurementMethodSelect
              measurementMethod={props.globalState.measurementMethod}
              handleChangeMeasurementMethod={handleChangeMeasurementMethod}
              measurementOptions={dynamicMeasurementOptions}
            />
          </Form.Field>
          <Form.Field width={8} required>
            <label style={{ textAlign: "left" }}>Value</label>
            <Input
              type="decimal"
              name="observation_value"
              placeholder="Measurement"
              value={measurement.observation_value}
              label={{
                content: props.globalState.units.toString(),
                basic: true,
                color: "black",
              }}
              labelPosition="right"
              onChange={handleObservationChange}
            />
          </Form.Field>
        </Form.Group>
        <ErrorText
          showError={observation_value_error !== "empty"}
          errorText={observation_value_error}
        />
        <Form.Group>
          {props.globalState.measurementMethod === "height" && (
            <Form.Field width={10}>
              <Button
                icon
                fluid
                labelPosition="left"
                onClick={handleShowBoneAge}
                color="black"
              >
                <Icon name="hand paper outline" />
                Add Bone Age
              </Button>
            </Form.Field>
          )}
          <Form.Field width={10}>
            <Button
              icon
              labelPosition="left"
              onClick={handleShowEvents}
              fluid
              color="black"
            >
              <Icon name="bookmark outline" />
              Add Event
            </Button>
          </Form.Field>
        </Form.Group>

        {showBoneAge && (
          <Segment>
            <BoneAgeTypeSelect
              boneAge={boneAge}
              handleBoneAgeChange={handleBoneAgeChange}
              boneAgeType={boneAgeType}
              handleChangeBoneAgeType={handleBoneAgeTypeChange}
              boneAgeCentile={boneAgeCentile}
              handleBoneAgeCentileChange={handleBoneAgeCentileChange}
              boneAgeSDS={boneAgeSDS}
              handleBoneAgeSDSChange={handleBoneAgeSDSChange}
              boneAgeText={boneAgeText}
              handleBoneAgeTextChange={handleBoneAgeTextChange}
            />
          </Segment>
        )}

        {showEvents && (
          <Segment>
            {events.map((anEvent, index) => {
              return (
                <Form.Group key={index}>
                  <Form.Field style={{ textAlign: "left" }} width="14">
                    <Input
                      name="event"
                      placeholder="e.g. diagnosis"
                      // value={anEvent}
                      onChange={(data) => {
                        let thisEvent = events;
                        thisEvent[index] = data.target.value;
                        setEvents(thisEvent);
                      }}
                    />
                  </Form.Field>
                  <Button
                    icon
                    circular
                    onClick={(e) => {
                      e.preventDefault();
                      if (events[index] === "") {
                        return;
                      }
                      let theEvents = events;
                      theEvents.push("");
                      setEvents(theEvents);
                    }}
                  >
                    <Icon name="plus circle" />
                  </Button>
                  {index === events.length - 1 && (
                    <Button
                      icon
                      circular
                      onClick={(e) => {
                        e.preventDefault();
                        if (index === 0) {
                          setEvents([""]);
                          return;
                        }
                        let newEvents = events.splice(index, 1);
                        setEvents(newEvents);
                      }}
                    >
                      <Icon name="minus circle" />
                    </Button>
                  )}
                </Form.Group>
              );
            })}
          </Segment>
        )}

        <Form.Field>
          <Button
            content="Calculate Centiles and Add To Chart"
            type="submit"
            fluid
            disabled={!form_valid}
            color="black"
            icon="line graph"
            labelPosition="right"
          />
        </Form.Field>
      </Form>
      {props.globalState.isDataPresent && (
        <Segment>
          <Button
            content="Reset Chart"
            icon="power off"
            onClick={handleResetCurrentGraph}
          />
          <Button content="Remove Last" icon="undo" onClick={handleUndoLast} />
        </Segment>
      )}

      {props.globalState.reference === "uk-who" && (
        <UtilitiesForm
          utilitiesFormDataSubmit={handleUtilitiesDataSubmit}
          changeMaternalHeight={handleMaternalHeight}
          changePaternalHeight={handlePaternalHeight}
          maternalHeight={props.globalState.parentalHeights.height_maternal}
          paternalHeight={props.globalState.parentalHeights.height_paternal}
          removeMidParentalHeight={removeMidParentalHeight}
          midParentalHeightDataPresent={midParentalHeightDataPresent()}
        />
      )}
    </Container>
  );
};

export default MeasurementForm;
