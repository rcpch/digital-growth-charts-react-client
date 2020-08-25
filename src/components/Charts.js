import React, { Component } from "react";
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Container, Grid, Header } from "semantic-ui-react";

class Charts extends Component {
    constructor(props){
        super(props);

        let centileArrays = []
        let childDataArray = []

        const girl = 'rgba(217, 49, 155, 1.0)';
        const boy = 'rgba(0, 126, 198, 1.0)';

        this.state = {
            childData: props.childData,
            sex: props.childData[0].birth_data.sex,
            sexColor: (props.childData[0].birth_data.sex === 'male' ? boy : girl),
            centileArrays: centileArrays,
            childDataArray: childDataArray,
            isLoading: true,
            chartData: []
        }

        this.fetchCentileData.bind(this);

    }

    componentDidMount(){

        const results = this.fetchCentileData(this.state.childData);
        results.then(result => {

            const centileArrays = []
            const childDataArray = []

            if(result.child_data.heights.length > 0){
                centileArrays.push({data: result.centile_data.height, key: 'height', childData: result.child_data.heights});
                childDataArray.push(result.child_data.heights);
            }
            if(result.child_data.weights.length > 0) {
                centileArrays.push({data: result.centile_data.weight, key: 'weight', childData: result.child_data.weights});
                childDataArray.push(result.child_data.weights);
            }
            if(result.child_data.bmis.length > 0) {
                centileArrays.push({data: result.centile_data.bmi, key: 'bmi', childData: result.child_data.bmis});
                childDataArray.push(result.child_data.bmis);
            }
            if(result.child_data.ofcs.length > 0) {
                centileArrays.push({data: result.centile_data.ofc, key: 'ofc', childData: result.child_data.ofcs});
                childDataArray.push(result.child_data.ofcs);
            }

            let charts = [];
            centileArrays.forEach(measurement_data_group => {
                    /////// for each of patient's parameters
                    let datasets = []
                    measurement_data_group.data.forEach(centile => {
                        //this iterates through the centiles
                        let uk90_preterm_curve = {};
                        let who_infant_curve = {};
                        let who_child_curve = {};
                        let uk90_child_curve = {};
                        // each of these objects is a data series representing a reference - these stitch together to make a single curve
                        // the following are dotted: 2nd, 9th, 50th, 91st, 99.6th

                        if ( [0.4, 9, 50, 91, 99.6].includes(centile.centile)){ /// dotted lines
                            uk90_preterm_curve = {
                                label: centile.centile,
                                fill: false,
                                showLine: true,
                                borderColor: this.state.sexColor,
                                borderWidth: 0.5,
                                pointStyle: 'dash',
                                borderDash: [15, 5],
                                pointRadius: 0,
                                lineTension: 0,
                                cubicInterpolationMode: false,
                                data: centile.uk90_preterm_data
                            }
    
                            who_infant_curve = {
                                label: centile.centile,
                                fill: false,
                                showLine: true,
                                borderColor: this.state.sexColor,
                                borderWidth: 0.5,
                                pointStyle: 'dash',
                                borderDash: [15, 5],
                                pointRadius: 0,
                                lineTension: 0,
                                cubicInterpolationMode: false,
                                data: centile.who_infant_data
                            }
    
                            who_child_curve = {
                                label: centile.centile,
                                fill: false,
                                showLine: true,
                                borderColor: this.state.sexColor,
                                borderWidth: 0.5,
                                pointStyle: 'dash',
                                borderDash: [15, 5],
                                pointRadius: 0,
                                lineTension: 0,
                                cubicInterpolationMode: false,
                                data: centile.who_child_data
                            }
    
                            uk90_child_curve = {
                                label: centile.centile,
                                fill: false,
                                showLine: true,
                                borderColor: this.state.sexColor,
                                borderWidth: 0.5,
                                pointStyle: 'dash',
                                borderDash: [15, 5],
                                pointRadius: 0,
                                lineTension: 0,
                                cubicInterpolationMode: false,
                                data: centile.uk90_child_data
                            }
                        } else { ///continuous lines

                            uk90_preterm_curve = {
                                label: centile.centile,
                                fill: false,
                                showLine: true,
                                borderColor: this.state.sexColor,
                                borderWidth: 0.5,
                                spanGaps: false,
                                pointRadius: 0,
                                lineTension: 0,
                                data: centile.uk90_preterm_data
                            }

                            who_infant_curve = {
                                label: centile.centile,
                                fill: false,
                                showLine: true,
                                borderColor: this.state.sexColor,
                                borderWidth: 0.5,
                                spanGaps: false,
                                pointRadius: 0,
                                lineTension: 0,
                                data: centile.who_infant_data
                            }

                            who_child_curve = {
                                label: centile.centile,
                                fill: false,
                                showLine: true,
                                borderColor: this.state.sexColor,
                                borderWidth: 0.5,
                                spanGaps: false,
                                pointRadius: 0,
                                lineTension: 0,
                                data: centile.who_child_data
                            }

                            uk90_child_curve = {
                                label: centile.centile,
                                fill: false,
                                showLine: true,
                                borderColor: this.state.sexColor,
                                borderWidth: 0.5,
                                spanGaps: false,
                                pointRadius: 0,
                                lineTension: 0,
                                data: centile.uk90_child_data
                            }
                        }
                        datasets.push(uk90_preterm_curve, who_infant_curve, who_child_curve, uk90_child_curve);
                    });
                    const child_data = {
                        data: measurement_data_group.childData,
                        label: 'Measurement',
                        fill: false,
                        borderColor: 'rgba(0, 0, 0, 1.0)',
                        borderWidth: 1.0,
                        pointRadius: 1.0,
                        pointStyle: 'circle',
                    }
                    datasets.push(child_data)
                    const data = {datasets: datasets};
                    charts.push({key: measurement_data_group.key, data: data})
            });
            
            this.setState({centileArrays: centileArrays, childDataArray: childDataArray, isLoading:false, chartData: charts});    
        });
        
    }

