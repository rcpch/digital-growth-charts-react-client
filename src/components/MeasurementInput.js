import React from "react";
import { Message, Form, Input, Select, Grid, Button } from 'semantic-ui-react'

export default function MeasurementInput(props)  {

  const measurementOptions = [
    {key: 'height', value: 'height', text: 'Height (cm)'},
    {key: 'weight', value: 'weight', text: 'Weight (kg)'},
    {key: 'bmi', value: 'bmi', text: 'BMI (kg/m²)'},
    {key: 'ofc', value: 'ofc', text: 'Head Circumference (cm)'}
  ];

    return (
          <Grid columns={3} key={props.name}>
            <Grid.Row>
              <Grid.Column width={6}>
                <Form.Field required>
                  <Select
                    value={props.measurementMethod}
                    id={props.id}
                    name="measurement_method"
                    placeholder="Measurement Type"
                    options={measurementOptions}
                    onChange={props.handleMeasurementChangeSelect}/> 
                  <div>{props.measurementMethodError}</div>
                </Form.Field>
              </Grid.Column>
              <Grid.Column width={6}>
                <Form.Field>
                  <Input
                    type="number" 
                    name="observation_value"
                    id={props.id}
                    placeholder="Measurement"
                    value={props.observationValue}
                    label={{ content: props.units.toString(), basic:true, color: 'blue' }}
                    labelPosition='right'
                    onChange={props.handleObservationChange}
                  />
                </Form.Field>
                { props.observationValueError !== '' ? <Message color='red'>{ props.observationValueError }</Message> : null }
              </Grid.Column>
              <Grid.Column width={4} verticalAlign='middle'>
                {props.removeButton ? <Button icon='remove' basic id={props.id} color='red' size='tiny' circular compact onClick={props.handleRemoveMeasurementButton}></Button>: null}
                {props.addButton ? <Button size='tiny' basic id={props.id} circular color='green' icon='add' compact onClick={props.handleAddMeasurementButton}></Button>: null}
              </Grid.Column>
            </Grid.Row>
          </Grid>
    );
  
}