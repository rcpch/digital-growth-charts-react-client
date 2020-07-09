import React from "react";
import { Message, Container, Segment, Form, Input, Select } from 'semantic-ui-react'
import moment from "moment"

const measurementOptions = [
  {key: 'height', value: 'height', text: 'Height (cm)'},
  {key: 'weight', value: 'weight', text: 'Weight (kg)'},
  {key: 'bmi', value: 'bmi', text: 'BMI (kg/m²)'},
  {key: 'ofc', value: 'ofc', text: 'Head Circumference (cm)'}
]

const sexOptions = [
  { key: 'male', value: 'male', text: 'Male' },
  { key: 'female', value: 'female', text: 'Female' },
]

const ROBERT_WADLOW = 272 // interesting fact - Robert Wadlow (22/2/1918 – 15/7/1940) was the world's tallest man
const JON_BROWER_MINNOCH = 635 // interesting fact -  Jon Brower Minnoch (Born USA) was the world's heaviest man
const KHALID_BIN_MOHSEN_SHAARI = 204 // Khalid bin Mohsen Shaari (2/8/1991) from Saudi Arabia had the highest recorded BMI

class MeasurementForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      birth_date: moment(new Date()).format("YYYY-MM-DD"),
      observation_date: moment(new Date()).format("YYYY-MM-DD"),
      measurement_type: 'height',
      observation_value: 0.0,
      sex: 'male',
      units: 'cm',
      birth_date_error: '',
      observation_date_error: '',
      measurement_type_error: '',
      observation_value_error: '',
      sex_error: '',
      form_valid: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleChangeSelect = this.handleChangeSelect.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event){
    this.setState({[event.target.name]: event.target.value});
    if (event.target.name === 'birth_date') {
      var observation_moment = moment(this.state.observation_date)
      var birth_moment = moment(event.target.value)
      if(birth_moment.isAfter(observation_moment)){
        this.setState({birth_date_error: 'Date of birth cannot come after the date of measurement'});
      } else {
        this.setState({birth_date_error: ''});
        this.setState({observation_date_error: ''});
      }
    }
    else if (event.target.name === 'observation_date') {
      birth_moment = moment(this.state.birth_date)
      observation_moment = moment(event.target.value)
      if(birth_moment.isAfter(observation_moment)){
        this.setState({observation_date_error: 'Date of measurement cannot come before the date of measurement'});
      } else {
        this.setState({observation_date_error: ''});
        this.setState({birth_date_error: ''});
      }
    }
    else if(event.target.name === 'observation_value') {
      var measurement_type = this.state.measurement_type
      if(measurement_type === 'height') {
        if (event.target.value < 35) {
          this.setState({observation_value_error: 'The ' + measurement_type+' you entered is too low.'});
        }
        else if (event.target.value > ROBERT_WADLOW) {
          this.setState({observation_value_error: 'The ' + measurement_type+' you entered is too tall.'});
        }
        else {
          this.setState({observation_value_error: ''});
        }
      }
      if(measurement_type === 'weight') {
        if (event.target.value < 0.01) {
          this.setState({observation_value_error: 'The ' + measurement_type+' you entered is too low.'});
        }
        else if (event.target.value > JON_BROWER_MINNOCH) {
          this.setState({observation_value_error: 'The ' + measurement_type+' you entered is too heavy.'});
        }
        else {
          this.setState({observation_value_error: ''});
        }
      }
      if(measurement_type === 'bmi') {
        if (event.target.value < 5) {
          this.setState({observation_value_error: 'The ' + measurement_type+' you entered is too low.'});
        }
        else if (event.target.value > KHALID_BIN_MOHSEN_SHAARI) {
          this.setState({observation_value_error: 'The ' + measurement_type+' you entered is too high.'});
        }
        else {
          this.setState({observation_value_error: ''});
        }
      }
      if(measurement_type === 'ofc') {
        if (event.target.value < 30) {
          this.setState({observation_value_error: 'The ' + measurement_type+' you entered is too low.'});
        }
        else if (event.target.value > 70) {
          this.setState({observation_value_error: 'The ' + measurement_type+' you entered is too high.'});
        }
        else {
          this.setState({observation_value_error: ''});
        }
      }
    }
    var form_valid = this.formIsValid();
    this.setState({form_valid: form_valid})
  }

  formIsValid(){
    if (
      this.state.birth_date_error === '' &&
      this.state.observation_date_error === '' &&
      this.state.measurement_type_error === '' &&
      this.state.observation_value_error === '' &&
      this.state.sex_error === ''
      ) {
        return true
      } else {
        return false
      }
  }

  handleChangeSelect(event, data){
    this.setState({[data.name]: data.value});
    this.changeUnits(data.value)
    this.setState({form_valid: this.formIsValid()})
  }

  handleSubmit(event){
    let formData = {
      birth_date: this.state.birth_date,
      observation_date: this.state.observation_date,
      measurement_type: this.state.measurement_type,
      observation_value: this.state.observation_value,
      sex: this.state.sex
    }
    this.props.onSubmitMeasurement(formData)
  }

  changeUnits(measurement_type){
      if (measurement_type === 'height'){
        this.setState({units: 'cm'})
      }
      if (measurement_type === 'weight'){
        this.setState({units: 'kg'})
      }
      if (measurement_type === 'bmi'){
        this.setState({units: 'kg/m²'})
      }
      if (measurement_type === 'ofc'){
        this.setState({units: 'cm'})
      }
  }

  
  
  render() {
    return (
        <Container>
          <Segment inverted color="blue">
            <Form onSubmit={this.handleSubmit}>
              <Form.Field required>
                <Input
                  type="date" 
                  name="birth_date"
                  value = {this.state.birth_date}
                  placeholder="Date of Birth"
                  onChange={this.handleChange}
                /> 
                <div>{this.state.birth_date_error}</div>
              </Form.Field>
              <Form.Field required>
                <Input 
                  type="date" 
                  name="observation_date"
                  value={this.state.observation_date}
                  placeholder="Date of Measurement"
                  onChange={this.handleChange}
                /> 
                <div>{this.state.observation_date_error}</div>
              </Form.Field>
              <Form.Field required>
                <Select
                  value={this.state.measurement_type}
                  name="measurement_type"
                  placeholder="Measurement Type"
                  options={measurementOptions}
                  onChange={this.handleChangeSelect}/> 
                <div>{this.state.measurement_type_error}</div>
              </Form.Field>
              <Form.Field required>
                <Input 
                  type="number" 
                  name="observation_value" 
                  placeholder="Measurement" 
                  value={this.state.observation_value}
                  label={{ basic: true, content: this.state.units }}
                  labelPosition='right'
                  onChange={this.handleChange}
                />
                <div>{this.state.observation_value_error}</div>
              </Form.Field>
              <Form.Field required>
                <Select
                  name="sex" 
                  placeholder="Sex"
                  value={this.state.sex}
                  onChange={this.handleChangeSelect}
                  options={sexOptions}/> 
                <div>{this.state.sex_error}</div>
              </Form.Field>
                                
              <Form.Button 
                type="submit"
                disabled={!this.state.form_valid}
              >
                  Calculate
              </Form.Button>
            </Form>
          </Segment>
          <Message color='red'>
            This site is under development. No responsibility is accepted for the accuracy of results produced by this tool.
          </Message>
        </Container>
    );
  }
  
   
}

export default MeasurementForm;
