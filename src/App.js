// React
import { useState, useMemo } from "react";

// Themes
import RCPCHTheme1 from "./components/chartThemes/rcpchTheme1";
import RCPCHTheme2 from "./components/chartThemes/rcpchTheme2";
import RCPCHTheme3 from "./components/chartThemes/rcpchTheme3";
import RCPCHThemeMonochrome from "./components/chartThemes/rcpchThemeMonochrome";
import RCPCHThemeTraditionalBoy from "./components/chartThemes/RCPCHThemeTraditionalBoy";
import RCPCHThemeTraditionalGirl from "./components/chartThemes/RCPCHThemeTraditionalGirl";

// Config
import { themeOptions, panesBlueprint } from "./assets/config.js";

// Semantic UI React
import { Tab } from "semantic-ui-react";
import createSemanticPanes from "./functions/semantic-ui-functions/createSemanticPanes.js";
import createFormPanes from "./components/SemanticGrid/subcomponents/createFormPanes.jsx";

// Components
import ErrorModal from "./components/ErrorModal.jsx";
import SemanticGrid from "./components/SemanticGrid/SemanticGrid.jsx";

// Custom hooks
import useErrorHandling from "./hooks/useErrorHandling.jsx";
import useSelectedTheme from "./hooks/useSelectedTheme.jsx";
import useCheckForData from "./hooks/useCheckForData.jsx";
import useGlobalState from "./hooks/useGlobalState";
import useRcpchApi from "./hooks/useRcpchApi";

// Functions
import ChangeTheme from "./functions/MeasurementSegment/handleChangeTheme";
import "./index.css";
import "./App.css";
import handleResetCurrent from "./functions/handleResetCurrent.js";
import handleUndoLast from "./functions/handleUndoLast.js";
import InitalErrorModalState from "./functions/InitialErrorModalState.js";

const defaultTheme = RCPCHThemeMonochrome;

function App() {
  // State functions
  const [chartStyle, setChartStyle] = useState(defaultTheme.chart);
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
    setChartStyle,
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
      setChartStyle,
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
  const panes = createSemanticPanes(
    panesBlueprint,
    centile,
    disabled,
    results,
    reference,
    sex,
    isLoading,
    chartStyle,
    axisStyle,
    defaultTheme,
    centileStyle,
    sdsStyle,
    measurementStyle,
    clinician
  );

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

  const FormPanes = createFormPanes(
    isLoading,
    measurements,
    reference,
    measurementMethod,
    setErrorModal,
    InitalErrorModalState,
    fetchResult,
    globalState,
    updateGlobalState,
    utilitiesFormDataSubmit,
    centileStyle,
    fictionalFormDataSubmit,
  );

  // Core return
  return (
    <>
      <SemanticGrid
        mode={mode}
        flip={flip}
        FormPanes={FormPanes}
        handleModeChange={handleModeChange}
        modeActiveIndex={modeActiveIndex}
        results={results}
        reference={reference}
        clinician={clinician}
        setClinician={setClinician}
        TabPanes={TabPanes}
        themeOptions={themeOptions}
        handleChangeTheme={handleChangeTheme}
        theme={theme}
        handleCentileSDS={handleCentileSDS}
        centile={centile}
        globalState={globalState}
        handleFlipResults={handleFlipResults}
      />
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
