// React
import React from "react";
import { Component } from "react";
import RCPCHTheme1 from "../components/chartThemes/rcpchTheme1";
import RCPCHTheme2 from "../components/chartThemes/rcpchTheme2";
import RCPCHTheme3 from "../components/chartThemes/rcpchTheme3";
import RCPCHThemeMonochrome from "../components/chartThemes/rcpchThemeMonochrome";
import RCPCHThemeTraditionalBoy from '../components/chartThemes/RCPCHThemeTraditionalBoy'
import RCPCHThemeTraditionalGirl from '../components/chartThemes/RCPCHThemeTraditionalGirl'

// Semantic UI React
import { Grid, Segment, Message, Flag, Tab, Menu, Dropdown, Button, Table, List } from "semantic-ui-react";
import ChartData from '../api/Chart'
import MeasurementForm from "../components/MeasurementForm";
import '../index.css'

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

class MeasurementSegment extends Component {

      constructor(props){
        super(props)

        // const dummyData=[{birth_data:{birth_date:"Wed, 28 Jan 2015 00:00:00 GMT",estimated_date_delivery:null,estimated_date_delivery_string:null,gestation_days:0,gestation_weeks:40,sex:"male"},child_observation_value:{measurement_method:"height",observation_value:110},measurement_calculated_values:{centile:13,centile_band:"This height measurement is between the 9th and 25th centiles.",measurement_method:"height",sds:-1.117076305831875},measurement_dates:{chronological_calendar_age:"5 years, 10 months and 4 weeks",chronological_decimal_age:5.9110198494182065,clinician_decimal_age_comment:"Born Term. No correction necessary.",corrected_calendar_age:null,corrected_decimal_age:5.9110198494182065,corrected_gestational_age:{corrected_gestation_days:null,corrected_gestation_weeks:null},lay_decimal_age_comment:"At 40+0, your child is considered to have been born at term. No age adjustment is necessary.",observation_date:"Sat, 26 Dec 2020 00:00:00 GMT"}}]
        const defaultTheme = RCPCHThemeMonochrome;
        
        this.state = {
          measurementMethod: "height",
          reference: "uk-who",
          sex: "male",
          chartStyle: defaultTheme.chart,
          axisStyle: defaultTheme.axes,
          centileStyle: defaultTheme.centiles,
          gridlineStyle: defaultTheme.gridlines,
          measurementStyle: defaultTheme.measurements,
          heights: [],
          weights: [],
          ofcs: [],
          bmis: [],
          theme: 'tanner4',
          activeIndex: 0, //set tab to height
          flip: false, // flag to determine if results or chart showing
          heightDisabled: false,
          weightDisabled: false,
          bmiDisabled: false,
          ofcDisabled: false
        }

        this.handleResults = this.handleResults.bind(this)
        this.handleRangeChange = this.handleRangeChange.bind(this)
        this.handleTabChange = this.handleTabChange.bind(this)
        this.handleChangeTheme = this.handleChangeTheme.bind(this)
        this.handleFlipResults = this.handleFlipResults.bind(this)
        this.returnMeasurementArray = this.returnMeasurementArray.bind(this)
        this.units = this.units.bind(this)
        this.changeReference = this.changeReference.bind(this)
        this.changeSex = this.changeSex.bind(this)
        this.changeMeasurement= this.changeMeasurement.bind(this)
      }
  
  handleRangeChange = (e) => this.setState({ activeIndex: e.target.value })
  handleTabChange = (e, { activeIndex }) => this.setState({ activeIndex })

  changeReference(reference){
    // call back from MeasurementForm
    this.setState({reference: reference})
    if (reference==="turner"){
      this.setState({measurementMethod:"height"})
      this.setState({sex: "female"})
      this.setState({heightDisabled: false})
      this.setState({weightDisabled: true})
      this.setState({bmiDisabled: true})
      this.setState({ofcDisabled: true})
    }
    if (reference==="trisomy-21"){
      this.setState({heightDisabled: false})
      this.setState({weightDisabled: false})
      this.setState({bmiDisabled: false})
      this.setState({ofcDisabled: true})
    }
    if (reference==="uk-who"){
      this.setState({heightDisabled: false})
      this.setState({weightDisabled: false})
      this.setState({bmiDisabled: false})
      this.setState({ofcDisabled: false})
    }
    this.returnNewChart(
      this.state.measurementMethod,
      [],
      this.state.chartStyle,
      this.state.axisStyle,
      this.state.gridlineStyle,
      this.state.centileStyle,
      this.state.measurementStyle
    )
  }

