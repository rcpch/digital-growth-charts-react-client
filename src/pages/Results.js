import React, { Component } from "react";
import { Container, Table, Grid, Popup, Icon, Header } from "semantic-ui-react";
import { withRouter } from "react-router-dom";

class Results extends Component {
    constructor(props){
        super(props);
        let data = this.props.location.data;
        this.state = {
            results: data
        }
    }
    render() {
        return (
            <Container>
                <Grid columns={2} padded>
                    <Grid.Column>
                    {this.props.location.data.calculations.map((item, index)=>{
                                    if(index > 0 && item.measurement_dates.observation_date === this.props.location.data.calculations[0].measurement_dates.observation_date){
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
                    </Grid.Column>
                    <Grid.Column>
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
                                {this.props.location.data.calculations.map((item, index)=>{
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
                    </Grid.Column>
                </Grid>
            </Container>
        );
    }
}

export default withRouter(Results);

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
                <Table.Cell> {props.item.child_observation_value.measurement_value} cm</Table.Cell>
            </Table.Row>
        );
    }
    else if (props.item.child_observation_value.measurement_type === 'bmi') {
        return (
            <Table.Row>
                <Table.Cell>BMI</Table.Cell>
                <Table.Cell> {props.item.child_observation_value.measurement_value} kg/m2</Table.Cell>
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