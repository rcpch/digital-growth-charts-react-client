import RCPCHChartComponent from '@rcpch/digital-growth-charts-react-chart-library'
import React, { Component } from 'react'
import axios from 'axios';

class ChartData extends Component {

    constructor(props){
        super(props);

        const girl = 'rgba(217, 49, 155, 1.0)';
        const boy = 'rgba(0, 126, 198, 1.0)';

        this.state = {
            childData: props.childData,
            sex: props.childData[0].birth_data.sex,
            sexColor: (props.childData[0].birth_data.sex === 'male' ? boy : girl),
            heights: [],
            height_SDS: [],
            weights: [],
            weight_SDS: [],
            bmis: [],
            bmi_SDS: [],
            ofcs: [],
            ofc_SDS: [],
            isLoading: true,
            selectedCharts: []
        }
        this.fetchCentileData.bind(this);
    }

    async fetchCentileData(childData) {
        
        let formData = {
          results: childData,
          unique_child: "true",
        };
    
        const response = await axios({
          url: `${process.env.REACT_APP_GROWTH_API_BASEURL}/uk-who/plottable-child-data`,
          data: formData,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        return response.data;
    }

    componentDidMount(){
        const results = this.fetchCentileData(this.state.childData);
        let selectedCharts = []
        results.then(result => {
            if (result.child_data.heights.length > 0){
                this.setState(
                    {
                        heights: result.child_data.heights,
                        height_SDS: result.child_data.height_SDS
                    }
                )
                selectedCharts.push('height')
            }
            if (result.child_data.weights.length > 0){
                this.setState({
                  weights: result.child_data.weights,
                  weight_SDS: result.child_data.weight_SDS,
                });
                selectedCharts.push('weight')
            }
            if (result.child_data.ofcs.length > 0){
                this.setState(
                    {
                        weights: result.child_data.ofcs,
                        weight_SDS: result.child_data.ofc_SDS
                    }
                )
                selectedCharts.push('ofc')
            }
            if (result.child_data.bmis.length > 0){
                this.setState(
                    {
                        bmis: result.child_data.bmis,
                        bmi_SDS: result.child_data.bmi_SDS
                    }
                )
                selectedCharts.push('bmi')
            }
            this.setState({isLoading: false})
            this.setState({selectedCharts: selectedCharts})
        })
    }

    render(){
        if (this.state.isLoading) {
            return (<div><h1>Loading...</h1></div> )
        } else {
            return (
                (<div>
                    {this.state.selectedCharts.map((selectedChart) => {
                        if (selectedChart === 'height'){
                            return (
                                    <RCPCHChartComponent 
                                        key={selectedChart}
                                        measurementMethod='height' 
                                        sex={this.state.sex} 
                                        centilesColour='#0d0c0a' 
                                        width={700} 
                                        height={600}
                                        measurementsArray = {this.state.heights}
                                        measurementsSDSArray = {this.state.height_SDS}
                                        measurementDataPointColour = 'red'
                                    />
                            )
                        }
                        if (selectedChart === 'weight'){
                            return (
                                    <RCPCHChartComponent 
                                        key={selectedChart}
                                        measurementMethod='weight' 
                                        sex={this.state.sex}
                                        centilesColour='#0d0c0a' 
                                        width={700} 
                                        height={600}
                                        measurementsArray = {this.state.weights}
                                        measurementsSDSArray = {this.state.weight_SDS}
                                        measurementDataPointColour = 'red'
                                    />
                            )
                        }
                        if (selectedChart === 'ofc'){
                            return (
                                    <RCPCHChartComponent 
                                        key={selectedChart}
                                        measurementMethod='ofc' 
                                        sex={this.state.sex} 
                                        centilesColour='#0d0c0a' 
                                        width={700} 
                                        height={600}
                                        measurementsArray = {this.state.ofcs}
                                        measurementsSDSArray = {this.state.ofc_SDS}
                                        measurementDataPointColour = 'red'
                                    />
                            )
                        }
                        if (selectedChart === 'bmi'){
                            return (
                                    <RCPCHChartComponent 
                                        key={selectedChart}
                                        measurementMethod='bmi' 
                                        sex={this.state.sex} 
                                        centilesColour='#0d0c0a' 
                                        width={700} 
                                        height={600}
                                        measurementsArray = {this.state.bmis}
                                        measurementsSDSArray = {this.state.bmi_SDS}
                                        measurementDataPointColour = 'red'
                                    />
                            )
                        } else {
                            return (
                                <h1>...</h1>
                            )
                        }
                    })}
                </div>)
            )
        }
    }
        
}


export default ChartData