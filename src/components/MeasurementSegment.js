// React
import React, { useState, useEffect, useCallback } from 'react';

//themes
import RCPCHTheme1 from '../components/chartThemes/rcpchTheme1';
import RCPCHTheme2 from '../components/chartThemes/rcpchTheme2';
import RCPCHTheme3 from '../components/chartThemes/rcpchTheme3';
import RCPCHThemeMonochrome from '../components/chartThemes/rcpchThemeMonochrome';
import RCPCHThemeTraditionalBoy from '../components/chartThemes/RCPCHThemeTraditionalBoy';
import RCPCHThemeTraditionalGirl from '../components/chartThemes/RCPCHThemeTraditionalGirl';

// Semantic UI React
import {
  Grid,
  Segment,
  Container,
  Tab,
  Dropdown,
  Button,
} from 'semantic-ui-react';
import axios from 'axios';

import ChartData from '../api/Chart';
import MeasurementForm from '../components/MeasurementForm';
import deepCopy from '../functions/deepCopy';
import { ResultsSegment, ErrorModal } from './SubComponents';
import '../index.css';

function MeasurementSegment() {
  const defaultTheme = RCPCHThemeMonochrome;

  const [chartStyle, setChartSyle] = useState(defaultTheme.chart);
  const [axisStyle, setAxisStyle] = useState(defaultTheme.axes);
  const [centileStyle, setCentileStyle] = useState(defaultTheme.centiles);
  const [measurementStyle, setMeasurementStyle] = useState(
    defaultTheme.measurements
  );

  const [theme, setTheme] = useState({
    value: 'tanner4',
    text: 'Monochrome',
  });

  const [flip, setFlip] = useState(false); // flag to determine if results or chart showing
  const [disabled, setDisabled] = useState({
    height: false,
    weight: false,
    bmi: false,
    ofc: false,
  });

  const [measurementMethod, setMeasurementMethod] = useState('height');
  const [reference, setReference] = useState('uk-who');
  const [sex, setSex] = useState('male');
  const [measurements, setMeasurements] = useState(InitialMeasurementState());
  const [apiResult, setAPIResult] = useState(InitialMeasurementState());

  const [errorModal, setErrorModal] = useState(InitalErrorModalState());

  const [isLoading, setIsLoading] = useState(false);
  const [commands, setCommands] = useState({
    clearMeasurement: false,
    resetCurrent: false,
    undoLast: false,
    changeSex: false,
  });

  let activeIndex;

  switch (measurementMethod) {
    case 'weight':
      activeIndex = 1;
      break;
    case 'bmi':
      activeIndex = 2;
      break;
    case 'ofc':
      activeIndex = 3;
      break;
    default:
      //height
      activeIndex = 0;
  }

  const removeLast = useCallback(
    (both = false) => {
      const newMeasurements = deepCopy(
        measurements[reference][measurementMethod]
      );
      newMeasurements.pop();
      setMeasurements((old) => {
        const mutable = deepCopy(old);
        mutable[reference][measurementMethod] = newMeasurements;
        return mutable;
      });
      if (both) {
        const newApi = deepCopy(apiResult[reference][measurementMethod]);
        newApi.pop();
        setAPIResult((old) => {
          const mutable = deepCopy(old);
          mutable[reference][measurementMethod] = newApi;
          return mutable;
        });
      }
    },
    [measurements, reference, measurementMethod, apiResult]
  );

  if (commands.resetCurrent) {
    const resetCurrent = (old) => {
      const mutable = deepCopy(old);
      mutable[reference][measurementMethod] = [];
      return mutable;
    };
    setErrorModal({
      visible: true,
      title: 'Are you sure you want to reset?',
      body: 'This will remove all measurements from the current chart.',
      handleCancel: () => setErrorModal(InitalErrorModalState()),
      handleClose: () => {
        setMeasurements(resetCurrent);
        setAPIResult(resetCurrent);
        setErrorModal(InitalErrorModalState());
      },
    });
    setCommands((old) => {
      return { ...old, resetCurrent: false };
    });
  }

  if (commands.undoLast) {
    setErrorModal({
      visible: true,
      title: 'Are you sure you want to remove the last measurement?',
      body: 'This will remove the last measurement entered on the chart.',
      handleCancel: () => setErrorModal(InitalErrorModalState()),
      handleClose: () => {
        removeLast(true);
        setErrorModal(InitalErrorModalState());
      },
    });
    setCommands((old) => {
      return { ...old, undoLast: false };
    });
  }

  const customSetMeasurementMethod = (newMeasurementMethod) => {
    if (measurements[reference][newMeasurementMethod].length > 0) {
      const existingSex = measurements[reference][newMeasurementMethod][0].sex;
      if (existingSex !== sex) {
        changeSex(existingSex, true);
        setCommands((old) => {
          return { ...old, changeSex: true };
        });
      }
    }
    setMeasurementMethod(newMeasurementMethod);
  };

  const handleTabChange = (e, { activeIndex }) => {
    if (reference === 'turner' && activeIndex !== 0) {
      setErrorModal({
        visible: true,
        title: 'Measurement unavailable',
        body: "Only height data is available for Turner's Syndrome.",
        handleClose: () => setErrorModal(InitalErrorModalState()),
      });
      return null;
    }
    let newMeasurementMethod = '';
    switch (activeIndex) {
      case 0:
        newMeasurementMethod = 'height';
        break;
      case 1:
        newMeasurementMethod = 'weight';
        break;
      case 2:
        newMeasurementMethod = 'bmi';
        break;
      case 3:
        newMeasurementMethod = 'ofc';
        break;
      default:
        console.warn('Handle tab change did not pick up valid active index');
    }
    customSetMeasurementMethod(newMeasurementMethod);
  };

  const changeReference = (newReference) => {
    // call back from MeasurementForm
    setReference(newReference);
    if (newReference === 'turner') {
      setMeasurementMethod('height');
      setSex('female');
      setDisabled({
        height: false,
        weight: true,
        bmi: true,
        ofc: true,
      });
      return { newSex: 'female' };
    } else {
      setDisabled({
        height: false,
        weight: false,
        bmi: false,
        ofc: false,
      });
      if (
        apiResult[newReference][measurementMethod].length > 0 &&
        apiResult[newReference][measurementMethod][0]?.birth_data.sex !== sex
      ) {
        setSex(apiResult[newReference][measurementMethod][0].birth_data.sex);
        return {
          newSex: apiResult[newReference][measurementMethod][0].birth_data.sex,
        };
      } else {
        return { newSex: sex };
      }
    }
  };

  const changeSex = (newSex, ignoreError = false) => {
    // call back for MeasurementForm
    const existingResults = [...measurements[reference][measurementMethod]];
    if (existingResults.length > 0 && !ignoreError) {
      for (const oldResult of existingResults) {
        if (newSex !== oldResult.sex) {
          setErrorModal({
            visible: true,
            title: 'Unable to change sex',
            body: `Each chart can only display measurements from one patient at a time. Please reset the chart before entering measurements from a new patient.`,
            handleClose: () => setErrorModal(InitalErrorModalState()),
          });
          return false;
        }
      }
    }
    if (theme.value === 'trad') {
      const selectedTheme =
        newSex === 'male'
          ? RCPCHThemeTraditionalBoy
          : RCPCHThemeTraditionalGirl;
      setCentileStyle(selectedTheme.centiles);
      setChartSyle(selectedTheme.chart);
      setMeasurementStyle(selectedTheme.measurements);
      setAxisStyle(selectedTheme.axes);
    }
    setSex(newSex);
    return true;
  };

  const handleResults = (results) => {
    // delegate function from MeasurementForm
    // receives form data and stores in the correct measurement array
    // checks for duplicates, mismatching dobs, sexes and gestations
    const existingResults = deepCopy(
      measurements[reference][measurementMethod]
    );
    let errorString = '';
    if (existingResults.length > 0) {
      const latestResult = results[0];
      const newGestation =
        latestResult.gestation_weeks * 7 + latestResult.gestation_days;
      const errors = [];
      for (const oldResult of existingResults) {
        if (JSON.stringify(oldResult) === JSON.stringify(latestResult)) {
          errorString = 'duplicate';
          break;
        }
        const oldGestation =
          oldResult.gestation_weeks * 7 + oldResult.gestation_days;
        if (oldResult.sex !== latestResult.sex) {
          errors.push('differing sexes');
        }
        if (oldResult.birth_date !== latestResult.birth_date) {
          errors.push('differing date of births');
        }
        if (oldGestation !== newGestation) {
          errors.push('differing gestations');
        }
        if (errors.length > 0) {
          errorString = errors[0];
          if (errors.length === 2) {
            errorString = errors.join(' and ');
          } else if (errors.length === 3) {
            errorString = `${errors[0]}, ${errors[1]} and ${errors[2]}`;
          }
          break;
        }
      }
    }
    if (errorString) {
      if (errorString === 'duplicate') {
        setErrorModal({
          visible: true,
          title: 'Duplicate entries',
          body: `Please check the last measurement entry as it appears to be identical to a measurement already entered.`,
          handleClose: () => setErrorModal(InitalErrorModalState()),
        });
      } else {
        setErrorModal({
          visible: true,
          title: 'Please check entries',
          body: `Each chart can only display measurements from one patient at a time: ${errorString} were detected.`,
          handleClose: () => setErrorModal(InitalErrorModalState()),
        });
      }
      return false;
    } else {
      setMeasurements((old) => {
        const mutable = deepCopy(old);
        const newArray = mutable[reference][measurementMethod].concat(results);
        mutable[reference][measurementMethod] = newArray;
        return mutable;
      });
      setIsLoading(true);
      return true;
    }
  };

  const handleChangeTheme = (event, { value }) => {
    let selectedTheme;
    let text;

    if (value === 'trad') {
      if (sex === 'male') {
        selectedTheme = RCPCHThemeTraditionalBoy;
      } else {
        selectedTheme = RCPCHThemeTraditionalGirl;
      }
      text = 'Traditional';
    }
    if (value === 'tanner1') {
      selectedTheme = RCPCHTheme1;
      text = 'Tanner 1';
    }
    if (value === 'tanner2') {
      selectedTheme = RCPCHTheme2;
      text = 'Tanner 2';
    }
    if (value === 'tanner3') {
      selectedTheme = RCPCHTheme3;
      text = 'Tanner 3';
    }
    if (value === 'monochrome') {
      selectedTheme = RCPCHThemeMonochrome;
      text = 'Monochrome';
    }

    setCentileStyle(selectedTheme.centiles);
    setChartSyle(selectedTheme.chart);
    setMeasurementStyle(selectedTheme.measurements);
    setAxisStyle(selectedTheme.axes);
    setTheme({ value: value, text: text });
  };

  const handleFlipResults = () => {
    setFlip(!flip);
  };

  const panes = panesBlueprint.map((details) => {
    return {
      menuItem: details.menuItem,
      render: () => (
        <Tab.Pane attached="top" disabled={disabled[details.measurementName]}>
          <ChartData
            key={details.measurementName}
            reference={reference}
            sex={sex}
            measurementMethod={details.measurementName}
            measurementsArray={apiResult[reference][details.measurementName]}
            chartStyle={chartStyle}
            axisStyle={axisStyle}
            gridlineStyle={defaultTheme.gridlines}
            centileStyle={centileStyle}
            measurementStyle={measurementStyle}
            isLoading={isLoading}
          />
          {/* <Acknowledgements /> */}
        </Tab.Pane>
      ),
    };
  });

  const TabPanes = () => (
    <Tab
      menu={{ attached: 'top' }}
      panes={panes}
      activeIndex={activeIndex}
      onTabChange={handleTabChange}
    />
  );

  const ThemeSelection = () => (
    // <Menu compact className="selectUpperMargin">
    <span>
      Theme{' '}
      <Dropdown
        options={themeOptions}
        floating
        inline
        onChange={handleChangeTheme}
        text={theme.text}
      />
    </span>
    // </Menu>
  );

  useEffect(() => {
    const fetchCentilesForMeasurement = async (singleMeasurement) => {
      const url = `${process.env.REACT_APP_GROWTH_API_BASEURL}/${reference}/calculation`;
      const response = await axios({
        url: url,
        data: singleMeasurement,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    };

    let ignore = false;

    if (isLoading) {
      const relevantArray = measurements[reference][measurementMethod];
      const latestMeasurement = deepCopy(
        relevantArray[relevantArray.length - 1]
      );
      fetchCentilesForMeasurement(latestMeasurement)
        .then((result) => {
          if (!ignore) {
            if (
              result.measurement_calculated_values
                .corrected_measurement_error ||
              result.measurement_calculated_values
                .chronological_measurement_error
            ) {
              const measurementError =
                result.measurement_calculated_values
                  .corrected_measurement_error ||
                result.measurement_calculated_values
                  .chronological_measurement_error;
              setIsLoading(false);
              removeLast();
              setErrorModal({
                visible: true,
                title: 'Unable to plot',
                body: `Measurement entered cannot be processed by the server. Reason given: ${measurementError}`,
                handleClose: () => setErrorModal(InitalErrorModalState()),
              });
            } else {
              setIsLoading(false);
              setAPIResult((old) => {
                const mutable = deepCopy(old);
                const workingArray = deepCopy(
                  mutable[reference][measurementMethod]
                );
                workingArray.push(result);
                mutable[reference][measurementMethod] = workingArray;
                return mutable;
              });
              setCommands((old) => {
                return { ...old, clearMeasurement: true };
              });
            }
          }
        })
        .catch((error) => {
          setIsLoading(false);
          const errorForUser = `There has been a problem fetching the result from the server. Error details: ${error.message} `;
          removeLast();
          setErrorModal({
            visible: true,
            title: 'Server error',
            body: errorForUser,
            handleClose: () => setErrorModal(InitalErrorModalState()),
          });
        });
    }

    return () => {
      // this prevents data being added to state if unmounted
      ignore = true;
    };
  }, [
    isLoading,
    measurementMethod,
    reference,
    apiResult,
    measurements,
    removeLast,
  ]);

  return (
    <React.Fragment>
          <Container>
      <Grid padded>
        <Grid.Row>
          <Grid.Column width={6}> 
                <MeasurementForm
                  measurementResult={handleResults}
                  handleChangeReference={changeReference}
                  handleChangeSex={changeSex}
                  measurementMethod={measurementMethod}
                  setMeasurementMethod={customSetMeasurementMethod}
                  commands={commands}
                  setCommands={setCommands}
                  className="measurement-form"
                />
          </Grid.Column>
          <Grid.Column width={10}>
            <Segment>
              {flip ? (
                <ResultsSegment apiResult={apiResult} reference={reference} />
              ) : (
                <TabPanes />
              )}
              <Grid verticalAlign="middle">
                <Grid.Row columns={2}>
                  <Grid.Column textAlign="left">
                    <ThemeSelection />
                  </Grid.Column>
                  <Grid.Column textAlign="right">
                    <Button
                      className="selectUpperMargin"
                      onClick={handleFlipResults}
                    >
                      Results
                    </Button>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
              </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid> 
      </Container>
      <ErrorModal
        title={errorModal.title}
        body={errorModal.body}
        visible={errorModal.visible}
        handleClose={errorModal.handleClose}
        handleCancel={errorModal.handleCancel}
      />
    </React.Fragment>
  );
}

const panesBlueprint = [
  { menuItem: 'Height', measurementName: 'height' },
  { menuItem: 'Weight', measurementName: 'weight' },
  { menuItem: 'BMI', measurementName: 'bmi' },
  {
    menuItem: 'Head Circumference',
    measurementName: 'ofc',
  },
];

const themeOptions = [
  { key: 'monochrome', value: 'monochrome', text: 'Monochrome' },
  { key: 'trad', value: 'trad', text: 'Traditional' },
  { key: 'tanner1', value: 'tanner1', text: 'Tanner 1' },
  { key: 'tanner2', value: 'tanner2', text: 'Tanner 2' },
  { key: 'tanner3', value: 'tanner3', text: 'Tanner 3' },
];

function InitialMeasurementState() {
  return {
    turner: {
      height: [],
      weight: [],
      bmi: [],
      ofc: [],
    },
    'trisomy-21': {
      height: [],
      weight: [],
      bmi: [],
      ofc: [],
    },
    'uk-who': {
      height: [],
      weight: [],
      bmi: [],
      ofc: [],
    },
  };
}

function InitalErrorModalState() {
  return {
    visible: false,
    title: '',
    body: '',
    handleClose: null,
    handleCancel: null,
  };
}

export default MeasurementSegment;
