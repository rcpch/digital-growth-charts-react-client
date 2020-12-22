// React
import React from "react";
import { Component } from "react";

// Semantic UI React
import { Segment, Grid, Message, Flag, Tab, Menu, Dropdown } from "semantic-ui-react";
import ChartData from '../api/Chart'
import MeasurementForm from "../components/MeasurementForm";
import '../index.css'

class MeasurementSegment extends Component {

      constructor(props){
        super(props)
        this.state = {
          measurementMethod: "height",
          reference: "uk-who",
          sex: "male",
          chartBackground: "white",
          centilesColour: "black",
          heights: [],
          weights: [],
          ofcs: [],
          bmis: [],
          activeIndex: 0 //set tab to height
        }
        this.handleResults = this.handleResults.bind(this)
        this.handleRangeChange = this.handleRangeChange.bind(this)
        this.handleTabChange = this.handleTabChange.bind(this)
        this.handleChangeTheme = this.handleChangeTheme.bind(this)
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

  }

  returnNewChart(measurementMethod, measurementsArray, centilesColour, chartBackground){
    
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
            measurementDataPointColour = 'green'
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
    
    if (value === 'trad'){
      if (this.state.sex === 'male'){
        // this.setState({ centilesColour: '#00a3de' }, { chartBackground: 'white'})
        centilesColour = '#00a3de' 
        chartBackground = 'white'
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
      } else {
        centilesColour = 'black'
        chartBackground = 'white'
      }
    }

    this.returnNewChart(this.state.measurementMethod, this.state.measurementsArray, centilesColour, chartBackground)

    this.setState({centilesColour: centilesColour})
    this.setState({chartBackground: chartBackground})

  }



  render(){

    const panes = [
      { menuItem: "Height", 
        render: () => <Tab.Pane attached={"top"}>{
          this.returnNewChart("height", this.state.heights, this.state.centilesColour, this.state.chartBackground)
        }</Tab.Pane> },
      { menuItem: "Weight",
        render: () => <Tab.Pane attached={"top"}>
          {this.returnNewChart("weight", this.state.weights, this.state.centilesColour, this.state.chartBackground)}
          </Tab.Pane> },
      { menuItem: "BMI", render: () => <Tab.Pane attached={"top"}>{this.returnNewChart("bmi", this.state.bmis, this.state.centilesColour, this.state.chartBackground)}</Tab.Pane> },
      { menuItem: "Head Circumference", render: () => <Tab.Pane attached={"top"}>{this.returnNewChart("ofc", this.state.ofcs, this.state.centilesColour, this.state.chartBackground)}</Tab.Pane> },
    ];
  
    const TabPanes = () => <Tab menu={{ attached: 'top' }} panes={panes} activeIndex={activeIndex}
    onTabChange={this.handleTabChange}/>

    const themeOptions = [{ key: 'trad', value: 'trad', text: 'Traditional' },{ key: 'colour', value: 'colour', text: 'Energy' }, { key: 'simple', value: 'simple', text: 'Simple' }]

    const ThemeSelection = () => (
      <Menu compact className="selectUpperMargin">
        <Dropdown text='Theme' options={themeOptions} simple item onChange={this.handleChangeTheme}/>
      </Menu>
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
            <TabPanes/>
            <div>
              <ThemeSelection />
            </div>
          </Segment>
          
        </Grid.Column>
      </Grid>
    );

  }

  
}

export default MeasurementSegment;
