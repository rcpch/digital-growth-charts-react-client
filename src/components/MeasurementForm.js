import React from 'react';

import {
  Container,
  Segment,
  Form,
  Input,
  Select,
  Button,
  Header,
  Message,
} from 'semantic-ui-react';

const sexOptions = [
  { key: 'male', value: 'male', text: 'Boy', disabled: false },
  { key: 'female', value: 'female', text: 'Girl', disabled: false },
];

let gestationWeeksOptions = [];
let gestWeeks = 23;
while (gestWeeks <= 42) {
  gestationWeeksOptions.push({
    key: gestWeeks.toString(10),
    value: gestWeeks,
    text: gestWeeks.toString(10),
  });
  gestWeeks++;
}

const gestationDaysOptions = [
  { key: '0', value: 0, text: '0' },
  { key: '1', value: 1, text: '1' },
  { key: '2', value: 2, text: '2' },
  { key: '3', value: 3, text: '3' },
  { key: '4', value: 4, text: '4' },
  { key: '5', value: 5, text: '5' },
  { key: '6', value: 6, text: '6' },
];

const references = [
  { key: 'uk-who', value: 'uk-who', text: 'UK-WHO' },
  { key: 'trisomy-21', value: 'trisomy-21', text: "Down's Syndrome" },
  { key: 'turner', value: 'turner', text: "Turner's syndrome" },
];

const ROBERT_WADLOW = 272; // interesting fact - Robert Wadlow (22/2/1918 – 15/7/1940) was the world's tallest man
const JON_BROWER_MINNOCH = 635; // interesting fact -  Jon Brower Minnoch (Born USA) was the world's heaviest man
const KHALID_BIN_MOHSEN_SHAARI = 204; // Khalid bin Mohsen Shaari (2/8/1991) from Saudi Arabia had the highest recorded BMI

let measurementOptions = [
  { key: 'height', value: 'height', text: 'Height (cm)', disabled: false },
  { key: 'weight', value: 'weight', text: 'Weight (kg)', disabled: false },
  { key: 'bmi', value: 'bmi', text: 'BMI (kg/m²)', disabled: false },
  {
    key: 'ofc',
    value: 'ofc',
    text: 'Head Circumference (cm)',
    disabled: false,
  },
];

const formatDate = (inputDate) => {
  let date;
  let month;
  let day;
  let year;
  try {
    date = new Date(inputDate);
    month = '' + (date.getMonth() + 1);
    day = '' + date.getDate();
    year = date.getFullYear();
    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }

    return [year, month, day].join('-');
  } catch (error) {
    throw new Error('Input date for formatDate not recognised');
  }
};

const isValidDate = (inputDate) => {
  try {
    const workingDate = new Date(inputDate);
    if (typeof workingDate.getTime() === 'number') {
      return true;
    }
  } catch (error) {
    return false;
  }
};

class MeasurementForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      birth_date: formatDate(new Date()),
      observation_date: formatDate(new Date()),
      measurement: {
        observation_value: '',
        units: 'cm',
      },
      sex: 'male',
      gestation_weeks: 40,
      gestation_days: 0,
      birth_date_error: '',
      observation_date_error: '',
      observation_value_error: null,
      form_valid: false,
      measurementResult: [],
      reference: 'uk-who',
      measurementOptions: measurementOptions,
      sexOptions: sexOptions,
    };

    this.handleChangeDate = this.handleChangeDate.bind(this);
    this.handleChangeMeasurementMethod =
      this.handleChangeMeasurementMethod.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangeGestation = this.handleChangeGestation.bind(this);
    this.handleChangeSex = this.handleChangeSex.bind(this);
    this.handleObservationChange = this.handleObservationChange.bind(this);
    this.handleChangeReference = this.handleChangeReference.bind(this);
    this.handleResetCurrentGraph = this.handleResetCurrentGraph.bind(this);
    this.handleUndoLast = this.handleUndoLast.bind(this);
  }

  handleChangeReference = (ref, data) => {
    //call back, returns new sex if already measurements charted with different sex
    const callbackReturn = this.props.handleChangeReference(data.value);
    if (data.value === 'turner') {
      this.disableMeasurement('weight', true);
      this.disableMeasurement('ofc', true);
      this.disableMeasurement('bmi', true);
      const newSexOptions = [
        { ...this.state.sexOptions[0] },
        { ...this.state.sexOptions[1] },
      ];
      newSexOptions[0].disabled = true;
      this.setState({
        sex: 'female',
        observation_value_error: this.validateObservationValue(
          'height',
          this.state.measurement.observation_value
        ),
        reference: data.value,
        sexOptions: newSexOptions,
      });
      this.props.handleChangeSex('female', true);
      this.props.setMeasurementMethod('height');
    } else {
      this.disableMeasurement('weight', false);
      this.disableMeasurement('ofc', false);
      this.disableMeasurement('bmi', false);
      const newSexOptions = [
        { ...this.state.sexOptions[0] },
        { ...this.state.sexOptions[1] },
      ];
      newSexOptions[0].disabled = false;
      this.setState({
        observation_value_error: this.validateObservationValue(
          this.props.measurementMethod,
          this.state.measurement.observation_value
        ),
        sex: callbackReturn.newSex,
        reference: data.value,
        sexOptions: newSexOptions,
      });
    }
  };

  disableMeasurement = (measurement_method, disable) => {
    if (measurement_method === 'height') {
      let options = this.state.measurementOptions;
      options[0].disabled = disable;
      this.setState({ measurementOptions: options });
    }
    if (measurement_method === 'weight') {
      let options = this.state.measurementOptions;
      options[1].disabled = disable;
      this.setState({ measurementOptions: options });
    }
    if (measurement_method === 'ofc') {
      let options = this.state.measurementOptions;
      options[2].disabled = disable;
      this.setState({ measurementOptions: options });
    }
    if (measurement_method === 'bmi') {
      let options = this.state.measurementOptions;
      options[3].disabled = disable;
      this.setState({ measurementOptions: options });
    }
  };

  handleChangeDate(event) {
    this.setState({ [event.target.name]: event.target.value });
    if (isValidDate(event.target.value)) {
      const observation_date_object =
        event.target.name === 'birth_date'
          ? new Date(this.state.observation_date)
          : new Date(event.target.value);
      const birth_date_object =
        event.target.name === 'birth_date'
          ? new Date(event.target.value)
          : new Date(this.state.birth_date);
      const timeInterval =
        observation_date_object.getTime() - birth_date_object.getTime();
      if (timeInterval < 0) {
        if (event.target.name === 'birth_date') {
          this.setState({
            birth_date_error:
              'Date of birth cannot come after the date of measurement',
          });
        } else if (event.target.name === 'observation_date') {
          this.setState({
            observation_date_error:
              'Date of measurement cannot come before the date of birth.',
          });
        }
        this.setState({ form_valid: false });
      } else if (timeInterval > 631139040000) {
        if (event.target.name === 'birth_date') {
          this.setState({
            birth_date_error: 'No centile data exists over 20 years of age.',
          });
        } else if (event.target.name === 'observation_date') {
          this.setState({
            observation_date_error:
              'No centile data exists over 20 years of age.',
          });
        }
        this.setState({ form_valid: false });
      } else {
        this.setState({ birth_date_error: '' });
        this.setState({ observation_date_error: '' });
        if (
          this.state.observation_value_error === '' &&
          this.state.measurement.observation_value
        ) {
          this.setState({ form_valid: true });
        } else {
          this.setState({ form_valid: false });
        }
      }
    } else {
      this.setState({ form_valid: false });
    }
  }

  handleObservationChange = (observation, data) => {
    // this is updating an observation value

    const observation_value = data.value;
    let { measurement, observation_value_error } = this.state;
    measurement.observation_value = observation_value;
    observation_value_error = this.validateObservationValue(
      this.props.measurementMethod,
      observation_value
    );
    this.setState({
      measurement: measurement,
      observation_value_error: observation_value_error,
    });
    if (
      this.state.birth_date_error === '' &&
      this.state.observation_date_error === '' &&
      observation_value_error === ''
    ) {
      this.setState({ form_valid: true });
    } else {
      this.setState({ form_valid: false });
    }
  };

  validateObservationValue(measurement_method, observation_value) {
    if (observation_value === '') {
      return null;
    }
    if (Number.isNaN(Number(observation_value))) {
      return 'Please enter a valid number';
    }
    if (measurement_method === 'height') {
      if (observation_value < 20) {
        return 'The ' + measurement_method + ' you entered is too low.';
      } else if (observation_value > ROBERT_WADLOW) {
        return 'The ' + measurement_method + ' you entered is too tall.';
      } else {
        return '';
      }
    }
    if (measurement_method === 'weight') {
      if (observation_value < 0.01) {
        return 'The ' + measurement_method + ' you entered is too low.';
      } else if (observation_value > JON_BROWER_MINNOCH) {
        return 'The ' + measurement_method + ' you entered is too heavy.';
      } else {
        return '';
      }
    }
    if (measurement_method === 'bmi') {
      if (observation_value < 5) {
        return 'The ' + measurement_method + ' you entered is too low.';
      } else if (observation_value > KHALID_BIN_MOHSEN_SHAARI) {
        return 'The ' + measurement_method + ' you entered is too high.';
      } else {
        return '';
      }
    }
    if (measurement_method === 'ofc') {
      if (observation_value < 30) {
        return 'The ' + measurement_method + ' you entered is too low.';
      } else if (observation_value > 70) {
        return 'The ' + measurement_method + ' you entered is too high.';
      } else {
        return '';
      }
    }
  }

  formIsValid() {
    if (
      this.state.reference === 'turner' &&
      this.props.measurementMethod !== 'height'
    ) {
      return false;
    }
    if (
      this.state.birth_date_error === '' &&
      this.state.observation_date_error === '' &&
      this.state.observation_value_error === ''
    ) {
      return true;
    }
  }

  handleSubmit(event) {
    // passes the form data back to the parent (measurement segment)
    const measurementArray = [];
    const formData = {
      birth_date: this.state.birth_date,
      observation_date: this.state.observation_date,
      measurement_method: this.props.measurementMethod,
      observation_value: this.state.measurement.observation_value,
      gestation_weeks: this.state.gestation_weeks,
      gestation_days: this.state.gestation_days,
      sex: this.state.sex,
    };
    measurementArray.push(formData);
    this.props.measurementResult(measurementArray);
  }

  handleChangeMeasurementMethod(event, data) {
    let measurement = { ...this.state.measurement };
    if (data.value !== this.props.measurementMethod) {
      measurement.units = this.changeUnits(data.value);
      this.props.setMeasurementMethod(data.value);
      this.setState({
        measurement: measurement,
        observation_value_error: this.validateObservationValue(
          data.value,
          measurement.observation_value
        ),
      });
      if (
        this.state.reference === 'turner' &&
        this.props.measurementMethod !== 'height'
      ) {
        this.disableMeasurement('weight', true);
        this.disableMeasurement('bmi', true);
        this.disableMeasurement('ofc', true);
      } else {
        this.disableMeasurement('weight', false);
        this.disableMeasurement('bmi', false);
        this.disableMeasurement('ofc', false);
      }
    }
  }

  handleChangeGestation(event, data) {
    const { name, value } = data;
    if (name === 'gestation_weeks') {
      this.setState({ gestation_weeks: value });
      if (value === 42) {
        this.setState({ gestation_days: 0 });
      }
    } else if (name === 'gestation_days') {
      if (this.state.gestation_weeks === 42) {
        this.setState({ gestation_days: 0 });
      } else {
        this.setState({ gestation_days: value });
      }
    }
  }

  handleChangeSex(event, data, isTurner = false) {
    const success = this.props.handleChangeSex(data.value, isTurner);
    if (success) {
      this.setState({ sex: data.value });
    }
  }

  changeUnits(measurement_method) {
    if (measurement_method === 'height') {
      return 'cm';
    }
    if (measurement_method === 'weight') {
      return 'kg';
    }
    if (measurement_method === 'bmi') {
      return 'kg/m²';
    }
    if (measurement_method === 'ofc') {
      return 'cm';
    }
  }

  handleResetCurrentGraph() {
    this.props.setCommands((old) => {
      return { ...old, resetCurrent: true };
    });
  }

  handleUndoLast() {
    this.props.setCommands((old) => {
      return { ...old, undoLast: true };
    });
  }

  componentDidUpdate() {
    if (this.state.form_valid !== this.formIsValid()) {
      this.setState({ form_valid: this.formIsValid() });
    }
    if (this.props.commands.clearMeasurement) {
      const newMeasurement = { ...this.state.measurement };
      newMeasurement.observation_value = '';
      this.setState({
        measurement: newMeasurement,
        observation_value_error: null,
        form_valid: false,
      });
      this.props.setCommands((old) => {
        return { ...old, clearMeasurement: false };
      });
    }
  }

  render() {
    return (
      <Container>
        <Segment textAlign={'center'}>
          <Form onSubmit={this.handleSubmit}>
            <Form.Field>
              <Header as="h5" textAlign="left">
                Reference
              </Header>
              <Select
                name="reference"
                value={this.state.reference}
                options={references}
                onChange={this.handleChangeReference}
                placeholder="Select reference"
              />
            </Form.Field>
            <Form.Field required>
              <Header as="h5" textAlign="left">
                Dates
              </Header>
              <Input
                label="Birth Date"
                type="date"
                name="birth_date"
                value={this.state.birth_date}
                placeholder="Date of Birth"
                onChange={this.handleChangeDate}
              />
            </Form.Field>
            <Form.Field required>
              <Input
                label="Measurement Date"
                type="date"
                name="observation_date"
                value={this.state.observation_date}
                placeholder="Date of Measurement"
                onChange={this.handleChangeDate}
              />
            </Form.Field>
            {/* <Segment> */}
            <Header as="h5" textAlign="left">
              Measurements
            </Header>

            <Form.Group>
              <Form.Field required>
                <Select
                  value={this.props.measurementMethod}
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
                  value={this.state.measurement.observation_value}
                  label={{
                    content: this.state.measurement.units.toString(),
                    basic: true,
                    color: 'blue',
                  }}
                  labelPosition="right"
                  onChange={this.handleObservationChange}
                />
              </Form.Field>
            </Form.Group>
            {this.state.observation_value_error ? (
              <Message color="red">
                {this.state.observation_value_error}
              </Message>
            ) : null}
            {this.state.observation_date_error ? (
              <Message color="red">{this.state.observation_date_error}</Message>
            ) : null}
            {this.state.birth_date_error ? (
              <Message color="red">{this.state.birth_date_error}</Message>
            ) : null}
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
                options={this.state.sexOptions}
              />
            </Form.Field>

            <Form.Group>
              <Form.Field>
                <Header as="h5" textAlign="left">
                  Gestation
                </Header>
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
                content="Calculate Centiles and Add To Chart"
                type="submit"
                fluid
                disabled={!this.state.form_valid}
                color="pink"
                icon="line graph"
                labelPosition="right"
              />
            </Form.Field>
          </Form>
          <Segment>
            <Button
              content="Reset Graph"
              icon="power off"
              onClick={this.handleResetCurrentGraph}
            />
            <Button
              content="Remove Last"
              icon="undo"
              onClick={this.handleUndoLast}
            />
          </Segment>
        </Segment>
      </Container>
    );
  }
}

export default MeasurementForm;
