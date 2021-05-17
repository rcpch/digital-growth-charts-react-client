// React
import React, { useState, useEffect } from 'react';
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
  Message,
  Flag,
  Tab,
  Dropdown,
  Button,
  Table,
  List,
  Modal,
} from 'semantic-ui-react';
import ChartData from '../api/Chart';
import MeasurementForm from '../components/MeasurementForm';
import '../index.css';

import axios from 'axios';

function MeasurementSegment() {
  const defaultTheme = RCPCHThemeMonochrome;

  const [measurementMethod, setMeasurementMethod] = useState('height');
  const [reference, setReference] = useState('uk-who');
  const [sex, setSex] = useState('male');
  const [chartStyle, setChartSyle] = useState(defaultTheme.chart);
  const [axisStyle, setAxisStyle] = useState(defaultTheme.axes);
  const [centileStyle, setCentileStyle] = useState(defaultTheme.centiles);
  const [gridlineStyle, setGridlineStyle] = useState(defaultTheme.gridlines);
  const [measurementStyle, setMeasurementStyle] = useState(
    defaultTheme.measurements
  );

  const [theme, setTheme] = useState({
    value: 'tanner4',
    text: 'Monochrome',
  });

  const [flip, setFlip] = useState(false); // flag to determine if results or chart showing
  const [heightDisabled, setHeightDisabled] = useState(false);
  const [weightDisabled, setWeightDisabled] = useState(false);
  const [bmiDisabled, setBMIDisabled] = useState(false);
  const [ofcDisabled, setOFCDisabled] = useState(false);

  const [measurements, setMeasurements] = useState(InitialMeasurementState());
  const [apiResult, setAPIResult] = useState(InitialMeasurementState());

  const [errorModal, setErrorModal] = useState(InitalErrorModalState());

  const [isLoading, setIsLoading] = useState(false);

  let activeIndex = 0;

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
      console.warn(
        'Fall through case for selecting active index for measurement method'
      );
  }

  useEffect(() => {
    const fetchCentilesForMeasurement = async (array) => {
      let url;
      if (reference === 'uk-who') {
        url = `${process.env.REACT_APP_GROWTH_API_BASEURL}/uk-who/calculation`;
      }
      if (reference === 'turner') {
        url = `${process.env.REACT_APP_GROWTH_API_BASEURL}/turner/calculation`;
      }
      if (reference === 'trisomy-21') {
        url = `${process.env.REACT_APP_GROWTH_API_BASEURL}/trisomy-21/calculation`;
      }

      const results = array.map(async (payload) => {
        const response = await axios({
          url: url,
          data: payload,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        return response.data;
      });

      return Promise.all(results);
    };

    let ignore = false;

    if (isLoading) {
      const submitArray = measurements[reference][measurementMethod];
      if (submitArray.length > 0) {
        fetchCentilesForMeasurement(submitArray)
          .then((final) => {
            if (!ignore) {
              let error = '';
              for (const result of final) {
                if (
                  result.measurement_calculated_values
                    .corrected_measurement_error
                ) {
                  error =
                    result.measurement_calculated_values
                      .corrected_measurement_error;
                  break;
                }
              }
              if (error) {
                setErrorModal({
                  visible: true,
                  title: 'Incompatible measurement',
                  body: `Measurement entered has been rejected by the server. Reason given: ${error}`,
                });
              } else {
                setAPIResult((old) => {
                  const mutable = {
                    turner: { ...old.turner },
                    'trisomy-21': { ...old['trisomy-21'] },
                    'uk-who': { ...old['uk-who'] },
                  };
                  mutable[reference][measurementMethod] = final;
                  return mutable;
                });
              }
              setIsLoading(false);
            }
          })
          .catch((error) => {
            const errorForUser = `There has been a problem fetching the result from the server. Error details: ${error.message} `;
            setErrorModal({
              visible: true,
              title: 'Server error',
              body: errorForUser,
            });
            setIsLoading(false);
          });
      }
    }

    return () => {
      // this prevents data being added to state if unmounted
      ignore = true;
    };
  }, [isLoading, measurementMethod, reference, apiResult, measurements]);

  const handleTabChange = (e, { activeIndex }) => {
    if (reference === 'turner' && activeIndex !== 0) {
      setErrorModal({
        visible: true,
        title: 'Measurement unavailable',
        body: "Only height data is available for Turner's Syndrome.",
      });
    }
    switch (activeIndex) {
      case 0:
        setMeasurementMethod('height');
        break;
      case 1:
        setMeasurementMethod('weight');
        break;
      case 2:
        setMeasurementMethod('bmi');
        break;
      case 3:
        setMeasurementMethod('ofc');
        break;
      default:
        console.warm('Handle tab change did not pick up valid active index');
    }
  };

  const changeReference = (newReference) => {
    // call back from MeasurementForm
    setReference(newReference);
    if (newReference === 'turner') {
      setMeasurementMethod('height');
      setSex('female');
      setHeightDisabled(false);
      setWeightDisabled(true);
      setBMIDisabled(true);
      setOFCDisabled(true);
    }
    if (newReference === 'trisomy-21') {
      setHeightDisabled(false);
      setWeightDisabled(false);
      setBMIDisabled(false);
      setOFCDisabled(false);
    }
    if (newReference === 'uk-who') {
      setHeightDisabled(false);
      setWeightDisabled(false);
      setBMIDisabled(false);
      setOFCDisabled(false);
    }
  };

  const changeSex = (newSex) => {
    // call back from MeasurementForm
    const existingResults = [...measurements[reference][measurementMethod]];
    if (existingResults.length > 0) {
      for (const oldResult of existingResults) {
        if (newSex !== oldResult.sex) {
          setErrorModal({
            visible: true,
            title: 'Unable to change sex',
            body: `Each chart can only display measurements from one patient at a time.`,
          });
          return false;
        }
      }
    }
    setSex(newSex);
    let selectedTheme;
    if (reference === 'uk-who') {
      if (newSex === 'male') {
        selectedTheme = RCPCHThemeTraditionalBoy;
      } else {
        selectedTheme = RCPCHThemeTraditionalGirl;
      }
      setCentileStyle(selectedTheme.centiles);
      setChartSyle(selectedTheme.chart);
      setMeasurementStyle(selectedTheme.measurements);
      setAxisStyle(selectedTheme.axes);
      setGridlineStyle(selectedTheme.gridlines);
      setTheme({ value: 'tanner1', text: 'Tanner 1' });
    }
    return true;
  };

  const handleResults = (results) => {
    // delegate function from MeasurementForm
    // receives form data and stores in the correct measurement array
    // checks for mismatching dobs, sexes and gestations
    const existingResults = [...measurements[reference][measurementMethod]];
    let errorString = '';
    if (existingResults.length > 0) {
      const latestResult = results[0];
      const newGestation =
        latestResult.gestation_weeks * 7 + latestResult.gestation_days;
      const errors = [];
      for (const oldResult of existingResults) {
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
      setErrorModal({
        visible: true,
        title: 'Please check entries',
        body: `Each chart can only display measurements from one patient at a time: ${errorString} were detected.`,
      });
      return null;
    } else {
      setMeasurements((old) => {
        const mutable = {
          turner: { ...old.turner },
          'trisomy-21': { ...old['trisomy-21'] },
          'uk-who': { ...old['uk-who'] },
        };
        const newArray = old[reference][measurementMethod].concat(results);
        mutable[reference][measurementMethod] = newArray;
        return mutable;
      });
      setIsLoading(true);
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

  const panesBlueprint = [
    { menuItem: 'Height', measurementName: 'height', disabled: heightDisabled },
    { menuItem: 'Weight', measurementName: 'weight', disabled: weightDisabled },
    { menuItem: 'BMI', measurementName: 'bmi', disabled: bmiDisabled },
    {
      menuItem: 'Head Circumference',
      measurementName: 'ofc',
      disabled: ofcDisabled,
    },
  ];

  const panes = panesBlueprint.map((details) => {
    return {
      menuItem: details.menuItem,
      render: () => (
        <Tab.Pane attached="top" disabled={details.disabled}>
          <ChartData
            key={details.measurementName}
            reference={reference} //the choices are ["uk-who", "turner", "trisomy-21"] REQUIRED
            sex={sex} //the choices are ["male", "female"] REQUIRED
            measurementMethod={details.measurementName} //the choices are ["height", "weight", "ofc", "bmi"] REQUIRED
            measurementsArray={apiResult[reference][details.measurementName]} // an array of Measurement class objects from dGC Optional
            chartStyle={chartStyle}
            axisStyle={axisStyle}
            gridlineStyle={gridlineStyle}
            centileStyle={centileStyle}
            measurementStyle={measurementStyle}
            isLoading={isLoading}
          />
          <Acknowledgements />
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

  const themeOptions = [
    { key: 'trad', value: 'trad', text: 'Traditional' },
    { key: 'tanner1', value: 'tanner1', text: 'Tanner 1' },
    { key: 'tanner2', value: 'tanner2', text: 'Tanner 2' },
    { key: 'tanner3', value: 'tanner3', text: 'Tanner 3' },
    { key: 'monochrome', value: 'monochrome', text: 'Monochrome' },
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

  const ResultsSegment = () => (
    <Segment>
      <Table basic="very" celled collapsing compact>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell></Table.HeaderCell>
            <Table.HeaderCell>Corrected Results</Table.HeaderCell>
            <Table.HeaderCell>Chronological Results</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {apiResult[reference].height.length > 0 && (
            <Table.Row>
              <Table.HeaderCell></Table.HeaderCell>
              <Table.HeaderCell>Heights</Table.HeaderCell>
              <Table.HeaderCell></Table.HeaderCell>
            </Table.Row>
          )}
          {apiResult[reference].height.length > 0 &&
            apiResult[reference].height.map((measurement, index) => {
              return <TableBody measurement={measurement} key={index} />;
            })}
          {apiResult[reference].weight.length > 0 && (
            <Table.Row>
              <Table.HeaderCell></Table.HeaderCell>
              <Table.HeaderCell>Weights</Table.HeaderCell>
              <Table.HeaderCell></Table.HeaderCell>
            </Table.Row>
          )}
          {apiResult[reference].weight.length > 0 &&
            apiResult[reference].weight.map((measurement, index) => {
              return <TableBody key={index} measurement={measurement} />;
            })}
          {apiResult[reference].bmi.length > 0 && (
            <Table.Row>
              <Table.HeaderCell></Table.HeaderCell>
              <Table.HeaderCell>BMIs</Table.HeaderCell>
              <Table.HeaderCell></Table.HeaderCell>
            </Table.Row>
          )}
          {apiResult[reference].bmi.length > 0 &&
            apiResult.bmi.map((measurement, index) => {
              return <TableBody key={index} measurement={measurement} />;
            })}
          {apiResult[reference].ofc.length > 0 && (
            <Table.Row>
              <Table.HeaderCell></Table.HeaderCell>
              <Table.HeaderCell>Head Circumferences</Table.HeaderCell>
              <Table.HeaderCell></Table.HeaderCell>
            </Table.Row>
          )}
          {apiResult[reference].ofc.length > 0 &&
            apiResult[reference].ofc.map((measurement, index) => {
              return <TableBody key={index} measurement={measurement} />;
            })}
        </Table.Body>
      </Table>
    </Segment>
  );

  return (
    <React.Fragment>
      <Grid padded>
        <Grid.Row>
          <Grid.Column width={6}>
            <Grid.Row>
              <Segment raised>
                <MeasurementForm
                  measurementResult={handleResults}
                  handleChangeReference={changeReference}
                  handleChangeSex={changeSex}
                  measurementMethod={measurementMethod}
                  setMeasurementMethod={setMeasurementMethod}
                  className="measurement-form"
                />
              </Segment>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column width={5}>
                <Segment raised>
                  <Message>
                    <Flag name="gb" />
                    This calculator uses the UK-WHO references to calculate gold
                    standard accurate child growth parameters. In the future we
                    are planning to add other growth references such as
                    specialist Trisomy 21 and Turner's Syndrome references, CDC
                    and WHO.
                  </Message>

                  <Message color="red">
                    This site is under development. No responsibility is
                    accepted for the accuracy of results produced by this tool.
                  </Message>
                </Segment>
              </Grid.Column>
            </Grid.Row>
          </Grid.Column>
          <Grid.Column width={10}>
            <Segment raised>
              {flip ? (
                <ResultsSegment selectedMeasurement={measurementMethod} />
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
      <ErrorModal
        title={errorModal.title}
        body={errorModal.body}
        visible={errorModal.visible}
        handleClose={() => setErrorModal(InitalErrorModalState())}
      />
    </React.Fragment>
  );
}

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

const units = (measurementMethod) => {
  if (measurementMethod === 'height') {
    return 'cm';
  }
  if (measurementMethod === 'weight') {
    return 'kg';
  }
  if (measurementMethod === 'bmi') {
    return 'kg/m²';
  }
  if (measurementMethod === 'ofc') {
    return 'cm';
  }
};

const Acknowledgements = () => {
  // list={["Freeman JV, Cole TJ, Chinn S, Jones PRM, White EM, Preece MA. Cross sectional stature and weight reference curves for the UK, 1990. Arch Dis Child 1995; 73:17-24.", "<a href='www.who.int/childgrowth/en'>www.who.int/childgrowth/en</a>", "For further relevant references see fact sheet downloadable from www.growthcharts.RCPCH.ac.uk"]}
  return (
    <Message>
      <Message.Header>References</Message.Header>
      <List>
        <List.Item>
          Freeman JV, Cole TJ, Chinn S, Jones PRM, White EM, Preece MA. Cross
          sectional stature and weight reference curves for the UK, 1990. Arch
          Dis Child 1995; 73:17-24.
        </List.Item>
        <List.Item>
          <a href="www.who.int/childgrowth/en">www.who.int/childgrowth/en</a>
        </List.Item>
        <List.Item>
          For further relevant references see fact sheet downloadable from{' '}
          <a href="www.growthcharts.RCPCH.ac.uk">
            www.growthcharts.RCPCH.ac.uk
          </a>
        </List.Item>
      </List>
    </Message>
  );
};

const TableBody = (props) => {
  const measurement = props.measurement;
  return (
    <React.Fragment>
      <Table.Row>
        <Table.Cell>Ages</Table.Cell>
        <Table.Cell>
          {measurement.measurement_dates.chronological_calendar_age}
        </Table.Cell>
        <Table.Cell>
          {measurement.measurement_dates.corrected_calendar_age}
        </Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>Measurement</Table.Cell>
        <Table.Cell>
          {measurement.child_observation_value.observation_value}{' '}
          {units(measurement.child_observation_value.measurement_method)}
        </Table.Cell>
        <Table.Cell></Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>SDS</Table.Cell>
        <Table.Cell>
          {Math.round(
            measurement.measurement_calculated_values.corrected_sds * 1000
          ) / 1000}
        </Table.Cell>
        <Table.Cell>
          {Math.round(
            measurement.measurement_calculated_values.chronological_sds * 1000
          ) / 1000}
        </Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>Centiles</Table.Cell>
        <Table.Cell>
          {measurement.measurement_calculated_values.corrected_centile}
        </Table.Cell>
        <Table.Cell>
          {measurement.measurement_calculated_values.chronological_centile}
        </Table.Cell>
      </Table.Row>
    </React.Fragment>
  );
};

const ErrorModal = ({ title, body, handleClose, visible }) => {
  return (
    <Modal title={title} open={visible} size="small" closeOnEscape={true}>
      <Modal.Header>{title}</Modal.Header>
      <Modal.Content>{body}</Modal.Content>
      <Modal.Actions>
        <Button onClick={handleClose}>OK</Button>
      </Modal.Actions>
    </Modal>
  );
};

function InitalErrorModalState() {
  return {
    visible: false,
    title: '',
    body: '',
  };
}

export default MeasurementSegment;
