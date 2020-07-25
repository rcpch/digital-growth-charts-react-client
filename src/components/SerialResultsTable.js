import React, { Component } from "react";
import { Container, Table, Header } from "semantic-ui-react";
import { withRouter } from "react-router-dom";

class SerialResultsTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: this.props.results
        }
    }

    render() {
        return (
            <Container>
                <Header as='h1'>
                        Uploaded Data Table
                </Header>
                <Table basic='very' celled collapsing>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>
                                Birth Date
                            </Table.HeaderCell>
                            <Table.HeaderCell>
                                Gestation
                            </Table.HeaderCell>
                            <Table.HeaderCell>
                                Estimated Delivery Date
                            </Table.HeaderCell>
                            <Table.HeaderCell>
                                Measurement Date
                            </Table.HeaderCell>
                            <Table.HeaderCell>
                                Age
                            </Table.HeaderCell>
                            <Table.HeaderCell>
                                Measurement
                            </Table.HeaderCell>
                            <Table.HeaderCell>
                                Value
                            </Table.HeaderCell>
                            <Table.HeaderCell>
                                SDS
                            </Table.HeaderCell>
                            <Table.HeaderCell>
                                Centile
                            </Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {this.state.data.map((item, index)=>{
                            return (
                                <DataRow data={item} key={index}/>
                            );
                        })}
                    </Table.Body>
                </Table>
            </Container>
        )
    }
}

export default withRouter(SerialResultsTable);
    
function DataRow(props) {
    const birth_date = new Date(props.data.birth_date).toLocaleDateString('en-UK');
    const measurement_date = new Date(props.data.observation_date).toLocaleDateString('en-UK');
    const edd = (props.data.estimated_date_delivery !== null) ? new Date(props.data.estimated_date_delivery).toLocaleDateString('en-UK') : "";

    return (
        <Table.Row>
            <Table.Cell>
                {birth_date}
            </Table.Cell>
            <Table.Cell>
                {props.data.gestation_weeks}<sup>+{props.data.gestation_days}</sup>
            </Table.Cell>
            <Table.Cell>
                {edd}
            </Table.Cell>
            <Table.Cell>
                {measurement_date}
            </Table.Cell>
            <Table.Cell>
                {props.data.corrected_decimal_age}
            </Table.Cell>
            <Table.Cell>
                {props.data.measurement_method}
            </Table.Cell>
            <Table.Cell>
                {props.data.measurement_value}
            </Table.Cell>
            <Table.Cell>
                {props.data.sds}
            </Table.Cell>
            <Table.Cell>
                {props.data.centile}
            </Table.Cell>
        </Table.Row>
    );
}