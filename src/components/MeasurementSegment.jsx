// React
import React, { useState, useEffect, useMemo, Fragment } from "react";

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
import deepCopy from "../functions/deepCopy";
import { ResultsSegment } from "./subcomponents/ResultsSegment";
import { ErrorModal } from "./subcomponents/ErrorModal";
// import "../app.css";
import FictionalChildForm from "./FictionalChildForm";
import useRcpchApi from "../hooks/useRcpchApi";
import useGlobalState from "../hooks/useGlobalState";

const MeasurementSegment=({})=> {
  
  const [centile, setCentile] = useState(true);
  const [theme, setTheme] = useState({
    value: "monochrome",
    text: "Monochrome",
  });

  const [flip, setFlip] = useState(false); // flag to determine if results or chart showing
  const [errorModal, setErrorModal] = useState(InitalErrorModalState());
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
    clearApiErrors,
    measurements,
    results,
    apiErrors,
    isLoading,
  } = useRcpchApi(measurementMethod, reference, mode);

  const updateGlobalState = useMemo(
    () => makeGlobalStateUpdater(results),
    [results, makeGlobalStateUpdater]
  );

  useEffect(() => {
    if (apiErrors.errors) {
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
  }, [errors, apiErrors, clearApiErrors, updateGlobalState]);

  useEffect(() => {
    if (results[reference][measurementMethod].length > 0) {
      updateGlobalState("isDataPresent", true);
    } else {
      updateGlobalState("isDataPresent", false);
    }
  }, [results, reference, measurementMethod, updateGlobalState]);

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
      const existingResults = deepCopy(
        measurements[reference][measurementMethod]
      );
      let errorString = "";
      if (existingResults.length > 0) {
        const newGestation =
          latestResult.gestation_weeks * 7 + latestResult.gestation_days;
        const newErrors = [];
        for (const oldResult of existingResults) {
          if (JSON.stringify(oldResult) === JSON.stringify(latestResult)) {
            errorString = "duplicate";
            break;
          }
          const oldGestation =
            oldResult.gestation_weeks * 7 + oldResult.gestation_days;
          if (oldResult.sex !== latestResult.sex) {
            newErrors.push("differing sexes");
          }
          if (oldResult.birth_date !== latestResult.birth_date) {
            newErrors.push("differing date of births");
          }
          if (oldGestation !== newGestation) {
            newErrors.push("differing gestations");
          }
          if (newErrors.length > 0) {
            errorString = newErrors[0];
            if (newErrors.length === 2) {
              errorString = newErrors.join(" and ");
            } else if (newErrors.length === 3) {
              errorString = `${newErrors[0]}, ${newErrors[1]} and ${newErrors[2]}`;
            }
            break;
          }
        }
      }
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

  const panes = panesBlueprint.map((details, index) => {
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
              key={`centile-${index}`}
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
              key={`sds-${index}`}
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

  const TabPanes = () => (
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
  );

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
            // themeColour={centileStyle.centileStroke}
          />
        </Tab.Pane>
      ),
    },
    {
      key: "examples",
      menuItem: "Examples",
      render: () => (
        <Tab.Pane key="examples">
          <FictionalChildForm
            fictionalFormDataSubmit={fictionalFormDataSubmit}
            globalState={globalState}
            updateGlobalState={updateGlobalState}
            handleUtilitiesFormDataSubmit={utilitiesFormDataSubmit}
          />
        </Tab.Pane>
      ),
    },
  ];

  const ThemeSelection = () => (
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
  );
  
  return (
    <Fragment>
      <Grid padded>
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
                  <TabPanes />
                </div>
              )}
              <Grid verticalAlign="middle">
                <Grid.Row columns={3}>
                  <Grid.Column textAlign="left" width={4}>
                    <Checkbox
                      radio
                      label="Clinician Advice"
                      name="checkboxRadioGroup"
                      value={0}
                      checked={clinician}
                      onChange={(e, data) => setClinician(!clinician)}
                    />
                    <Checkbox
                      radio
                      label="Child/Family Advice"
                      name="checkboxRadioGroup"
                      value={1}
                      checked={!clinician}
                      onChange={(e, data) => setClinician(!clinician)}
                    />
                  </Grid.Column>
                  <Grid.Column textAlign="center" width={4}>
                    <ThemeSelection />
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
        <Grid.Row>
          <Container>
            <Message
              icon={"warning sign"}
              header={"DISCLAIMER"}
              content="This is for demonstration purposes only and is not for clinical use."
              color="red"
            />
          </Container>
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
