import React, { Component } from "react";
import { Container, Table, Grid, Popup, Icon, Header, Menu } from "semantic-ui-react";
import { withRouter } from "react-router-dom";
import axios from 'axios';
import { Line } from 'react-chartjs-2';

class Results extends Component {
    constructor(props){
        super(props);
        let data = this.props.location.data.calculations;
        this.state = {
            results: data,
            activeItem: 'tables',
            chartData: null
        }
        this.handleItemClick.bind(this);
    }

    handleItemClick = (e, { name }) => this.setState({ activeItem: name });

    render() {
        const { activeItem } = this.state;
        return (
            <div>
            <Menu tabular>
                <Menu.Item
                    name='tables'
                    active={activeItem === 'tables'}
                    onClick={this.handleItemClick}
                />
                <Menu.Item
                    name='charts'
                    active={activeItem === 'charts'}
                    onClick={this.handleItemClick}
                />
            </Menu>
            <Container>
                {activeItem === 'tables'? <Tables results={this.state.results}/> : <Charts childData={this.state.results} />}
            </Container>
            </div>
        );
    }
}

export default withRouter(Results);

function Tables(props){
    return (
        <Container>
            <Grid columns={2} padded>
                <Grid.Column>
                    <DatesTable dates={props.results}/>
                </Grid.Column>
                <Grid.Column>
                    <CentilesTable centiles={props.results}/>
                </Grid.Column>
            </Grid>
        </Container>
    );
}


function DatesTable(props) {
    return (
        <>
            {props.dates.map((item, index)=>{
                if(index > 0 && item.measurement_dates.observation_date === props.dates[0].measurement_dates.observation_date){
                    return null;
                } else {
                    return (
                        <Table basic='very' celled collapsing key={index}>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>
                                    </Table.HeaderCell>
                                    <Table.HeaderCell>
                                        Dates/Ages
                                    </Table.HeaderCell>
                                    <Table.HeaderCell>
                                    </Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                <Table.Row>
                                    <Table.Cell>Date of Birth</Table.Cell>
                                    <Table.Cell>{item.birth_data.birth_date}</Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>Date of Measurement</Table.Cell>
                                    <Table.Cell>{item.measurement_dates.observation_date}</Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>Due Date</Table.Cell>
                                    <Table.Cell>{item.birth_data.estimated_date_delivery}</Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>Gestation</Table.Cell>
                                    <Table.Cell>{item.birth_data.gestation_weeks}+{item.birth_data.gestation_days} weeks</Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>Chronological Age</Table.Cell>
                                    <Table.Cell>{item.measurement_dates.chronological_decimal_age} y</Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>Chronological Calendar Age</Table.Cell>
                                    <Table.Cell>{item.measurement_dates.chronological_calendar_age}</Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>Corrected Age</Table.Cell>
                                    <Table.Cell>{item.measurement_dates.corrected_decimal_age} y</Table.Cell>
                                    <PopupData lay_comment={item.measurement_dates.lay_decimal_age_comment} clinician_comment={item.measurement_dates.clinician_decimal_age_comment}></PopupData>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>Chronological Calendar Age</Table.Cell>
                                    <Table.Cell>{item.measurement_dates.corrected_calendar_age}</Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        </Table>
                    );
                }
            })};
        </>
    );
}

function CentilesTable(props) {
    return (
        <Table basic='very' celled collapsing>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                        Centiles
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                    </Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            {props.centiles.map((item, index)=>{
                return (
                    <Table.Body key={index}>
                        <MeasurementCell item={item}/>
                        <Table.Row>
                            <Table.Cell>SDS</Table.Cell>
                            <Table.Cell> {item.measurement_calculated_values.sds}</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>Centile</Table.Cell>
                            <Table.Cell> {item.measurement_calculated_values.centile} %</Table.Cell>
                            <PopupData lay_comment={item.measurement_calculated_values.lay_comment} clinician_comment={item.measurement_calculated_values.clinician_comment}></PopupData>
                        </Table.Row>
                    </Table.Body>
                );
            })}
        </Table>
    );
}

function MeasurementCell(props) {
    
    if (props.item.child_observation_value.measurement_type === 'height') {
        return (
                <Table.Row>
                    <Table.Cell>Height</Table.Cell>
                    <Table.Cell> {props.item.child_observation_value.measurement_value} cm</Table.Cell>
                </Table.Row>
        );
    }
    else if (props.item.child_observation_value.measurement_type === 'weight') {
        return (
            <Table.Row>
                <Table.Cell>Weight</Table.Cell>
                <Table.Cell> {props.item.child_observation_value.measurement_value} kg</Table.Cell>
            </Table.Row>
        );
    }
    else if (props.item.child_observation_value.measurement_type === 'bmi') {
        return (
            <Table.Row>
                <Table.Cell>BMI</Table.Cell>
                <Table.Cell> {props.item.child_observation_value.measurement_value} kg/m²</Table.Cell>
            </Table.Row>
        );
    }
    else if (props.item.child_observation_value.measurement_type === 'ofc') {
        return (
            <Table.Row>
                <Table.Cell>Head Circumference</Table.Cell>
                <Table.Cell> {props.item.child_observation_value.measurement_value} cm</Table.Cell>
            </Table.Row>
        );
    }
}

function PopupData(props) {
    return (
        <React.Fragment>
            <Table.Cell>
                <Popup
                    trigger={<Icon name="info circle" color='blue'></Icon>}
                    position='top right'
                    flowing
                    hoverable
                >
                    <Grid centered divided columns={2}>
                        <Grid.Column textAlign='center'>
                            <Header as='h4'>Lay Comment</Header>
                            <p>
                                {props.lay_comment}
                            </p>
                        </Grid.Column>
                        <Grid.Column textAlign='center'>
                            <Header as='h4'>Clinician Comment</Header>
                            <p>
                                {props.clinician_comment}
                            </p>
                        </Grid.Column>
                    </Grid>
                </Popup>
            </Table.Cell>
        </React.Fragment>
    );
}

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
        const payload = {
            "results": JSON.stringify(childData),
            "unique_child": "true"
        }
    
        const response = await axios('http://localhost:5000/api/v1/json/chart_data', {
          params: payload
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

