// React
import React from "react";
import { Component } from "react";

// Semantic UI React
import { Segment, Grid, Message, Flag, Tab } from "semantic-ui-react";
import ChartData from '../api/Chart'

// RCPCH Components
// import RCPCHChartComponent from "digital-growth-charts-react-chart-library";
import MeasurementForm from "../components/MeasurementForm";

class MeasurementSegment extends Component {

      constructor(props){
        super(props)
        this.state = {
          measurementMethod: "height",
          reference: "uk-who",
          sex: "male",
          heights: [],
          weights: [],
          ofcs: [],
          bmis: [],
          activeIndex: 0 //set tab to height
        }
        this.handleResults = this.handleResults.bind(this)
        this.handleRangeChange = this.handleRangeChange.bind(this)
        this.handleTabChange = this.handleTabChange.bind(this)
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

  returnNewChart(measurementMethod, measurementsArray){
    const Chart = (
      <ChartData
            key={measurementMethod + "-" + this.state.reference}
            reference="uk-who" //the choices are ["uk-who", "turner", "trisomy21"] REQUIRED
            sex={'male'} //the choices are ["male", "female"] REQUIRED
            measurementMethod={measurementMethod} //the choices are ["height", "weight", "ofc", "bmi"] REQUIRED
            centileColour="black"
            width={700} 
            height={600}
            measurementsArray = {measurementsArray}  // an array of Measurement class objects from dGC Optional
            measurementsSDSArray = {[]} // an array of SDS measurements for SDS charts Optional: currently not implemented: pass []
            measurementDataPointColour = 'green'
            chartBackground= 'white'
      />
    )
    return Chart
  }

  render(){

    const panes = [
      { menuItem: "height", 
        render: () => <Tab.Pane attached={"top"}>Height{
          this.returnNewChart("height", this.state.heights)
        }</Tab.Pane> },
      { menuItem: "weight",
        render: () => <Tab.Pane attached={"top"}>
          Weight
          {this.returnNewChart("weight", this.state.weights)}
          </Tab.Pane> },
      { menuItem: "bmi", render: () => <Tab.Pane attached={"top"}>BMI {this.returnNewChart("bmi", this.state.bmis)}</Tab.Pane> },
      { menuItem: "ofc", render: () => <Tab.Pane attached={"top"}>OFC {this.returnNewChart("ofc", this.state.ofcs)}</Tab.Pane> },
    ];
  
    const TabPanes = () => <Tab menu={{ attached: 'top' }} panes={panes} activeIndex={activeIndex}
    onTabChange={this.handleTabChange}/>

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
          </Segment>
        </Grid.Column>
      </Grid>
    );

  }

  
}

export default MeasurementSegment;
