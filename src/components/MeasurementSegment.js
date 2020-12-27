// React
import React from "react";
import { Component } from "react";

// Semantic UI React
import { Grid, Segment, Message, Flag, Tab, Menu, Dropdown, Button, Table } from "semantic-ui-react";
import ChartData from '../api/Chart'
import MeasurementForm from "../components/MeasurementForm";
import '../index.css'

class MeasurementSegment extends Component {

      constructor(props){
        super(props)

        const dummyData=[{birth_data:{birth_date:"Wed, 28 Jan 2015 00:00:00 GMT",estimated_date_delivery:null,estimated_date_delivery_string:null,gestation_days:0,gestation_weeks:40,sex:"male"},child_observation_value:{measurement_method:"height",observation_value:110},measurement_calculated_values:{centile:13,centile_band:"This height measurement is between the 9th and 25th centiles.",measurement_method:"height",sds:-1.117076305831875},measurement_dates:{chronological_calendar_age:"5 years, 10 months and 4 weeks",chronological_decimal_age:5.9110198494182065,clinician_decimal_age_comment:"Born Term. No correction necessary.",corrected_calendar_age:null,corrected_decimal_age:5.9110198494182065,corrected_gestational_age:{corrected_gestation_days:null,corrected_gestation_weeks:null},lay_decimal_age_comment:"At 40+0, your child is considered to have been born at term. No age adjustment is necessary.",observation_date:"Sat, 26 Dec 2020 00:00:00 GMT"}}]

        this.state = {
          measurementMethod: "height",
          reference: "uk-who",
          sex: "male",
          chartBackground: "white",
          centilesColour: "black",
          measurementDataPointColour: "red",
          heights: [],
          weights: [],
          ofcs: [],
          bmis: [],
          activeIndex: 0, //set tab to height
          flip: false // flag to determine if results or chart showing
        }
        this.handleResults = this.handleResults.bind(this)
        this.handleRangeChange = this.handleRangeChange.bind(this)
        this.handleTabChange = this.handleTabChange.bind(this)
        this.handleChangeTheme = this.handleChangeTheme.bind(this)
        this.handleFlipResults = this.handleFlipResults.bind(this)
        this.returnMeasurementArray = this.returnMeasurementArray.bind(this)
      }
  
  handleRangeChange = (e) => this.setState({ activeIndex: e.target.value })
  handleTabChange = (e, { activeIndex }) => this.setState({ activeIndex })

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

    this.returnNewChart(measurementMethod, concatenated)

