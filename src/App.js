// React
import { useState, useMemo, Fragment } from "react";

// Themes
import RCPCHTheme1 from "./components/chartThemes/rcpchTheme1";
import RCPCHTheme2 from "./components/chartThemes/rcpchTheme2";
import RCPCHTheme3 from "./components/chartThemes/rcpchTheme3";
import RCPCHThemeMonochrome from "./components/chartThemes/rcpchThemeMonochrome";
import RCPCHThemeTraditionalBoy from "./components/chartThemes/RCPCHThemeTraditionalBoy";
import RCPCHThemeTraditionalGirl from "./components/chartThemes/RCPCHThemeTraditionalGirl";

// Semantic UI React
import {
  Grid,
  Segment,
  Tab,
  Button,
  Message,
  Container,
  Checkbox,
} from "semantic-ui-react";

// Components
import ThemeSelection from "./components/subcomponents/ThemeSelection.jsx";

// API calls
import ChartData from "./api/Chart";

// Custom hooks
import useErrorHandling from "./hooks/useErrorHandling.jsx";
import useSelectedTheme from "./hooks/useSelectedTheme.jsx";
import useCheckForData from "./hooks/useCheckForData.jsx";
import useGlobalState from "./hooks/useGlobalState";
import useRcpchApi from "./hooks/useRcpchApi";

// Functions
import ChangeTheme from "./functions/MeasurementSegment/handleChangeTheme";
import MeasurementForm from "./components/MeasurementForm";
import ResultsSegment from "./components/ResultsSegment.jsx";
import ErrorModal from "./components/ErrorModal.jsx";
import "./index.css";
import "./App.css";
import FictionalChildForm from "./components/FictionalChildForm";
import handleResetCurrent from "./functions/handleResetCurrent.js";
import handleUndoLast from "./functions/handleUndoLast.js";
import InitalErrorModalState from "./functions/InitialErrorModalState.js";

const defaultTheme = RCPCHThemeMonochrome;

// Other constants
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
  { key: "trad", value: "trad", text: "Traditional" },
  { key: "tanner1", value: "tanner1", text: "Tanner 1" },
  { key: "tanner2", value: "tanner2", text: "Tanner 2" },
  { key: "tanner3", value: "tanner3", text: "Tanner 3" },
];

function App() {
  // State functions
  const [chartStyle, setChartSyle] = useState(defaultTheme.chart);
  const [axisStyle, setAxisStyle] = useState(defaultTheme.axes);
  const [centileStyle, setCentileStyle] = useState(defaultTheme.centiles);
  const [sdsStyle, setSDSStyle] = useState(defaultTheme.sds);
  const [centile, setCentile] = useState(true);
  const [measurementStyle, setMeasurementStyle] = useState(
    defaultTheme.measurements
  );
  const [theme, setTheme] = useState({
    value: "tanner4",
    text: "Monochrome",
  });
  const [flip, setFlip] = useState(false); // flag to determine if results or chart showing
  const [errorModal, setErrorModal] = useState(InitalErrorModalState());
  const { globalState, makeGlobalStateUpdater } = useGlobalState();
  const [clinician, setClinician] = useState(true);

  // Other constants
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

  // Hooks
  // Error handling Custom Hook
  useErrorHandling(
    apiErrors,
    errors,
    setErrorModal,
    clearApiErrors,
    updateGlobalState,
    InitalErrorModalState
  );

  // Theme select Custom Hook
  useSelectedTheme(
    theme,
    sex,
    setCentileStyle,
    setChartSyle,
    setMeasurementStyle,
    setAxisStyle
  );

  // Check for input data Custom Hook
  useCheckForData(results, reference, measurementMethod, updateGlobalState);

  // If resetCurrent is flagged to true, then this function fires
  handleResetCurrent(
    resetCurrent,
    setErrorModal,
    clearBothActiveArrays,
    updateGlobalState,
    InitalErrorModalState
  );

  // If undoLast is flagged to true, then this function fires
  handleUndoLast(
    undoLast,
    setErrorModal,
    removeLastActiveItem,
    updateGlobalState,
    InitalErrorModalState
  );

  // React state functions
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

  const handleChangeTheme = (e, { value }) => {
    ChangeTheme(
      value,
      sex,
      RCPCHTheme1,
      RCPCHTheme2,
      RCPCHTheme3,
      RCPCHThemeMonochrome,
      RCPCHThemeTraditionalBoy,
      RCPCHThemeTraditionalGirl,
      setChartSyle,
      setCentileStyle,
      setSDSStyle,
      setMeasurementStyle,
      setAxisStyle,
      setTheme
    );
  };

  const handleFlipResults = () => {
    setFlip(!flip);
  };

  const handleCentileSDS = () => {
    setCentile(!centile);
  };

  
  // Other stuff (Semantic UI gubbins?)
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
              chartStyle={chartStyle}
              axisStyle={axisStyle}
              gridlineStyle={defaultTheme.gridlines}
              centileStyle={centileStyle}
              measurementStyle={measurementStyle}
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
              chartStyle={chartStyle}
              axisStyle={axisStyle}
              gridlineStyle={defaultTheme.gridlines}
              centileStyle={centileStyle}
              sdsStyle={sdsStyle}
              measurementStyle={measurementStyle}
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
            isLoading={isLoading}
            measurements={measurements}
            reference={reference}
            measurementMethod={measurementMethod}
            setErrorModal={setErrorModal}
            InitalErrorModalState={InitalErrorModalState}
            fetchResult={fetchResult}
            globalState={globalState}
            updateGlobalState={updateGlobalState}
            className="measurement-form"
            handleUtilitiesFormDataSubmit={utilitiesFormDataSubmit}
            themeColour={centileStyle.centileStroke}
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

  // Core return
  return (
    <>
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
                    <ThemeSelection
                      options={themeOptions}
                      onChange={handleChangeTheme}
                      text={theme.text}
                    />
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
    </>
  );
}

export default App;
