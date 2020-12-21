// React
import React, { useState } from "react";
import { Component } from "react";

// Semantic UI React
import { Segment, Grid, Message, Flag, Tab, Menu } from "semantic-ui-react";
import ChartData from '../api/Chart'

// RCPCH Components
// import RCPCHChartComponent from "digital-growth-charts-react-chart-library";
import MeasurementForm from "../components/MeasurementForm";

class MeasurementSegment extends Component {

      constructor(props){
        super(props)
        const chart = <ChartData
          reference={'uk-who'} //the choices are ["uk-who", "turner", "trisomy21"] REQUIRED
          sex={"male"} //the choices are ["male", "female"] REQUIRED
          measurementMethod={"height"} //the choices are ["height", "weight", "ofc", "bmi"] REQUIRED
          centileColour="black"
          width={700} 
          height={600}
          measurementsArray = {[]}  // an array of Measurement class objects from dGC API REQUIRED
          measurementsSDSArray = {[]} // an array of SDS measurements for SDS charts REQUIRED: currently not implemented: pass []
          measurementDataPointColour = 'green'
        />
        this.state = ({measurement: "height"})
      }


  handleResults=(results)=>{
    // delegate function from MeasurementForm
    // receives measurement results and passes them back to API
    // to receive plottable child
    
    const measurementMethod = results[0].child_observation_value.measurement_method
    const reference = "uk-who"
    const sex = results[0].birth_data.sex

    const Chart = (
          <ChartData
                key={measurementMethod + "results"}
                reference={reference} //the choices are ["uk-who", "turner", "trisomy21"] REQUIRED
                sex={sex} //the choices are ["male", "female"] REQUIRED
                measurementMethod={measurementMethod} //the choices are ["height", "weight", "ofc", "bmi"] REQUIRED
                centileColour="black"
                width={700} 
                height={600}
                measurementsArray = {results}  // an array of Measurement class objects from dGC API REQUIRED
                measurementsSDSArray = {[]} // an array of SDS measurements for SDS charts REQUIRED: currently not implemented: pass []
                measurementDataPointColour = 'green'
          />
    )
    return Chart
  }

  returnNewChart(measurementMethod){
    const Chart = (
      <ChartData
            key={measurementMethod}
            reference={'uk-who'} //the choices are ["uk-who", "turner", "trisomy21"] REQUIRED
            sex={'male'} //the choices are ["male", "female"] REQUIRED
            measurementMethod={measurementMethod} //the choices are ["height", "weight", "ofc", "bmi"] REQUIRED
            centileColour="black"
            width={700} 
            height={600}
            measurementsArray = {[]}  // an array of Measurement class objects from dGC Optional
            measurementsSDSArray = {[]} // an array of SDS measurements for SDS charts Optional: currently not implemented: pass []
            measurementDataPointColour = 'green'
      />
    )
    return Chart
  }

  render(){

    const Chart = (
      <ChartData
            reference={'uk-who'} //the choices are ["uk-who", "turner", "trisomy21"] REQUIRED
            sex={'male'} //the choices are ["male", "female"] REQUIRED
            measurementMethod={this.state.measurementMethod} //the choices are ["height", "weight", "ofc", "bmi"] REQUIRED
            centileColour="black"
            width={700} 
            height={600}
            measurementsArray = {[]}  // an array of Measurement class objects from dGC Optional
            measurementsSDSArray = {[]} // an array of SDS measurements for SDS charts Optional: currently not implemented: pass []
            measurementDataPointColour = 'green'
      />)

    const panes = [
      { menuItem: "height", 
        render: () => <Tab.Pane attached={"top"}>Height{
          this.returnNewChart("height")
        }</Tab.Pane> },
      { menuItem: "weight",
        render: () => <Tab.Pane attached={"top"}>
          Weight
          {this.returnNewChart("weight")}
          </Tab.Pane> },
      { menuItem: "bmi", render: () => <Tab.Pane attached={"top"}>BMI {this.returnNewChart("bmi")}</Tab.Pane> },
      { menuItem: "ofc", render: () => <Tab.Pane attached={"top"}>OFC {this.returnNewChart("ofc")}</Tab.Pane> },
    ];
  
    const TabPanes = () => <Tab menu={{ attached: 'top' }} panes={panes} />
  
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