  changeSex(sex){
     // call back from MeasurementForm
     this.setState({sex: sex})
     this.returnNewChart(
       this.state.measurementMethod,
       [],
       this.state.chartStyle,
       this.state.axisStyle,
       this.state.gridlineStyle,
       this.state.centileStyle,
       this.state.measurementStyle
     )
  }

  changeMeasurement(measurementMethod){
    // call back from MeasurementForm
    switch (measurementMethod){
      case ('height'):
        this.setState({activeIndex: 0}) // move focus to height tab
        break
      case ('weight'):
        this.setState({activeIndex: 1}) // move focus to weight tab
        break
      case ('bmi'):
        this.setState({activeIndex: 2}) // move focus to bmi tab
        break
      case ('ofc'):
        this.setState({activeIndex: 3}) // move focus to ofc tab
        break
      default:
        return
    }
    this.returnNewChart(
      measurementMethod,
      [],
      this.state.chartStyle,
      this.state.axisStyle,
      this.state.gridlineStyle,
      this.state.centileStyle,
      this.state.measurementStyle
      )
      this.setState({measurementMethod: measurementMethod})
  }

  handleResults(results){
    // delegate function from MeasurementForm
    // receives measurement results and passes them back to API
    // to receive plottable child
    
    const measurementMethod = results[0].child_observation_value.measurement_method
    const sex = results[0].birth_data.sex
    this.setState({measurementMethod: measurementMethod})
    this.setState({sex: sex})
    
    let measurementsArray = []
    let concatenated = []
    
    switch (measurementMethod){
      case ('height'):
        measurementsArray = this.state.heights
        concatenated = measurementsArray.concat(results)
        this.setState({heights: concatenated})
        this.setState({activeIndex: 0}) // move focus to height tab
        break
      case ('weight'):
        measurementsArray = this.state.weights
        concatenated = measurementsArray.concat(results)
        this.setState({weights: concatenated})
        this.setState({activeIndex: 1}) // move focus to weight tab
        break
      case ('bmi'):
        measurementsArray = this.state.bmis
        concatenated = measurementsArray.concat(results)
        this.setState({bmis: concatenated})
        this.setState({activeIndex: 2}) // move focus to bmi tab
        break
      case ('ofc'):
        measurementsArray = this.state.ofcs
        concatenated = measurementsArray.concat(results)
        this.setState({bmis: concatenated})
        this.setState({activeIndex: 3}) // move focus to ofc tab
        break
      default:
        concatenated = []
    }

    this.returnNewChart(
      measurementMethod, concatenated, 
      this.state.chartStyle, 
      this.state.axisStyle, 
      this.state.gridlineStyle, 
      this.state.centileStyle, 
      this.state.measurementStyle)

  }

  returnNewChart(
    measurementMethod, 
    measurementsArray, 
    chartStyle, 
    axisStyle, 
    gridlineStyle, 
    centileStyle, 
    measurementStyle){
      
      const Chart = (
        <ChartData
              key={measurementMethod + "-" + this.state.reference}
              reference={this.state.reference} //the choices are ["uk-who", "turner", "trisomy-21"] REQUIRED
              sex={this.state.sex} //the choices are ["male", "female"] REQUIRED
              measurementMethod={measurementMethod} //the choices are ["height", "weight", "ofc", "bmi"] REQUIRED
              measurementsArray = {measurementsArray}  // an array of Measurement class objects from dGC Optional
              // measurementsSDSArray = {[]} // an array of SDS measurements for SDS charts Optional: currently not implemented: pass []
              chartStyle={chartStyle}
              axisStyle={axisStyle}
              gridlineStyle={gridlineStyle}
              centileStyle={centileStyle}
              measurementStyle={measurementStyle}
        />
      )
      return Chart
  }

