import React, { Component } from 'react'
import axios from 'axios';
// @ts-ignore
import RCPCHChartComponent from '@rcpch/digital-growth-charts-react-chart-library'
// import 'digital-growth-charts-react-chart-component/dist/index.css'
class ChartData extends Component {

    constructor(props){
        super(props)
        // These are the colours from the orginal paper charts now deprecated
        // const girl = 'rgba(217, 49, 155, 1.0)';
        // const boy = 'rgba(0, 126, 198, 1.0)';

        this.state = {
            childData: [], // once measurements have returned from api in plottable form they are held in state
            isLoading: true, // flag awaiting async fetchCentileData - could have spinner here
            centiles_array: [], // an array to keep all of the cacluclated measurement
        }
        this.fetchCentileData.bind(this);

    }

    async fetchCentileData(childData) {
        
        // child data here would be passed in from a form
        // here we are using hardcoded example data - payload or preterm payload
        // passed in from App.js
  
          const response = await axios({
          //   url: `${process.env.REACT_APP_GROWTH_API_BASEURL}/uk-who/plottable-child-data`,
            url: `http://localhost:5000/uk-who/plottable-child-data`,
            data: childData,
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          });
          return response.data;
      }
  
      componentDidMount(){
  
          // if measurement results are supplied, generate plottable data
          if (this.props.measurementsArray.length > 0){
              // plot the plottable child data
              const formData = {
              results: this.props.measurementsArray // measurements passed in from the form
            };
    
            const results = this.fetchCentileData(formData); //async function to fetch plottable child data
            
            results.then(result => { // stores child results in arrays based on measurement_methods in child results
                
                const measurement_method = result.child_data.measurement_method
                const centile_data = result.child_data.centile_data
                const sds_data = result.child_data.sds_data
                this.setState({measurement_method: measurement_method})
                this.setState({centile_data: centile_data})
                this.setState({sds_data: sds_data})
                this.setState({isLoading: false}) // data returned from API. set isLoading flag to false
            })
          } else {
              const measurement_method = this.props.measurementMethod
              this.setState({measurement_method: measurement_method})
              this.setState({centile_data: []})
              this.setState({sds_data: []})
              this.setState({isLoading: false}) //skip the child measurements, render charts without
          }
          
      }

    render(){
        
        // set the title of the chart
        let title=''
        let subTitle=''
        if (this.props.reference === "uk-who"){
            title = "UK-WHO"
        }
        else if (this.props.reference === "turner"){
            title="Turner's Syndrome"
        }
        else if (this.props.reference === "trisomy21"){
            title = "Trisomy 21 (Down's Syndrome)"
        }

        let sexText = ''
        let measurementText = ''
        if (this.props.sex === 'male') {
            sexText = 'Boys'
        } else {
            sexText = 'Girls'
        }

        switch(this.props.measurementMethod){
            case("height"):
                measurementText = "Length/Height"
                break;
            case("weight"):
                measurementText = "Weight"
                break;
            case("bmi"):
                measurementText = "Body Mass Index"
                break;
            case("ofc"):
                measurementText = "Head Circumference"
                break;
            default:
                measurementText = ""
                break;
        } 
        
        subTitle = (measurementText + " - " + sexText)
        
        return (
          <div>
            { this.state.isLoading ? (
                <h1>Loading...</h1>
              ) : (
                    <RCPCHChartComponent
                        // key={this.state.measurement_method + "-" + this.props.reference}
                        reference={this.props.reference}
                        measurementMethod={this.props.measurementMethod} 
                        sex={this.props.sex}
                        title={title}
                        subtitle={subTitle}
                        centileColour={this.props.centileColour}
                        width={this.props.width} 
                        height={this.props.height}
                        measurementsArray = {this.state.centile_data} // this is the plottable child data
                        measurementsSDSArray = {this.state.sds_data} // this is plottable SDS data
                        measurementDataPointColour = {this.props.measurementDataPointColour}
                        chartBackground = {this.props.chartBackground}
                    />
                )
            }
        </div>)
    }
}

export default ChartData