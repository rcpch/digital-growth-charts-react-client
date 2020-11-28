import React from "react";
import { Message, Container, Segment, Form, Input, Select, Button, Header } from 'semantic-ui-react'
import moment from "moment"
import MeasurementInput from './MeasurementInput';

const sexOptions = [
  { key: 'male', value: 'male', text: 'Male' },
  { key: 'female', value: 'female', text: 'Female' },
]
const gestationWeeksOptions = [
  {key: '23', value: 23, text: '23'},
  {key: '24', value: 24, text: '24'},
  {key: '25', value: 25, text: '25'},
  {key: '26', value: 26, text: '26'},
  {key: '27', value: 27, text: '27'},
  {key: '28', value: 28, text: '28'},
  {key: '29', value: 29, text: '29'},
  {key: '30', value: 30, text: '30'},
  {key: '31', value: 31, text: '31'},
  {key: '32', value: 32, text: '32'},
  {key: '33', value: 33, text: '33'},
  {key: '34', value: 34, text: '34'},
  {key: '35', value: 35, text: '35'},
  {key: '36', value: 36, text: '36'},
  {key: '37', value: 37, text: '37'},
  {key: '38', value: 38, text: '38'},
  {key: '39', value: 39, text: '39'},
  {key: '40', value: 40, text: '40'},
  {key: '41', value: 41, text: '41'},
  {key: '42', value: 42, text: '42'},
]

const gestationDaysOptions = [
  {key: '0', value: 0, text: '0'},
  {key: '1', value: 1, text: '1'},
  {key: '2', value: 2, text: '2'},
  {key: '3', value: 3, text: '3'},
  {key: '4', value: 4, text: '4'},
  {key: '5', value: 5, text: '5'},
  {key: '6', value: 6, text: '6'}
]

const ROBERT_WADLOW = 272 // interesting fact - Robert Wadlow (22/2/1918 – 15/7/1940) was the world's tallest man
const JON_BROWER_MINNOCH = 635 // interesting fact -  Jon Brower Minnoch (Born USA) was the world's heaviest man
const KHALID_BIN_MOHSEN_SHAARI = 204 // Khalid bin Mohsen Shaari (2/8/1991) from Saudi Arabia had the highest recorded BMI

const measurementMethods = ['height', 'weight', 'bmi', 'ofc'];