    /*
    return object structure
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

  }

  returnNewChart(measurementMethod, measurementsArray, centilesColour, chartBackground, measurementDataPointColour){
    
    const Chart = (
      <ChartData
            key={measurementMethod + "-" + this.state.reference}
            reference="uk-who" //the choices are ["uk-who", "turner", "trisomy21"] REQUIRED
            sex={'male'} //the choices are ["male", "female"] REQUIRED
            measurementMethod={measurementMethod} //the choices are ["height", "weight", "ofc", "bmi"] REQUIRED
            centileColour={centilesColour}
            width={700} 
            height={600}
            measurementsArray = {measurementsArray}  // an array of Measurement class objects from dGC Optional
            measurementsSDSArray = {[]} // an array of SDS measurements for SDS charts Optional: currently not implemented: pass []
            measurementDataPointColour = {measurementDataPointColour}
            chartBackground= {chartBackground}
            centilesColour={chartBackground}
      />
    )
    // this.setState({centilesColour: centilesColour})
    // this.setState({chartBackground: chartBackground})
    return Chart
  }

  handleChangeTheme(event, {value}){

    // girl 201 85 157 - #c9559d
    // boy 0 163 222 - #00a3de

    let centilesColour = ""
    let chartBackground = ""
    let measurementDataPointColour = ""
    
    if (value === 'trad'){
      if (this.state.sex === 'male'){
        // this.setState({ centilesColour: '#00a3de' }, { chartBackground: 'white'})
        centilesColour = '#00a3de' 
        chartBackground = 'white'
        measurementDataPointColour='red'
      } else {
        // this.setState({ centilesColour: '#c9559d' }, { chartBackground: 'white'})
        centilesColour = '#c9559d' 
        chartBackground = 'white'
      }
    }
    if (value === "colour"){
      if (this.state.sex === 'male'){
        // this.setState({ centilesColour: '#ff8000' }, { chartBackground: 'white'})
        centilesColour = '#ff8000' 
        chartBackground = 'white'
        measurementDataPointColour='red'
      } else {
        // this.setState({ centilesColour: '#ff8000' }, { chartBackground: 'white'})
        centilesColour = '#ff8000' 
        chartBackground = 'white'
      }
    }
    if (value === 'simple'){
      if (this.state.sex === 'male'){
        centilesColour = 'black'
        chartBackground = 'white'
        measurementDataPointColour='red'
      } else {
        centilesColour = 'black'
        chartBackground = 'white'
        measurementDataPointColour='red'
      }
    }

    this.returnNewChart(this.state.measurementMethod, this.state.measurementsArray, centilesColour, chartBackground, measurementDataPointColour)

    this.setState({centilesColour: centilesColour})
    this.setState({chartBackground: chartBackground})
    this.setState({measurementDataPointColour: measurementDataPointColour})

  }

  handleFlipResults(){
    const flipped = this.state.flip
    this.setState({flip: !flipped})
  }

  returnMeasurementArray(measurementMethod){
    
    switch (measurementMethod) {
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

    const panes = [
      { menuItem: "Height", 
        render: () => <Tab.Pane attached={"top"}>{
          this.returnNewChart("height", this.state.heights, this.state.centilesColour, this.state.chartBackground, this.state.measurementDataPointColour)
        }</Tab.Pane> },
      { menuItem: "Weight",
        render: () => <Tab.Pane attached={"top"}>
          {this.returnNewChart("weight", this.state.weights, this.state.centilesColour, this.state.chartBackground, this.state.measurementDataPointColour)}
          </Tab.Pane> },
      { menuItem: "BMI", render: () => <Tab.Pane attached={"top"}>{this.returnNewChart("bmi", this.state.bmis, this.state.centilesColour, this.state.chartBackground, this.state.measurementDataPointColour)}</Tab.Pane> },
      { menuItem: "Head Circumference", render: () => <Tab.Pane attached={"top"}>{this.returnNewChart("ofc", this.state.ofcs, this.state.centilesColour, this.state.chartBackground, this.state.measurementDataPointColour)}</Tab.Pane> },
    ];
  
    const TabPanes = () => <Tab menu={{ attached: 'top' }} panes={panes} activeIndex={activeIndex}
    onTabChange={this.handleTabChange}/>

    const themeOptions = [{ key: 'trad', value: 'trad', text: 'Traditional' },{ key: 'colour', value: 'colour', text: 'Energy' }, { key: 'simple', value: 'simple', text: 'Simple' }]

    const ThemeSelection = () => (
      <Menu compact className="selectUpperMargin">
        <Dropdown text='Theme' options={themeOptions} simple item onChange={this.handleChangeTheme}/>
      </Menu>
    )

    const HeightResultsSegment = () => (

          <Segment>
            <h5>Results</h5>
            <Table basic="very" celled collapsing compact>
              <Table.Header>
              <Table.Row>
                  <Table.HeaderCell>Heights</Table.HeaderCell>
                  <Table.HeaderCell>Results</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
            { this.state.heights.map((height, index) =>
            <React.Fragment key={index}>
              
                <Table.Row>
                  <Table.Cell>
                    Chronological Age
                  </Table.Cell>
                  <Table.Cell>
                    {height.measurement_dates.chronological_calendar_age}
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>
                    Decimal Age
                  </Table.Cell>
                  <Table.Cell>
                    {height.measurement_dates.corrected_decimal_age}
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>
                    SDS
                  </Table.Cell>
                  <Table.Cell>
                    {height.measurement_calculated_values.sds}
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>
                    Centile
                  </Table.Cell>
                  <Table.Cell>
                    {height.measurement_calculated_values.centile}
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>
                    Observation
                  </Table.Cell>
                  <Table.Cell>
                    {height.measurement_calculated_values.centile_band}
                  </Table.Cell>
                </Table.Row>
              
              </React.Fragment>)}
          </Table.Body>
            </Table>
          </Segment>)
    
    const ResultsSegment = (selectedMeasurement) => (
      <Segment>
        <h5>Results</h5>
        {this.returnMeasurementArray(selectedMeasurement).map(measurement => { 
          return <h5>{measurement.birth_data.sex}</h5>
        }
      )}
      </Segment>
    )

    const { activeIndex } = this.state
  
    return (
      
      <Grid centered stackable>
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
  
        <Grid.Column width={5}>
          <Segment raised>
            <MeasurementForm measurementResult={this.handleResults} className="measurement-form" />
          </Segment>
        </Grid.Column>
        <Grid.Column width={5}>
          <Segment raised>
          {this.state.flip ? <ResultsSegment selectedMeasurement={this.state.measurementMethod}/> : <TabPanes/>}
            <Grid.Row>
              <ThemeSelection />
              <Button floated="right" className="selectUpperMargin" onClick={this.handleFlipResults}>Results</Button>
            </Grid.Row>
          </Segment>
          
        </Grid.Column>
      </Grid>
    );

  }

  
}

export default MeasurementSegment;