  handleChangeTheme(event, {value}){

    let selectedTheme;
    
    if (value === 'trad'){  
      if (this.state.sex === 'male'){
        selectedTheme = RCPCHThemeTraditionalBoy
      } else {
        selectedTheme = RCPCHThemeTraditionalGirl
      }
    }
    if (value === "tanner1"){
      selectedTheme=RCPCHTheme1
    }
    if (value === 'tanner2'){
     selectedTheme=RCPCHTheme2
    }
    if (value==="tanner3"){
      selectedTheme=RCPCHTheme3
    }
    if (value==="monochrome"){
      selectedTheme=RCPCHThemeMonochrome
    }

    this.returnNewChart(
      this.state.measurementMethod, 
      this.state.measurementsArray, 
      selectedTheme.chart, 
      selectedTheme.axes,
      selectedTheme.gridlines, 
      selectedTheme.centiles,
      selectedTheme.measurements)

    this.setState({centileStyle: selectedTheme.centiles})
    this.setState({chartStyle: selectedTheme.chart})
    this.setState({measurementStyle: selectedTheme.measurements})
    this.setState({axisStyle: selectedTheme.axes})
    this.setState({theme: value})

  }

  handleFlipResults(){
    const flipped = this.state.flip
    this.setState({flip: !flipped})
  }

  units(measurementMethod){
    if (measurementMethod === "height"){
      return "cm"
    }
    if (measurementMethod === "weight"){
      return "kg"
    }
    if (measurementMethod === "bmi"){
      return "kg/m²"
    }
    if (measurementMethod === "ofc"){
      return "cm"
    }
    
  }

  returnMeasurementArray(measurementMethod){
    switch (measurementMethod.selectedMeasurement) {
      case "height":
        return this.state.heights
      case "weight":
        return  this.state.weights
      case "bmi":
        return  this.state.bmis
      case "ofc":
        return  this.state.ofcs
      default:
        return
    }
  }

