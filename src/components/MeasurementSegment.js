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
} from 'semantic-ui-react';
import ChartData from '../api/Chart';
import MeasurementForm from '../components/MeasurementForm';
import '../index.css';

import axios from 'axios';

/*
    return object structure from API
    [
      {
        birth_data: {
          birth_date: ...,
          estimated_date_delivery: ....,
          estimated_date_delivery_string: ...,
          gestation_weeks: ...,
          gestation_days: ...,
          sex: ...
        },
        child_observation_value: {
          measurement_method: ....,
          measurement_value: ...
        },
        child_measurement_dates: {
          chronological_calendar_age: ...,
          chronological_decimal_age: ...,
          clinician_decimal_age_comment: ...,
          corrected_calendar_age: ...,
          corrected_decimal_age: ...,
          corrected_gestational_age: {
            corrected_gestation_weeks: ...,
            corrected_gestatin_days: ...
          },
          lay_decimal_age_comment: ...,
          observation_date: ...
        },
        measurement_calculated_values: {
          centile: ...,
          measurement_method: ...,
          sds: ...,
          centile_band: ...
        }
      }
    ]
    */

function MeasurementSegment() {
  // const dummyData=[{birth_data:{birth_date:"Wed, 28 Jan 2015 00:00:00 GMT",estimated_date_delivery:null,estimated_date_delivery_string:null,gestation_days:0,gestation_weeks:40,sex:"male"},child_observation_value:{measurement_method:"height",observation_value:110},measurement_calculated_values:{centile:13,centile_band:"This height measurement is between the 9th and 25th centiles.",measurement_method:"height",sds:-1.117076305831875},measurement_dates:{chronological_calendar_age:"5 years, 10 months and 4 weeks",chronological_decimal_age:5.9110198494182065,clinician_decimal_age_comment:"Born Term. No correction necessary.",corrected_calendar_age:null,corrected_decimal_age:5.9110198494182065,corrected_gestational_age:{corrected_gestation_days:null,corrected_gestation_weeks:null},lay_decimal_age_comment:"At 40+0, your child is considered to have been born at term. No age adjustment is necessary.",observation_date:"Sat, 26 Dec 2020 00:00:00 GMT"}}]
  const defaultTheme = RCPCHThemeMonochrome;

  const hs = [
    {
      birth_date: '2020-04-12',
      observation_date: '2020-06-12',
      observation_value: 60,
      sex: 'male',
      gestation_weeks: 40,
      gestation_days: 0,
      measurement_method: 'height',
    },
    {
      birth_date: '2020-04-12',
      observation_date: '2020-09-12',
      observation_value: 62,
      sex: 'male',
      gestation_weeks: 40,
      gestation_days: 0,
      measurement_method: 'height',
    },
  ];

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
  // let heights = [];
  // let weights = [];
  // let ofcs = [];
  // let bmis = [];
  const [theme, setTheme] = useState({
    value: 'tanner4',
    text: 'Monochrome',
  });
  const [activeIndex, setActiveIndex] = useState(0); //set tab to height
  const [flip, setFlip] = useState(false); // flag to determine if results or chart showing
  const [heightDisabled, setHeightDisabled] = useState(false);
  const [weightDisabled, setWeightDisabled] = useState(false);
  const [bmiDisabled, setBMIDisabled] = useState(false);
  const [ofcDisabled, setOFCDisabled] = useState(false);
  const [apiResult, setAPIResult] = useState({ val: 1, result: [] });
  const [hasRun, setHasRun] = useState(false);

  const [currentMeasurements, setCurrentMeasurements] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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

    let ignore = false; // this prevents data being added to state if unmounted

    if (isLoading) {
      if (currentMeasurements.length > 0) {
        fetchCentilesForMeasurement(currentMeasurements).then((final) => {
          if (final.length > 0 && apiResult.val === 1 && !ignore) {
            // const plottable = [
            //   [
            //     {
            //       age_type: 'corrected_age',
            //       calendar_age:
            //         final[0].measurement_dates.corrected_calendar_age,
            //       centile_band:
            //         final[0].measurement_calculated_values
            //           .corrected_centile_band,
            //       centile_value:
            //         final[0].measurement_calculated_values.corrected_centile,
            //       corrected_gestation_days:
            //         final[0].measurement_dates.corrected_gestational_age
            //           .corrected_gestation_days,
            //       corrected_gestation_weeks:
            //         final[0].measurement_dates.corrected_gestational_age
            //           .corrected_gestation_weeks,
            //       measurement_method:
            //         final[0].child_observation_value.measurement_method,
            //       x:
            //         final[0].plottable_data.centile_data
            //           .corrected_decimal_age_data.x,
            //       y:
            //         final[0].plottable_data.centile_data
            //           .corrected_decimal_age_data.y,
            //     },
            //     {
            //       age_type: 'chronological_age',
            //       calendar_age:
            //         final[0].measurement_dates.chronological_calendar_age,
            //       centile_band:
            //         final[0].measurement_calculated_values
            //           .chronological_centile_band,
            //       centile_value:
            //         final[0].measurement_calculated_values
            //           .chronological_centile_value,
            //       corrected_gestation_days:
            //         final[0].measurement_dates.corrected_gestational_age
            //           .corrected_gestation_days,
            //       corrected_gestation_weeks:
            //         final[0].measurement_dates.corrected_gestational_age
            //           .corrected_gestation_weeks,
            //       measurement_method:
            //         final[0].child_observation_value.measurement_method,
            //       x:
            //         final[0].plottable_data.centile_data
            //           .chronological_decimal_age_data.x,
            //       y:
            //         final[0].plottable_data.centile_data
            //           .chronological_decimal_age_data.y,
            //     },
            //   ],
            // ];
            const orderedFinal = final.sort((a,b)=> a.measurement_dates.corrected_decimal_age < b.measurement_dates.corrected_decimal_age ? 1 : -1)
            setAPIResult((prevState) => ({
              ...prevState,
              result: orderedFinal,
            }));
            setIsLoading(false);
          }
        });
      } else {
        return;
      }
    }

    return () => {
      // this prevents data being added to state if unmounted
      ignore = true;
    };
  }, [isLoading, measurementMethod, reference, apiResult, currentMeasurements]);

  const handleTabChange = (e, { activeIndex }) => setActiveIndex(activeIndex);

  const changeReference = (reference) => {
    // call back from MeasurementForm
    setReference(reference);
    if (reference === 'turner') {
      setMeasurementMethod('height');
      setSex('female');
      setHeightDisabled(false);
      setWeightDisabled(true);
      setBMIDisabled(true);
      setOFCDisabled(true);
    }
    if (reference === 'trisomy-21') {
      setHeightDisabled(false);
      setWeightDisabled(false);
      setBMIDisabled(false);
      setOFCDisabled(true);
    }
    if (reference === 'uk-who') {
      setHeightDisabled(false);
      setWeightDisabled(false);
      setBMIDisabled(false);
      setOFCDisabled(false);
    }
  };

  const changeSex = (sex) => {
    // call back from MeasurementForm
    setSex(sex);
    let selectedTheme;
    if (reference === 'uk-who') {
      if (sex === 'male') {
        selectedTheme = RCPCHThemeTraditionalBoy;
      } else {
        selectedTheme = RCPCHThemeTraditionalGirl;
      }
      setCentileStyle(selectedTheme.centiles);
      setChartSyle(selectedTheme.chart);
      setMeasurementStyle(selectedTheme.measurements);
      setAxisStyle(selectedTheme.axes);
      setTheme({ value: 'tanner1', text: 'Tanner 1' });
    }
  };

  const changeMeasurement = (measurementMethod) => {
    // call back from MeasurementForm
    switch (measurementMethod) {
      case 'height':
        setActiveIndex(0); // move focus to height tab
        break;
      case 'weight':
        setActiveIndex(1); // move focus to weight tab
        break;
      case 'bmi':
        setActiveIndex(2); // move focus to bmi tab
        break;
      case 'ofc':
        setActiveIndex(3); // move focus to ofc tab
        break;
      default:
        return;
    }
    setMeasurementMethod(measurementMethod);
  };

  const handleResults = (results) => {
    // delegate function from MeasurementForm
    // receives form data and stores in the correct measurement array
    // this will trigger a rerender

    let measurementsArray = [];
    const concatenated = measurementsArray.concat(results);
    setIsLoading(true);
    setCurrentMeasurements(concatenated);
    switch (measurementMethod) {
      case 'height':
        setActiveIndex(0); // move focus to height tab
        break;
      case 'weight':
        setActiveIndex(1); // move focus to weight tab
        break;
      case 'bmi':
        setActiveIndex(2); // move focus to bmi tab
        break;
      case 'ofc':
        setActiveIndex(3); // move focus to ofc tab
        break;
      default:
      //
    }
  };

  const returnNewChart = (
    newSex,
    newMeasurementMethod,
    newMeasurementsArray,
    newChartStyle,
    newAxisStyle,
    newGridlineStyle,
    newCentileStyle,
    newMeasurementStyle
  ) => {
    const Chart = (
      <ChartData
        key={newMeasurementMethod + '-' + reference}
        reference={reference} //the choices are ["uk-who", "turner", "trisomy-21"] REQUIRED
        sex={newSex} //the choices are ["male", "female"] REQUIRED
        measurementMethod={newMeasurementMethod} //the choices are ["height", "weight", "ofc", "bmi"] REQUIRED
        apiResult={newMeasurementsArray} // an array of Measurement class objects from dGC Optional
        // setAPIResult={setAPIResult}
        // measurementsSDSArray = {[]} // an array of SDS measurements for SDS charts Optional: currently not implemented: pass []
        chartStyle={newChartStyle}
        axisStyle={newAxisStyle}
        gridlineStyle={newGridlineStyle}
        centileStyle={newCentileStyle}
        measurementStyle={newMeasurementStyle}
      />
    );
    return Chart;
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

    // this.returnNewChart(
    //   sex,
    //   measurementMethod,
    //   measurementsArray,
    //   selectedTheme.chart,
    //   selectedTheme.axes,
    //   selectedTheme.gridlines,
    //   selectedTheme.centiles,
    //   selectedTheme.measurements)

    setCentileStyle(selectedTheme.centiles);
    setChartSyle(selectedTheme.chart);
    setMeasurementStyle(selectedTheme.measurements);
    setAxisStyle(selectedTheme.axes);
    setTheme({ value: value, text: text });
  };

  const handleFlipResults = () => {
    const flipped = this.state.flip;
    this.setState({ flip: !flipped });
  };

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

  const panes = [
    {
      menuItem: 'Height',
      render: () => (
        <Tab.Pane attached={'top'} disabled={heightDisabled}>
          {returnNewChart(
            sex,
            'height',
            apiResult.result,
            chartStyle,
            axisStyle,
            gridlineStyle,
            centileStyle,
            measurementStyle
          )}
          <Acknowledgements />
        </Tab.Pane>
      ),
    },
    {
      menuItem: 'Weight',
      render: () => (
        <Tab.Pane attached={'top'} disabled={weightDisabled}>
          {returnNewChart(
            sex,
            'weight',
            apiResult,
            chartStyle,
            axisStyle,
            gridlineStyle,
            centileStyle,
            measurementStyle
          )}
          <Acknowledgements />
        </Tab.Pane>
      ),
    },
    {
      menuItem: 'BMI',
      render: () => (
        <Tab.Pane attached={'top'} disabled={bmiDisabled}>
          {returnNewChart(
            sex,
            'bmi',
            apiResult,
            chartStyle,
            axisStyle,
            gridlineStyle,
            centileStyle,
            measurementStyle
          )}
          <Acknowledgements />
        </Tab.Pane>
      ),
    },
    {
      menuItem: 'Head Circumference',
      render: () => (
        <Tab.Pane attached={'top'} disabled={ofcDisabled}>
          {returnNewChart(
            sex,
            'ofc',
            apiResult,
            chartStyle,
            axisStyle,
            gridlineStyle,
            centileStyle,
            measurementStyle
          )}
          <Acknowledgements />
        </Tab.Pane>
      ),
    },
  ];

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
            <Table.HeaderCell>Heights</Table.HeaderCell>
            <Table.HeaderCell>Results</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        {currentMeasurements.map((measurement, index) => {
          return (
            <Table.Body key={index}>
              <Table.Row>
                <Table.Cell>Chronological Age</Table.Cell>
                <Table.Cell>
                  {measurement.measurement_dates.chronological_calendar_age}
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Measurement</Table.Cell>
                <Table.Cell>
                  {measurement.child_observation_value.observation_value}{' '}
                  {units(
                    measurement.child_observation_value.measurement_method
                  )}
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Corrected SDS</Table.Cell>
                <Table.Cell>
                  {Math.round(
                    measurement.measurement_calculated_values.corrected_sds *
                      1000
                  ) / 1000}
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Corrected Centile</Table.Cell>
                <Table.Cell>
                  {measurement.measurement_calculated_values.corrected_centile}
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Observation</Table.Cell>
                <Table.Cell>
                  {measurement.measurement_calculated_values.centile_band}
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          );
        })}
      </Table>
    </Segment>
  );

  return (
    <Grid padded>
      <Grid.Row>
        <Grid.Column width={6}>
          <Grid.Row>
            <Segment raised>
              <MeasurementForm
                measurementResult={handleResults}
                handleChangeReference={changeReference}
                handleChangeSex={changeSex}
                handleChangeMeasurementMethod={changeMeasurement}
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
                  are planning to add other growth references such as specialist
                  Trisomy 21 and Turner's Syndrome references, CDC and WHO.
                </Message>

                <Message color="red">
                  This site is under development. No responsibility is accepted
                  for the accuracy of results produced by this tool.
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
  );
}

export default MeasurementSegment;