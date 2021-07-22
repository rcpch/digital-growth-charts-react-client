// React
import React, { useState, useEffect } from 'react';

//themes
import RCPCHTheme1 from '../components/chartThemes/rcpchTheme1';
import RCPCHTheme2 from '../components/chartThemes/rcpchTheme2';
import RCPCHTheme3 from '../components/chartThemes/rcpchTheme3';
import RCPCHThemeMonochrome from '../components/chartThemes/rcpchThemeMonochrome';
import RCPCHThemeTraditionalBoy from '../components/chartThemes/RCPCHThemeTraditionalBoy';
import RCPCHThemeTraditionalGirl from '../components/chartThemes/RCPCHThemeTraditionalGirl';

// Semantic UI React
import { Grid, Segment, Tab, Dropdown, Button } from 'semantic-ui-react';

import ChartData from '../api/Chart';
import MeasurementForm from '../components/MeasurementForm';
import deepCopy from '../functions/deepCopy';
import { ResultsSegment, ErrorModal } from './SubComponents';
import '../index.css';
import FictionalChildForm from './FictionalChildForm';
import useRcpchApi from '../hooks/useRcpchApi';

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

  const [mode, setMode] = useState('calculation');

  const [errorModal, setErrorModal] = useState(InitalErrorModalState());
  const [commands, setCommands] = useState({
    clearMeasurement: false,
    resetCurrent: false,
    undoLast: false,
    changeSex: false,
  });

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

  useEffect(() => {
    if (apiErrors.errors) {
      setErrorModal({
        visible: true,
        title: 'Unable to plot',
        body: apiErrors.message,
        handleClose: () => {
          clearApiErrors();
          setErrorModal(InitalErrorModalState());
        },
      });
    } else if (apiErrors.message === 'success') {
      setCommands((old) => {
        const mutable = deepCopy(old);
        mutable.clearMeasurement = true;
        return mutable;
      });
      clearApiErrors();
    }
  }, [apiErrors, clearApiErrors]);

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

  if (commands.resetCurrent) {
    setErrorModal({
      visible: true,
      title: 'Are you sure you want to reset?',
      body: 'This will remove all measurements from the current chart.',
      handleCancel: () => setErrorModal(InitalErrorModalState()),
      handleClose: () => {
        clearBothActiveArrays();
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
        removeLastActiveItem(true);
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

  const handleModeChange = (e, { activeIndex }) => {
    setMode(activeIndex === 0 ? 'calculation' : 'fictional_child_data');
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
        results[newReference][measurementMethod].length > 0 &&
        results[newReference][measurementMethod][0]?.birth_data.sex !== sex
      ) {
        setSex(results[newReference][measurementMethod][0].birth_data.sex);
        return {
          newSex: results[newReference][measurementMethod][0].birth_data.sex,
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

  const handleResults = (newResultInArray) => {
    // delegate function from MeasurementForm
    // receives form data and stores in the correct measurement array
    // checks for duplicates, mismatching dobs, sexes and gestations
    const existingResults = deepCopy(
      measurements[reference][measurementMethod]
    );
    let errorString = '';
    const latestResult = newResultInArray[0];
    if (existingResults.length > 0) {
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
      fetchResult(latestResult);
      return true;
    }
  };

  const fictionalFormDataSubmit = (formData) => {
    fetchResult(formData);
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
            measurementsArray={results[reference][details.measurementName]}
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

  const FormPanes = [
    {
      menuItem: ' Measurements',
      render: () => (
        <Tab.Pane attached={false}>
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
        </Tab.Pane>
      ),
    },
    {
      menuItem: 'Demo Children',
      render: () => (
        <Tab.Pane>
          <FictionalChildForm
            fictionalFormDataSubmit={fictionalFormDataSubmit}
          />
        </Tab.Pane>
      ),
    },
  ];

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

  return (
    <React.Fragment>
      {/* <Container> */}
      <Grid padded>
        <Grid.Row>
          <Grid.Column width={6}>
            <Segment textAlign={'center'}>
              <Tab
                panes={FormPanes}
                menu={{ attached: false }}
                onTabChange={handleModeChange}
              />
            </Segment>
          </Grid.Column>
          <Grid.Column width={10}>
            <Segment>
              {flip ? (
                <ResultsSegment apiResult={results} reference={reference} />
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
      {/* </Container> */}
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