  render(){

    const Acknowledgements = ()=> {
      // list={["Freeman JV, Cole TJ, Chinn S, Jones PRM, White EM, Preece MA. Cross sectional stature and weight reference curves for the UK, 1990. Arch Dis Child 1995; 73:17-24.", "<a href='www.who.int/childgrowth/en'>www.who.int/childgrowth/en</a>", "For further relevant references see fact sheet downloadable from www.growthcharts.RCPCH.ac.uk"]}
          return (
              <Message>
                <Message.Header>
                References
                </Message.Header>
                <List>
                  <List.Item>Freeman JV, Cole TJ, Chinn S, Jones PRM, White EM, Preece MA. Cross sectional stature and weight reference curves for the UK, 1990. Arch Dis Child 1995; 73:17-24.</List.Item>
                  <List.Item><a href='www.who.int/childgrowth/en'>www.who.int/childgrowth/en</a></List.Item>
                  <List.Item>For further relevant references see fact sheet downloadable from <a href="www.growthcharts.RCPCH.ac.uk">www.growthcharts.RCPCH.ac.uk</a></List.Item>
                </List>
              </Message>
          )
    }

    const panes = [
      { menuItem: "Height", 
        render: () => <Tab.Pane attached={"top"} disabled={this.state.heightDisabled}>{
          this.returnNewChart(
            "height", 
            this.state.heights, 
            this.state.chartStyle, 
            this.state.axisStyle,
            this.state.gridlineStyle,
            this.state.centileStyle,
            this.state.measurementStyle
            )
        }<Acknowledgements /></Tab.Pane> },
      { menuItem: "Weight",
        render: () => <Tab.Pane attached={"top"} disabled={this.state.weightDisabled}>{
          this.returnNewChart(
            "weight", 
            this.state.weights,
            this.state.chartStyle, 
            this.state.axisStyle,
            this.state.gridlineStyle,
            this.state.centileStyle,
            this.state.measurementStyle
            )}<Acknowledgements />
          </Tab.Pane> },
      { menuItem: "BMI", 
        render: () => <Tab.Pane attached={"top"} disabled={this.state.bmiDisabled}>
        {this.returnNewChart(
            "bmi", 
            this.state.bmis,
            this.state.chartStyle, 
            this.state.axisStyle,
            this.state.gridlineStyle,
            this.state.centileStyle,
            this.state.measurementStyle
        )}<Acknowledgements />
        </Tab.Pane> },
      { menuItem: "Head Circumference", render: () => <Tab.Pane attached={"top"} disabled={this.state.ofcDisabled}>
        {this.returnNewChart(
          "ofc", 
          this.state.ofcs, 
          this.state.chartStyle, 
          this.state.axisStyle,
          this.state.gridlineStyle,
          this.state.centileStyle,
          this.state.measurementStyle
        )}<Acknowledgements />
        </Tab.Pane> },
    ];
  
    const TabPanes = () => <Tab menu={{ attached: 'top' }} panes={panes} activeIndex={activeIndex}
    onTabChange={this.handleTabChange}/>

    const themeOptions = [{ key: 'trad', value: 'trad', text: 'Traditional' },{ key: 'tanner1', value: 'tanner1', text: 'Tanner 1' }, { key: 'tanner2', value: 'tanner2', text: 'Tanner 2' }, { key: 'tanner3', value: 'tanner3', text: 'Tanner 3' }, { key: 'monochrome', value: 'monochrome', text: 'Monochrome' }]

    const ThemeSelection = () => (
      <Menu compact className="selectUpperMargin">
        <Dropdown text='Theme' options={themeOptions} simple item onChange={this.handleChangeTheme}/>
      </Menu>
    )
    
    const ResultsSegment = (selectedMeasurement) => (
      <Segment>
          <Table basic="very" celled collapsing compact>
              <Table.Header>
              <Table.Row>
                  <Table.HeaderCell>Heights</Table.HeaderCell>
                  <Table.HeaderCell>Results</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
          { this.returnMeasurementArray(selectedMeasurement).map((measurement,index) => { 
            return (<Table.Body key={index}>
              
                <Table.Row>
                  <Table.Cell>
                    Chronological Age
                  </Table.Cell>
                  <Table.Cell>
                    {measurement.measurement_dates.chronological_calendar_age}
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>
                    Measurement
                  </Table.Cell>
                  <Table.Cell>
                    {measurement.child_observation_value.observation_value} {this.units(measurement.child_observation_value.measurement_method)}
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>
                    SDS
                  </Table.Cell>
                  <Table.Cell>
                    {Math.round(measurement.measurement_calculated_values.sds*1000)/1000}
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>
                    Centile
                  </Table.Cell>
                  <Table.Cell>
                    {measurement.measurement_calculated_values.centile}
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>
                    Observation
                  </Table.Cell>
                  <Table.Cell>
                    {measurement.measurement_calculated_values.centile_band}
                  </Table.Cell>
                </Table.Row>
              
                </Table.Body>)})}
              </Table>
            </Segment>
    )

    const { activeIndex } = this.state
  
    return (
        <Grid padded>
          <Grid.Row>
          <Grid.Column width={6}>
            <Grid.Row>
              <Segment raised>
                <MeasurementForm 
                  measurementResult={this.handleResults} 
                  handleChangeReference={this.changeReference}
                  handleChangeSex={this.changeSex}
                  handleChangeMeasurementMethod={this.changeMeasurement}
                  className="measurement-form" />
              </Segment>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column width={5}>
                <Segment raised>
                  <Message>
                    <Flag name="gb" />
                    This calculator uses the UK-WHO references to calculate gold
                    standard accurate child growth parameters. In the future we are
                    planning to add other growth references such as specialist Trisomy
                    21 and Turner's Syndrome references, CDC and WHO.
                  </Message>
        
                  <Message color="red">
                    This site is under development. No responsibility is accepted for
                    the accuracy of results produced by this tool.
                  </Message>
                </Segment>
              </Grid.Column>
            </Grid.Row>
          </Grid.Column>
          <Grid.Column width={10}>
            <Segment raised>
            {this.state.flip ? <ResultsSegment selectedMeasurement={this.state.measurementMethod}/> : <TabPanes/>}
              <Grid.Row>
                  <ThemeSelection />
                  <Button floated="right" className="selectUpperMargin" onClick={this.handleFlipResults}>Results</Button>
              </Grid.Row>
            </Segment>
          </Grid.Column>
          </Grid.Row>
        </Grid>
    );

  }

  
}

export default MeasurementSegment;