class MeasurementForm extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      birth_date: moment(new Date()).format("YYYY-MM-DD"),
      observation_date: moment(new Date()).format("YYYY-MM-DD"),
      measurements: [
         {
          measurement_method: 'height',
          observation_value: 0,
          id: Math.random().toString(36).substring(7),
          units: 'cm',
          observation_value_error: '',
          show_add: true,
          show_remove: false
        }
      ],
      sex: 'male',
      gestation_weeks: 40,
      gestation_days: 0,
      birth_date_error: '',
      observation_date_error: '',
      observation_value_error: null,
      form_valid: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleChangeSelect = this.handleChangeSelect.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleAddMeasurement = this.handleAddMeasurement.bind(this);
    this.handleRemoveMeasurement = this.handleRemoveMeasurement.bind(this);
    this.handleChangeGestation = this.handleChangeGestation.bind(this);
    this.handleChangeSex = this.handleChangeSex.bind(this);
    this.createBMI = this.createBMI.bind(this);
  }

  handleAddMeasurement(event) {
    //TODO #2 Conversation with @pacharanero and @atheneheaven about the utility of MeasurementInput component over simple input fields.
    let measurements = this.state.measurements;
    const unselectedMeasurements = measurementMethods.filter(measurementMethod => { //returns an array of unselected measurements
      return !measurements.find(measurement => measurement.measurement_method === measurementMethod)
    });
    if (unselectedMeasurements.length < 1){
      // there are no measurements left - prevent addition of further measurements
      console.log('All measurements have been used up now');
      
    } else {
      measurements.push({measurement_method: unselectedMeasurements[0], observation_value: 0, id: Math.random().toString(36).substring(7), units: this.changeUnits(unselectedMeasurements[0]), observation_value_error: ''});
    }
    
    this.updateShowHideMeasurementButtons();
    this.setState({measurements: measurements});
    event.preventDefault();
  }

  handleRemoveMeasurement(event) {
    event.preventDefault();
    let measurements = this.state.measurements;
    const {id} = event.currentTarget;
    const measurementIndex = measurements.findIndex(measurement => {
      return measurement.id === id;
    });
    measurements.splice(measurementIndex, 1);
    this.setState({measurements: measurements});
    this.updateShowHideMeasurementButtons();
  }

  updateShowHideMeasurementButtons(){
    let measurements = this.state.measurements;
    const final_index = measurements.length - 1;
    if (measurements.length === 1){
      measurements[0].show_remove = false;
      measurements[0].show_add = true;
      this.setState({ measurements: measurements });
    } else {
      let updatedMeasurements = measurements.map((measurement, index) => {
        if(index === 0){
          measurement.show_add = false;
          measurement.show_remove = true;
          return measurement;
        } 
        if(index === final_index && index !== 3) {
          // last item in the list and list not full
          measurement.show_remove = true;
          measurement.show_add = true;
          return measurement;
        }
        if(index === 3) {
          // all measurements have been selected
          measurement.show_remove = true;
          measurement.show_add = false;
          return measurement;
        }
        else {
          measurement.show_add = false;
          measurement.show_remove = true;
          return measurement;
        }
      });
      this.setState({ measurements: updatedMeasurements });
    }
  }

  handleChange(event){
    if (event.target.name === 'birth_date') {
      var observation_moment = moment(this.state.observation_date)
      var birth_moment = moment(event.target.value)
      if(birth_moment.isAfter(observation_moment)){
        this.setState({birth_date_error: 'Date of birth cannot come after the date of measurement'});
      } else {
        this.setState({birth_date_error: ''});
        this.setState({observation_date_error: ''});
        this.setState({[event.target.name]: event.target.value});
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
        this.setState({[event.target.name]: event.target.value});
      }
    }
    else {
      // this is updating an observation value
      const input_id = event.target.id;
      const measurement_index = this.state.measurements.findIndex(measurement => {
        return measurement.id === input_id;
      });
      let all_measurements = this.state.measurements;
      let measurement_to_update = all_measurements[measurement_index];
      measurement_to_update.observation_value_error = this.validateObservationValue(measurement_to_update.measurement_method, event.target.value);
      measurement_to_update.observation_value = event.target.value;
      measurement_to_update.units = this.changeUnits(measurement_to_update.measurement_method)
      all_measurements[measurement_index] = measurement_to_update;
      this.setState({measurements: all_measurements});
      if (event.target.name !== 'ofc'){
        this.createBMI();
      }
    }
    var form_valid = this.formIsValid();
    this.setState({form_valid: form_valid});
  }

  createBMI() {
    let all_measurements = this.state.measurements;
    const heightIndex = all_measurements.findIndex(measurement => {
      return measurement.measurement_method === 'height';
    });
    const weightIndex = all_measurements.findIndex(measurement => {
      return measurement.measurement_method === 'weight';
    });
    const bmiIndex = all_measurements.findIndex(measurement => {
      
      return measurement.measurement_method === 'bmi';
    })
    if (heightIndex !== -1 && weightIndex !== -1 && bmiIndex === -1){
      // calculate BMI if height and weight exist and BMI does not already exist
      const height = all_measurements[heightIndex].observation_value;
      const weight = all_measurements[weightIndex].observation_value;
      const bmi = weight/(height / 100);
      const observationValueError = this.validateObservationValue('bmi', bmi);
      if (observationValueError === ''){
        this.state.measurements.push({measurement_method: 'bmi', observation_value: bmi, id: Math.random().toString(36).substring(7), units: 'kg/m²', observation_value_error: observationValueError});
        this.updateShowHideMeasurementButtons();
      }
    }
  }

  validateObservationValue(measurement_method, observation_value) {
    
    if(measurement_method === 'height') {
      if (observation_value < 35) {
        return 'The ' + measurement_method+' you entered is too low.';
      }
      else if (observation_value > ROBERT_WADLOW) {
        return 'The ' + measurement_method+' you entered is too tall.';
      }
      else {
        return '';
      }
    }
    if(measurement_method === 'weight') {
      if (observation_value < 0.01) {
        return 'The ' + measurement_method+' you entered is too low.';
      }
      else if (observation_value > JON_BROWER_MINNOCH) {
        return 'The ' + measurement_method+' you entered is too heavy.';
      }
      else {
        return '';
      }
    }
    if(measurement_method === 'bmi') {
      if (observation_value < 5) {
        return 'The ' + measurement_method+' you entered is too low.';
      }
      else if (observation_value > KHALID_BIN_MOHSEN_SHAARI) {
        return 'The ' + measurement_method+' you entered is too high.';
      }
      else {
        return '';
      }
    }
    if(measurement_method === 'ofc') {
      if (observation_value < 30) {
        return 'The ' + measurement_method+' you entered is too low.';
      }
      else if (observation_value > 70) {
        return 'The ' + measurement_method+' you entered is too high.';
      }
      else {
        return '';
      }
    }
  }

  formIsValid(){
    const all_measurements = this.state.measurements;
    let valid = true;
    all_measurements.forEach(measurement => {
      if (measurement.observation_value_error !== ''){
        valid = false;
      }
    });
    if (
      this.state.birth_date_error === '' &&
      this.state.observation_date_error === '' &&
      valid
      ) {
        return true
      } else {
        return false
      }
  }

  handleSubmit(event){

    const measurements = this.state.measurements;
    let measurementArray = [];
    measurements.forEach(measurement => {
      let formData = {
        birth_date: this.state.birth_date,
        observation_date: this.state.observation_date,
        measurement_method: measurement.measurement_method,
        observation_value: measurement.observation_value,
        gestation_weeks: this.state.gestation_weeks,
        gestation_days: this.state.gestation_days,
        sex: this.state.sex
      }
      measurementArray.push(formData);
    });
    
    this.props.onSubmitMeasurement(measurementArray)
  }

  handleChangeSelect(event, data) {
    const select_id = data.id;
    let measurements = this.state.measurements;
    measurements.map(measurement => {
      if (measurement.id === select_id){
        measurement.measurement_method = data.value;
        measurement.units = this.changeUnits(data.value)
      }
      return measurement;
    });
    this.setState({measurements: measurements})
    this.setState({form_valid: this.formIsValid()})
  }

  handleChangeGestation(event, data) {
    const {name, value} = data;
    if (name==='gestation_weeks') {
      this.setState({gestation_weeks: value})
      if (value === 42) {
        this.setState({gestation_days: 0});
      }
    } else if (name === 'gestation_days') {
      if (this.state.gestation_weeks === 42) {
        this.setState({gestation_days: 0});
      } else {
        this.setState({gestation_days: value});
      }
    }
  }

  handleChangeSex(event, data){
    this.setState({sex: data.value});
  }

  changeUnits(measurement_method){
    if (measurement_method === 'height'){
      return 'cm';
    }
    if (measurement_method === 'weight'){
      return 'kg';
    }
    if (measurement_method === 'bmi'){
      return 'kg/m²';
    }
    if (measurement_method === 'ofc'){
      return 'cm';
    }
  }
  
  render() {
    return (
        <Container>
          <Segment>
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
                <h5>{this.state.observation_date_error}</h5>
              </Form.Field>
              <Segment>
                <Header as='h5' textAlign='left'>
                  Measurements
                </Header>
                { this.state.measurements.map((value)=>{
                  return <MeasurementInput 
                            key={value.id} 
                            name={value.measurement_method} 
                            id={value.id} 
                            measurementMethod={value.measurement_method} 
                            observationValue={value.observation_value} 
                            observationValueError={value.observation_value_error} 
                            units={value.units}
                            options={this.state.measurementOptions}
                            addButton={value.show_add}
                            removeButton={value.show_remove}
                            handleMeasurementChangeSelect={this.handleChangeSelect} 
                            handleObservationChange={this.handleChange} 
                            handleRemoveMeasurementButton={this.handleRemoveMeasurement} 
                            handleAddMeasurementButton={this.handleAddMeasurement}/>
                })}
              </Segment>
              <Form.Field required>
                <Select
                  name="sex" 
                  placeholder="Sex"
                  value={this.state.sex}
                  onChange={this.handleChangeSex}
                  options={sexOptions}/> 
              </Form.Field>
              <Form.Group widths='equal'>
                
                  <Form.Field required>
                    <Select
                    name='gestation_weeks'
                    value={this.state.gestation_weeks}
                    options={gestationWeeksOptions}
                    onChange={this.handleChangeGestation}/>
                  </Form.Field>
                
                  <Form.Field required>
                    <Select
                    name='gestation_days'
                    value={this.state.gestation_days}
                    options={gestationDaysOptions}
                    onChange={this.handleChangeGestation}/>
                  </Form.Field>

              </Form.Group>

              <Form.Field>
                <Button 
                  type="submit"
                  disabled={!this.state.form_valid}
                  color='green'
                  fluid
                >
                  Calculate
                </Button>
              </Form.Field>
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


