import React from "react";
import axios from "axios";

import {
  Container,
  Segment,
  Form,
  Input,
  Select,
  Button,
  Header,
  Message,
  Modal
} from "semantic-ui-react";
import moment from "moment";


const sexOptions = [
  { key: "male", value: "male", text: "Boy" },
  { key: "female", value: "female", text: "Girl" },
];
const gestationWeeksOptions = [
  { key: "23", value: 23, text: "23" },
  { key: "24", value: 24, text: "24" },
  { key: "25", value: 25, text: "25" },
  { key: "26", value: 26, text: "26" },
  { key: "27", value: 27, text: "27" },
  { key: "28", value: 28, text: "28" },
  { key: "29", value: 29, text: "29" },
  { key: "30", value: 30, text: "30" },
  { key: "31", value: 31, text: "31" },
  { key: "32", value: 32, text: "32" },
  { key: "33", value: 33, text: "33" },
  { key: "34", value: 34, text: "34" },
  { key: "35", value: 35, text: "35" },
  { key: "36", value: 36, text: "36" },
  { key: "37", value: 37, text: "37" },
  { key: "38", value: 38, text: "38" },
  { key: "39", value: 39, text: "39" },
  { key: "40", value: 40, text: "40" },
  { key: "41", value: 41, text: "41" },
  { key: "42", value: 42, text: "42" },
];

const gestationDaysOptions = [
  { key: "0", value: 0, text: "0" },
  { key: "1", value: 1, text: "1" },
  { key: "2", value: 2, text: "2" },
  { key: "3", value: 3, text: "3" },
  { key: "4", value: 4, text: "4" },
  { key: "5", value: 5, text: "5" },
  { key: "6", value: 6, text: "6" },
];

const references = [
  { key: 'uk-who', value: 'uk-who', text: 'UK-WHO'},
  { key: 'turner', value: 'turner', text: 'Turner\'s syndrome' },
  { key: 'trisomy-21', value: 'trisomy-21', text: 'Down\'s Syndrome' }
]

const ROBERT_WADLOW = 272; // interesting fact - Robert Wadlow (22/2/1918 – 15/7/1940) was the world's tallest man
const JON_BROWER_MINNOCH = 635; // interesting fact -  Jon Brower Minnoch (Born USA) was the world's heaviest man
const KHALID_BIN_MOHSEN_SHAARI = 204; // Khalid bin Mohsen Shaari (2/8/1991) from Saudi Arabia had the highest recorded BMI

// const measurementMethods = ["height", "weight", "bmi", "ofc"];

let measurementOptions = [
  {key: 'height', value: 'height', text: 'Height (cm)', disabled: false },
  {key: 'weight', value: 'weight', text: 'Weight (kg)', disabled: false },
  {key: 'bmi', value: 'bmi', text: 'BMI (kg/m²)', disabled: false },
  {key: 'ofc', value: 'ofc', text: 'Head Circumference (cm)', disabled: false }
];

class MeasurementForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      birth_date: moment(new Date()).format("YYYY-MM-DD"),
      observation_date: moment(new Date()).format("YYYY-MM-DD"),
      measurement: 
        {
          measurement_method: "height",
          observation_value: 0,
          units: "cm",
          show_add: true,
          show_remove: false,
          disabled: false
        },
      sex: "male",
      gestation_weeks: 40,
      gestation_days: 0,
      birth_date_error: "",
      observation_date_error: "",
      observation_value_error: "",
      form_valid: false,
      formData: {},
      measurementResult: [],
      reference: 'uk-who',
      measurementOptions: measurementOptions,
      networkError: '',
      modalOpen: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleChangeMeasurementMethod = this.handleChangeMeasurementMethod.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangeGestation = this.handleChangeGestation.bind(this);
    this.handleChangeSex = this.handleChangeSex.bind(this);
    this.handleObservationChange = this.handleObservationChange.bind(this);
    this.handleChangeReference = this.handleChangeReference.bind(this);
  }

  handleGrowthResults = (results) => {
    this.props.measurementResult(results)
  }

  handleChangeReference = (ref, data) => {

    this.setState({reference: data.value})
    
    if (data.value === "turner"){
        this.disableMeasurement("weight", true)
        this.disableMeasurement("ofc", true)
        this.disableMeasurement("bmi", true)
        this.setState({sex: "female"})
        this.setState({measurementMethod: "height"})
        this.props.handleChangeReference(data.value) //call back
        return
    } 
    if (data.value === "uk-who"){
        this.disableMeasurement("weight", false)
        this.disableMeasurement("ofc", false)
        this.disableMeasurement("bmi", false)
        this.props.handleChangeReference(data.value) //call back
        return
    } 
    if (data.value === "trisomy-21"){
      this.disableMeasurement("weight", false)
      this.disableMeasurement("ofc", false)
      this.disableMeasurement("bmi", false)
      this.props.handleChangeReference(data.value) //call back
      return
  }
}

  handleFormData = async (formDataArray) => {
    this.setState({
      formData: formDataArray,
    });

    let resultsPromiseArray = [];
  
    formDataArray.forEach((formData) => {
      let axiosFormData = {
        birth_date: formData.birth_date,
        observation_date: formData.observation_date,
        sex: formData.sex,
        gestation_weeks: formData.gestation_weeks,
        gestation_days: formData.gestation_days,
        measurement_method: formData.measurement_method,
        observation_value: formData.observation_value,
      };

      
      const  centile = this.fetchCentilesForMeasurement(axiosFormData, this.state.reference);
      
      resultsPromiseArray.push(centile);
    });
    Promise.all(resultsPromiseArray).then((result) => {
      var mergedMeasurementArrays = [].concat.apply([], result);
      this.handleGrowthResults(mergedMeasurementArrays)
    }).catch(error => {
      this.setState({networkError: error.message})
      this.setState({modalOpen: true})
    });
  };

  disableMeasurement=(measurement_method, disable)=>{
    if (measurement_method === "height"){
      let options = this.state.measurementOptions
      options[0].disabled=disable
      this.setState({measurementOptions: options})
    }
    if (measurement_method === "weight"){
      let options = this.state.measurementOptions
      options[1].disabled=disable
      this.setState({measurementOptions: options})
    }
    if (measurement_method === "ofc"){
      let options = this.state.measurementOptions
      options[2].disabled=disable
      this.setState({measurementOptions: options})
    }
    if (measurement_method === "bmi"){
      let options = this.state.measurementOptions
      options[3].disabled=disable
      this.setState({measurementOptions: options})
    }
  }



  async fetchCentilesForMeasurement(payload, reference) {

    let url
    if (reference === "uk-who"){
      url = `${process.env.REACT_APP_GROWTH_API_BASEURL}/uk-who/calculation`
    }
    if (reference === "turner"){
      url = `${process.env.REACT_APP_GROWTH_API_BASEURL}/turner/calculation`
    }
    if (reference === "trisomy-21"){
      url = `${process.env.REACT_APP_GROWTH_API_BASEURL}/trisomy-21/calculation`
    }

    const response = await axios({
      url: url,
      data: payload,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  }


  handleChange(event) {
    if (event.target.name === "birth_date") {
      var observation_moment = moment(this.state.observation_date);
      var birth_moment = moment(event.target.value);
      if (birth_moment.isAfter(observation_moment)) {
        this.setState({
          birth_date_error:
            "Date of birth cannot come after the date of measurement",
        });
      } else {
        this.setState({ birth_date_error: "" });
        this.setState({ observation_date_error: "" });
        this.setState({ [event.target.name]: event.target.value });
      }
    } 
    if (event.target.name === "observation_date") {
      birth_moment = moment(this.state.birth_date);
      observation_moment = moment(event.target.value);
      if (birth_moment.isAfter(observation_moment)) {
        this.setState({
          observation_date_error:
            "Date of measurement cannot come before the date of birth.",
        });
      } else {
        this.setState({ observation_date_error: "" });
        this.setState({ birth_date_error: "" });
        this.setState({ [event.target.name]: event.target.value });
      }
    }
    var form_valid = this.formIsValid();
    this.setState({ form_valid: form_valid });
}

  handleObservationChange=(observation, data)=>{
     // this is updating an observation value
     
     const observation_value = data.value
     let {measurement, observation_value_error} = this.state
     measurement.observation_value = observation_value
     observation_value_error = this.validateObservationValue(this.state.measurement.measurement_method, observation_value)
     this.setState({measurement: measurement, observation_value_error: observation_value_error})
     if (this.state.birth_date_error === "" && this.state.observation_date_error === "" && observation_value_error===""){
      this.setState({form_valid: true})
     } else {
       this.setState({form_valid: false})
     }
  }

  validateObservationValue(measurement_method, observation_value) {
    if (measurement_method === "height") {
      if (observation_value < 35) {
        return "The " + measurement_method + " you entered is too low.";
      } else if (observation_value > ROBERT_WADLOW) {
        return "The " + measurement_method + " you entered is too tall.";
      } else {
        return "";
      }
    }
    if (measurement_method === "weight") {
      if (observation_value < 0.01) {
        return "The " + measurement_method + " you entered is too low.";
      } else if (observation_value > JON_BROWER_MINNOCH) {
        return "The " + measurement_method + " you entered is too heavy.";
      } else {
        return "";
      }
    }
    if (measurement_method === "bmi") {
      if (observation_value < 5) {
        return "The " + measurement_method + " you entered is too low.";
      } else if (observation_value > KHALID_BIN_MOHSEN_SHAARI) {
        return "The " + measurement_method + " you entered is too high.";
      } else {
        return "";
      }
    }
    if (measurement_method === "ofc") {
      if (observation_value < 30) {
        return "The " + measurement_method + " you entered is too low.";
      } else if (observation_value > 70) {
        return "The " + measurement_method + " you entered is too high.";
      } else {
        return "";
      }
    }
  }

  formIsValid() {
    let valid = true;
      if (this.state.observation_value_error !== "") {
        console.log(this.state.observation_value_error);
        valid = false;
      }
    if (
      this.state.birth_date_error === null &&
      this.state.observation_date_error === null &&
      valid
    ) {
      return true;
    } else {
      return false;
    }
  }

  handleSubmit(event) {
    let measurementArray = [];
    
      let formData = {
        birth_date: this.state.birth_date,
        observation_date: this.state.observation_date,
        measurement_method: this.state.measurement.measurement_method,
        observation_value: this.state.measurement.observation_value,
        gestation_weeks: this.state.gestation_weeks,
        gestation_days: this.state.gestation_days,
        sex: this.state.sex,
      };
      measurementArray.push(formData);
  
    this.handleFormData(measurementArray);
  }

  handleChangeMeasurementMethod(event, data) {
    
    let measurement = this.state.measurement;
    
      this.props.handleChangeMeasurementMethod(data.value)
      if (data.value !== measurement.measurement_method) {
        measurement.measurement_method = data.value;
        measurement.units = this.changeUnits(data.value);
        if (this.state.reference==="turner"&& measurement.measurement_method !== "height"){
          this.disableMeasurement("weight", true)
          this.disableMeasurement("bmi", true)
          this.disableMeasurement("ofc", true)
        }else{
          this.disableMeasurement("weight", false)
          this.disableMeasurement("bmi", false)
          this.disableMeasurement("ofc", false)
        }
      }
    this.setState({measurement: measurement})
    this.setState({ form_valid: this.formIsValid() });
  }

  handleChangeGestation(event, data) {
    const { name, value } = data;
    if (name === "gestation_weeks") {
      this.setState({ gestation_weeks: value });
      if (value === 42) {
        this.setState({ gestation_days: 0 });
      }
    } else if (name === "gestation_days") {
      if (this.state.gestation_weeks === 42) {
        this.setState({ gestation_days: 0 });
      } else {
        this.setState({ gestation_days: value });
      }
    }
  }

  handleChangeSex(event, data) {
    this.setState({ sex: data.value });
    this.props.handleChangeSex(data.value)
  }

  changeUnits(measurement_method) {
    if (measurement_method === "height") {
      return "cm";
    }
    if (measurement_method === "weight") {
      return "kg";
    }
    if (measurement_method === "bmi") {
      return "kg/m²";
    }
    if (measurement_method === "ofc") {
      return "cm";
    }
  }

  render() {
    return (
      <Container>
        <Segment textAlign={"center"}>
          <Form onSubmit={this.handleSubmit}>
            <Form.Field>
            <Header as="h5" textAlign="left">
                  Reference</Header>
              <Select
              name='reference'
              value={this.state.reference}
              options={references}
              onChange={this.handleChangeReference}
              placeholder="Select reference"
            />
            </Form.Field>
            <Form.Field required>
            <Header as="h5" textAlign="left">
                  Dates</Header>
              <Input
                label="Birth Date"
                type="date"
                name="birth_date"
                value={this.state.birth_date}
                placeholder="Date of Birth"
                onChange={this.handleChange}
              />
              <div>{this.state.birth_date_error}</div>
            </Form.Field>
            <Form.Field required>
              <Input
                label="Measurement Date"
                type="date"
                name="observation_date"
                value={this.state.observation_date}
                placeholder="Date of Measurement"
                onChange={this.handleChange}
              />
            </Form.Field>
            {/* <Segment> */}
              <Header as="h5" textAlign="left">
                Measurements
              </Header>
              
              <Form.Group>
                <Form.Field required >
                  <Select
                    value={this.state.measurement.measurement_method}
                    name="measurement_method"
                    placeholder="Measurement Type"
                    options={measurementOptions}
                    onChange={this.handleChangeMeasurementMethod}
                    /> 
                </Form.Field>
                <Form.Field required width={8}>
                  <Input
                    type="decimal" 
                    name="observation_value"
                    placeholder="Measurement"
                    value={this.state.measurement.observationValue}
                    label={{ content: this.state.measurement.units.toString(), basic:true, color: 'blue' }}
                    labelPosition='right'
                    onChange={this.handleObservationChange}
                  />
                </Form.Field>
              
            </Form.Group>
            { this.state.observation_value_error !== "" ? <Message color='red'>{ this.state.observation_value_error }</Message> : null }
            { this.state.observation_date_error !== "" ? <Message color='red'>{ this.state.observation_date_error }</Message> : null }
            { this.state.birth_date_error !== "" ? <Message color='red'>{ this.state.birth_date_error }</Message> : null }
            {/* </Segment> */}
            <Header as="h5" textAlign="left">
                Sex
              </Header>
            <Form.Field required>
              <Select
                name="sex"
                placeholder="Sex"
                value={this.state.sex}
                onChange={this.handleChangeSex}
                options={sexOptions}
              />
            </Form.Field>

            <Form.Group >
              <Form.Field>
                <Header as="h5" textAlign="left">
                  Gestation</Header>
                <span>
                <Select
                  compact
                  name="gestation_weeks"
                  value={this.state.gestation_weeks}
                  options={gestationWeeksOptions}
                  onChange={this.handleChangeGestation}
                />
                &nbsp;+
                <Select
                  compact
                  name="gestation_days"
                  value={this.state.gestation_days}
                  options={gestationDaysOptions}
                  onChange={this.handleChangeGestation}
                />
                &nbsp; weeks
                </span>
               </Form.Field>
              {/* </Segment> */}
            </Form.Group>

            <Form.Field>
              <Button
                content="Calculate Centiles and Create Chart"
                type="submit"
                fluid={true}
                disabled={!this.state.form_valid}
                color="pink"
                icon="line graph"
                labelPosition="right"
              />
            </Form.Field>
          </Form>
        </Segment>
        <ErrorModal 
          error={this.state.networkError} 
          open={this.state.modalOpen}
          handleClose={
            () => {
              this.setState({ modalOpen: false })
            }
          }
        />
      </Container>
    );
  }
}

const ErrorModal = (props) =>{
  return (
    <Modal
          error={props.error}
          open={props.open}
          size='small'
          closeOnEscape={true}
    >
      <Modal.Header>{props.error}</Modal.Header>
      <Modal.Content>It is likely the server is down. Please check back later</Modal.Content>
      <Modal.Actions>
        <Button negative onClick={props.handleClose}>
          Cancel
        </Button>
      </Modal.Actions>
    </Modal>
  )
}

export default MeasurementForm;