    async fetchCentileData(childData) {
        
        let formData = new FormData();
        formData.append("results", JSON.stringify(childData));
        formData.append("unique_child", "true")
    
        const response = await axios({
            url: `${process.env.REACT_APP_GROWTH_API_BASEURL}/api/v1/json/chart_data`, 
            data: formData,
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    }

    render(){

        if(this.state.isLoading){
            return (
                <Container>
                    <Header as='h1'>
                        Charts
                    </Header>
                    <Grid centered>
                        <Grid.Column>
                            <Header as='h1'>
                                Loading....
                            </Header>                  
                        </Grid.Column>
                    </Grid>
                </Container>
            );

        } else {
            const options = {
                    title:{
                    display: true,
                    position: 'top',
                    text: 'text'
                    },
                    legend: {
                    display: false
                    },
                    scales: {
                    xAxes: [{
                        scaleLabel: {
                        display: true,
                        labelString: 'Age (yrs)',
                        fontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
                        fontStyle: 'bold'
                        },
                        type: 'linear',
                        position: 'bottom',
                        ticks: {
                        min: -0.3,
                        max: 20,
                        stepSize: 0.5,
                        fixedStepSize: 0.5,
                        fontStyle: 'bold'
                        }
                    }],
                    yAxes: [{
                        scaleLabel: {
                        display: true,
                        labelString: 'axis_label',
                        fontStyle: 'bold'
                        },
                        ticks: {
                        min: 0,
                        fontStyle: 'bold'
                        }
                    }]
                }
            }
            return (
                <Container>
                    <Header as='h1'>
                        Charts
                    </Header>
                    <Grid centered>
                        <Grid.Column>
                            {this.state.chartData.map(chart =>{ // create a new chart for each measurement
                                return (
                                    <article className='canvas-container' key={chart.key}>
                                            <Line ref='chart' data={chart.data} options={options}/>
                                    </article> 
                                );
                            }
                            )}                     
                        </Grid.Column>
                    </Grid>
                </Container>
            );
        }
    }
}

        /*
        Data model
        [
            childData: [  one object per measurement_type
                {
                    x: ...
                    y: ...
                }
            ],
            data: [
                {
                    centile: 0.4,
                    sds: -2.66667,
                    uk90_preterm_data:[
                        {
                            label: 0.4,
                            x: ...
                            y: ...
                        },
                        ....
                    ],
                    uk90_child_data: [...],
                    who_infant_data: [...],
                    who_child_data: [...]
                }
            ],
            key: 'height'
        ]

        */
export default Charts
