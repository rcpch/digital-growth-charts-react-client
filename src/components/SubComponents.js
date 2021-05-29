import React from 'react';
import {
  Segment,
  Message,
  Button,
  Table,
  List,
  Modal,
} from 'semantic-ui-react';

const units = (measurementMethod) => {
  if (measurementMethod === 'height') {
    return 'cm';
  }
  if (measurementMethod === 'weight') {
    return 'kg';
  }
  if (measurementMethod === 'bmi') {
    return 'kg/m²';
  }
  if (measurementMethod === 'ofc') {
    return 'cm';
  }
};

export const Acknowledgements = () => {
  // list={["Freeman JV, Cole TJ, Chinn S, Jones PRM, White EM, Preece MA. Cross sectional stature and weight reference curves for the UK, 1990. Arch Dis Child 1995; 73:17-24.", "<a href='www.who.int/childgrowth/en'>www.who.int/childgrowth/en</a>", "For further relevant references see fact sheet downloadable from www.growthcharts.RCPCH.ac.uk"]}
  return (
    <Message>
      <Message.Header>References</Message.Header>
      <List>
        <List.Item>
          Freeman JV, Cole TJ, Chinn S, Jones PRM, White EM, Preece MA. Cross
          sectional stature and weight reference curves for the UK, 1990. Arch
          Dis Child 1995; 73:17-24.
        </List.Item>
        <List.Item>
          <a href="www.who.int/childgrowth/en">www.who.int/childgrowth/en</a>
        </List.Item>
        <List.Item>
          For further relevant references see fact sheet downloadable from{' '}
          <a href="www.growthcharts.RCPCH.ac.uk">
            www.growthcharts.RCPCH.ac.uk
          </a>
        </List.Item>
      </List>
    </Message>
  );
};

export const TableBody = (props) => {
  const measurement = props.measurement;
  return (
    <React.Fragment>
      <Table.Row>
        <Table.Cell>Ages</Table.Cell>
        <Table.Cell>
          {measurement.measurement_dates.chronological_calendar_age}
        </Table.Cell>
        <Table.Cell>
          {measurement.measurement_dates.corrected_calendar_age}
        </Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>Measurement</Table.Cell>
        <Table.Cell>
          {measurement.child_observation_value.observation_value}{' '}
          {units(measurement.child_observation_value.measurement_method)}
        </Table.Cell>
        <Table.Cell></Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>SDS</Table.Cell>
        <Table.Cell>
          {Math.round(
            measurement.measurement_calculated_values.corrected_sds * 1000
          ) / 1000}
        </Table.Cell>
        <Table.Cell>
          {Math.round(
            measurement.measurement_calculated_values.chronological_sds * 1000
          ) / 1000}
        </Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>Centiles</Table.Cell>
        <Table.Cell>
          {measurement.measurement_calculated_values.corrected_centile}
        </Table.Cell>
        <Table.Cell>
          {measurement.measurement_calculated_values.chronological_centile}
        </Table.Cell>
      </Table.Row>
    </React.Fragment>
  );
};

export const ResultsSegment = ({ apiResult, reference }) => (
  <Segment>
    <Table basic="very" celled collapsing compact>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell></Table.HeaderCell>
          <Table.HeaderCell>Corrected Results</Table.HeaderCell>
          <Table.HeaderCell>Chronological Results</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {apiResult[reference].height.length > 0 && (
          <Table.Row>
            <Table.HeaderCell></Table.HeaderCell>
            <Table.HeaderCell>Heights</Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
          </Table.Row>
        )}
        {apiResult[reference].height.length > 0 &&
          apiResult[reference].height.map((measurement, index) => {
            return <TableBody measurement={measurement} key={index} />;
          })}
        {apiResult[reference].weight.length > 0 && (
          <Table.Row>
            <Table.HeaderCell></Table.HeaderCell>
            <Table.HeaderCell>Weights</Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
          </Table.Row>
        )}
        {apiResult[reference].weight.length > 0 &&
          apiResult[reference].weight.map((measurement, index) => {
            return <TableBody key={index} measurement={measurement} />;
          })}
        {apiResult[reference].bmi.length > 0 && (
          <Table.Row>
            <Table.HeaderCell></Table.HeaderCell>
            <Table.HeaderCell>BMIs</Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
          </Table.Row>
        )}
        {apiResult[reference].bmi.length > 0 &&
          apiResult.bmi.map((measurement, index) => {
            return <TableBody key={index} measurement={measurement} />;
          })}
        {apiResult[reference].ofc.length > 0 && (
          <Table.Row>
            <Table.HeaderCell></Table.HeaderCell>
            <Table.HeaderCell>Head Circumferences</Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
          </Table.Row>
        )}
        {apiResult[reference].ofc.length > 0 &&
          apiResult[reference].ofc.map((measurement, index) => {
            return <TableBody key={index} measurement={measurement} />;
          })}
      </Table.Body>
    </Table>
  </Segment>
);

export const ErrorModal = ({
  title,
  body,
  handleClose,
  visible,
  handleCancel,
}) => {
  const showCancel = handleCancel ? true : false;
  return (
    <Modal title={title} open={visible} size="small" closeOnEscape={true}>
      <Modal.Header>{title}</Modal.Header>
      <Modal.Content>{body}</Modal.Content>
      <Modal.Actions>
        <Button negative onClick={handleClose}>
          OK
        </Button>
        {showCancel && <Button onClick={handleCancel}>Cancel</Button>}
      </Modal.Actions>
    </Modal>
  );
};
