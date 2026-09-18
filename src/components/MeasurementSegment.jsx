// React
import { useState, useEffect, useMemo, Fragment } from "react";

// Semantic UI React
import {
  Grid,
  Segment,
  Tab,
  Dropdown,
  Button,
  Message,
  Container,
  Checkbox,
} from "semantic-ui-react";

import ChartData from "../api/Chart";
import MeasurementForm from "./MeasurementForm";
import { validatePatientMeasurement } from "../functions/measurementValidation";
import { ResultsSegment } from "./subcomponents/ResultsSegment";
import { ErrorModal } from "./subcomponents/ErrorModal";
import FictionalChildForm from "./FictionalChildForm";
import useRcpchApi from "../hooks/useRcpchApi";
import useGlobalState from "../hooks/useGlobalState";
import Presets from "./Presets";

const MeasurementSegment=()=> {

  const [centile, setCentile] = useState(true);
  const [theme, setTheme] = useState({
    value: "monochrome",
    text: "Monochrome",
  });

  const [flip, setFlip] = useState(false); // flag to determine if results or chart showing
  const [errorModal, setErrorModal] = useState(() => InitalErrorModalState());
  const { globalState, makeGlobalStateUpdater } = useGlobalState();
  const [clinician, setClinician] = useState(true);

  const {
    mode,
    modeActiveIndex,
    reference,
    measurementMethod,
    measurementMethodActiveIndex,
    sex,
    disabled,
    errors,
    resetCurrent,
    undoLast,
  } = globalState;

  const {
    fetchResult,
    removeLastActiveItem,
    clearBothActiveArrays,
    clearMidParentalHeight,
    clearApiErrors,
    measurements,
    results,
    apiErrors,
    isLoading,
    rateLimitExceeded,
    retryAfter
  } = useRcpchApi(measurementMethod, reference, mode);


  const updateGlobalState = useMemo(
    () => makeGlobalStateUpdater(results),
    [results, makeGlobalStateUpdater]
  );

  // Shows an appropriate error modal in response to API/global-state errors.
  // The setErrorModal calls here are intentional: the modal's open/closed
  // state is genuinely separate from the underlying error state (the user
  // can dismiss the modal without clearing the error, and vice versa).
  /* eslint-disable @eslint-react/set-state-in-effect */
  useEffect(() => {
    if (rateLimitExceeded) {
      setErrorModal({
        visible: true,
        title: "Rate limit exceeded",
        body: `This demo page is rate limited to ensure it is used fairly. You can try again in ${retryAfter} seconds.`,
        handleClose: () => {
          clearApiErrors();
          setErrorModal(InitalErrorModalState());
        },
      });
    } else if (apiErrors.errors) {
      setErrorModal({
        visible: true,
        title: "Unable to plot",
        body: apiErrors.message,
        handleClose: () => {
          clearApiErrors();
          setErrorModal(InitalErrorModalState());
        },
      });
    } else if (apiErrors.message === "success") {
      updateGlobalState("clearMeasurement", true);
      clearApiErrors();
    }
    if (errors.errors) {
      let body = "Only height data is available for Turner Syndrome.";
      if (errors.message === "Unable to change sex") {
        body =
          "Each chart can only display measurements from one patient at a time. Please reset the chart before entering measurements from a new patient.";
      }
      setErrorModal({
        visible: true,
        title: errors.message,
        body: body,
        handleClose: () => setErrorModal(InitalErrorModalState()),
      });
      updateGlobalState("errors", { errors: false, message: "" });
    }
  }, [errors, apiErrors, clearApiErrors, updateGlobalState, rateLimitExceeded, retryAfter]);
  /* eslint-enable @eslint-react/set-state-in-effect */

  useEffect(() => {
    if (results[reference][measurementMethod].length > 0) {
      updateGlobalState("isDataPresent", true);
    } else {
      updateGlobalState("isDataPresent", false);
    }
  }, [results, reference, measurementMethod, updateGlobalState]);

  useEffect(() => {
    updateGlobalState(
      "mid-parental-height",
      results[reference].midParentalHeights
    );
  }, [reference, results, updateGlobalState]);

  if (resetCurrent) {
    setErrorModal({
      visible: true,
      title: "Are you sure you want to reset?",
      body: "This will remove all measurements from the current chart.",
      handleCancel: () => setErrorModal(InitalErrorModalState()),
      handleClose: () => {
        clearBothActiveArrays();
        setErrorModal(InitalErrorModalState());
        updateGlobalState("mid-parental-height", "empty");
      },
    });
    updateGlobalState("resetCurrent", false);
  }

  if (undoLast) {
    setErrorModal({
      visible: true,
      title: "Are you sure you want to remove the last measurement?",
      body: "This will remove the last measurement entered on the chart.",
      handleCancel: () => setErrorModal(InitalErrorModalState()),
      handleClose: () => {
        removeLastActiveItem(true);
        setErrorModal(InitalErrorModalState());
      },
    });
    updateGlobalState("undoLast", false);
  }

  const handleTabChange = (e, { activeIndex }) => {
    updateGlobalState("measurementMethodActiveIndex", activeIndex);
  };

  const handleModeChange = (e, { activeIndex }) => {
    updateGlobalState("modeActiveIndex", activeIndex);
  };

  const fictionalFormDataSubmit = (formData) => {
    // convert percentage back to a decimal for the API
    formData.noise_range = formData.noise_range / 100;
    fetchResult(formData);
  };

  const utilitiesFormDataSubmit = (formData) => {
    // delegate function from midparental height calculation
    fetchResult(formData);
    if (isLoading) {
      return true;
    } else {
      return false;
    }
  };

  const presetsDataSubmit = (formData) => {
    // delegate function from Presets
    // receives form data and stores in the correct measurement array
    // passes to the chart (no API call needed)
    // formData contains age and condition
    fetchResult({
      ...formData,
      source: 'local',
      sex: sex
    });

  };


  const handleChangeTheme = (event, { value }) => {
    // callback from select theme
    // matches themeOptions by key and returns text to dropdown and value to chart for rerender in new theme
    const selectedOption = themeOptions.find((o) => o.key === value);
    const text = selectedOption["text"];

    setTheme({ value: value, text: text });
  };

  const handleFlipResults = () => {
    setFlip(!flip);
  };

  const handleCentileSDS = () => {
    setCentile(!centile);
  };

  const handleResults = (latestResult) => {
    // delegate function from MeasurementForm
    // receives form data and stores in the correct measurement array
    // checks for duplicates, mismatching dobs, sexes and gestations
    if (!isLoading) {
      const errorString = validatePatientMeasurement(
        measurements[reference],
        latestResult
      );
      if (errorString) {
        if (errorString === "duplicate") {
          setErrorModal({
            visible: true,
            title: "Duplicate entries",
            body: `Please check the last measurement entry as it appears to be identical to a measurement already entered.`,
            handleClose: () => setErrorModal(InitalErrorModalState()),
          });
        } else {
          setErrorModal({
            visible: true,
            title: "Please check entries",
            body: `Each chart can only display measurements from one patient at a time: ${errorString} were detected.`,
            handleClose: () => setErrorModal(InitalErrorModalState()),
          });
        }
        return false;
      } else {
        fetchResult(latestResult);
        return true;
      }
    }
  };

  const panes = panesBlueprint.map((details) => {
    return {
      menuItem: details.menuItem,
      render: () => {
        return centile ? (
          <Tab.Pane
            key="charts"
            attached="top"
            disabled={disabled[details.measurementName]}
          >
            <ChartData
              key={`centile-${details.key}`}
              reference={reference}
              sex={sex}
              measurementMethod={details.measurementName}
              measurementsArray={results[reference][details.measurementName]}
              midParentalHeightData={results[reference]["midParentalHeights"]}
              theme={theme.value}
              isLoading={isLoading}
              chartType="centile"
              clinicianFocus={clinician}
            />
          </Tab.Pane>
        ) : (
          <Tab.Pane attached="top" key="sds">
            <ChartData
              key={`sds-${details.key}`}
              reference={reference}
              sex={sex}
              measurementMethod={details.measurementName}
              measurementsArray={results[reference]}
              midParentalHeightData={results[reference]["midParentalHeights"]}
              theme={theme.value}
              isLoading={isLoading}
              chartType="sds"
            />
          </Tab.Pane>
        );
      },
    };
  });

  const FormPanes = [
    {
      key: "measurements",
      menuItem: "Measurements",
      render: () => (
        <Tab.Pane attached={false} key="measurements">
          <MeasurementForm
            handleMeasurementResult={handleResults}
            globalState={globalState}
            updateGlobalState={updateGlobalState}
            className="measurement-form"
            handleUtilitiesFormDataSubmit={utilitiesFormDataSubmit}
            handleRemoveMidParentalHeight={clearMidParentalHeight}
            // themeColour={centileStyle.centileStroke}
          />
        </Tab.Pane>
      ),
    },
    {
      key: "examples",
      menuItem: "Generator",
      render: () => (
        <Tab.Pane key="examples">
          <FictionalChildForm
            fictionalFormDataSubmit={fictionalFormDataSubmit}
            globalState={globalState}
            updateGlobalState={updateGlobalState}
            handleUtilitiesFormDataSubmit={utilitiesFormDataSubmit}
            handleRemoveMidParentalHeight={clearMidParentalHeight}
          />
        </Tab.Pane>
      ),
    },
    {
      key: "presets",
      menuItem: "Example Charts",
      render: () => (
        <Tab.Pane key="presets">
          <Presets
            key={`${reference}:${measurementMethod}`}
            globalState={globalState}
            updateGlobalState={updateGlobalState}
            handlePresetsSubmit={presetsDataSubmit}
          />
        </Tab.Pane>
      ),
    },
  ];

  return (
    <Fragment>
      <Grid padded stackable>
        <Grid.Row>
          <Container>
            <Message
              icon="warning sign"
              header="Demonstration only - not for clinical use"
              color="red"
              content={
                <p>
                  Use fictional data only. Do not enter real or identifiable
                  patient data. Calculation inputs are sent to the configured
                  RCPCH API. Read the{" "}
                  <a href="https://growth.rcpch.ac.uk/legal/privacy-notice/">
                    privacy notice
                  </a>
                  .
                </p>
              }
            />
          </Container>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={6}>
            <Segment
              textAlign={"center"}
              color={mode === "fictional-child-data" ? "black" : null}
            >
              <Tab
                key="measurementTabs"
                panes={FormPanes}
                menu={{
                  attached: false,
                  secondary: true,
                  pointing: true,
                }}
                onTabChange={handleModeChange}
                activeIndex={modeActiveIndex}
              />
            </Segment>
          </Grid.Column>
          <Grid.Column width={10}>
            <Segment color={mode === "fictional-child-data" ? "black" : null}>
              {flip ? (
                <ResultsSegment apiResult={results} reference={reference} />
              ) : (
                <div>
                  <Tab
                    key="tabPanes"
                    menu={{
                      attached: "top",
                      secondary: true,
                      pointing: true,
                    }}
                    panes={panes}
                    activeIndex={measurementMethodActiveIndex}
                    onTabChange={handleTabChange}
                  />
                </div>
              )}
              <Grid stackable verticalAlign="middle">
                <Grid.Row columns={3}>
                  <Grid.Column textAlign="left" width={4}>
                    <Checkbox
                      radio
                      label="Clinician Advice"
                      name="checkboxRadioGroup"
                      value={0}
                      checked={clinician}
                      onChange={() => setClinician(!clinician)}
                    />
                    <Checkbox
                      radio
                      label="Child/Family Advice"
                      name="checkboxRadioGroup"
                      value={1}
                      checked={!clinician}
                      onChange={() => setClinician(!clinician)}
                    />
                  </Grid.Column>
                  <Grid.Column textAlign="center" width={4}>
                    <span>
                      Theme{" "}
                      <Dropdown
                        options={themeOptions}
                        floating
                        inline
                        onChange={handleChangeTheme}
                        text={theme.text}
                      />
                    </span>
                  </Grid.Column>
                  <Grid.Column textAlign="right" width={8}>
                    <Button
                      onClick={handleCentileSDS}
                      color="black"
                      disabled={flip}
                    >
                      {centile ? "Show SDS Chart" : "Show Centile Charts"}
                    </Button>
                    <Button
                      disabled={!globalState.isDataPresent}
                      className="selectUpperMargin"
                      onClick={handleFlipResults}
                    >
                      {flip ? "Chart" : "Results"}
                    </Button>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>

      <ErrorModal
        title={errorModal.title}
        body={errorModal.body}
        visible={errorModal.visible}
        handleClose={errorModal.handleClose}
        handleCancel={errorModal.handleCancel}
      />
    </Fragment>
  );
}

const panesBlueprint = [
  {
    menuItem: "Height",
    measurementName: "height",
    key: "Height",
  },
  {
    menuItem: "Weight",
    measurementName: "weight",
    key: "Weight",
  },
  {
    menuItem: "BMI",
    measurementName: "bmi",
    key: "BMI",
  },
  {
    menuItem: "Head Circumference",
    measurementName: "ofc",
    key: "Head Circumference",
  },
];

const themeOptions = [
  { key: "monochrome", value: "monochrome", text: "Monochrome" },
  { key: "traditional", value: "traditional", text: "Traditional" },
  { key: "tanner1", value: "tanner1", text: "Tanner 1" },
  { key: "tanner2", value: "tanner2", text: "Tanner 2" },
  { key: "tanner3", value: "tanner3", text: "Tanner 3" },
];

function InitalErrorModalState() {
  return {
    visible: false,
    title: "",
    body: "",
    handleClose: null,
    handleCancel: null,
  };
}

export default MeasurementSegment;
