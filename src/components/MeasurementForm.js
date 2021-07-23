import React from 'react';

import {
  Container,
  Segment,
  Form,
  Input,
  Button,
  Header,
  Message,
} from 'semantic-ui-react';
import GestationSelect from './subcomponents/GestationSelect';
import MeasurementMethodSelect from './subcomponents/MeasurementMethodSelect';
import ReferenceSelect from './subcomponents/ReferenceSelect';
import SexSelect from './subcomponents/SexChoice';
import measurementOptions from '../selectData/measurementOptions';
import sexOptions from '../selectData/sexOptions';
import referenceOptions from '../selectData/referenceOptions';

const ROBERT_WADLOW = 272; // interesting fact - Robert Wadlow (22/2/1918 – 15/7/1940) was the world's tallest man
const JON_BROWER_MINNOCH = 635; // interesting fact -  Jon Brower Minnoch (Born USA) was the world's heaviest man
const KHALID_BIN_MOHSEN_SHAARI = 204; // Khalid bin Mohsen Shaari (2/8/1991) from Saudi Arabia had the highest recorded BMI

const formatDate = (inputDate) => {
  let date;
  let month;
  let day;
  let year;
  try {
    inputDate.getTime();
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

const parseDate = (inputDate) => {
  const isDaysInMonthValid = (parsedArray) => {
    const [jsYear, jsMonth, jsDay] = parsedArray;
    if (jsMonth === 1 && jsDay === 29) {
      if (jsYear % 4 === 0) {
        return true;
      } else {
        return false;
      }
    } else {
      const daysInMonthLookup = [
        31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31,
      ];
      const validMaxDaysInMonth = daysInMonthLookup[jsMonth];
      if (validMaxDaysInMonth !== undefined && jsDay <= validMaxDaysInMonth) {
        return true;
      } else {
        return false;
      }
    }
  };
  try {
    const dateArray = inputDate.split('-');
    const workingArray = dateArray.map((element, index) => {
      if (element !== '') {
        const madeNumber = Number(element);
        if (Number.isNaN(madeNumber)) {
          throw new Error();
        } else {
          return index === 1 ? madeNumber - 1 : madeNumber;
        }
      } else {
        throw new Error();
      }
    });
    if (
      workingArray.length !== 3 ||
      workingArray[1] < 0 ||
      workingArray[1] > 11 ||
      workingArray[2] < 1 ||
      workingArray[2] > 31
    ) {
      throw new Error();
    }
    if (isDaysInMonthValid(workingArray)) {
      return new Date(...workingArray);
    } else {
      throw new Error();
    }
  } catch (error) {
    return null;
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
      gestation_weeks: 40,
      gestation_days: 0,
      birth_date_error: '',
      observation_date_error: '',
      observation_value_error: 'empty',
      form_valid: false,
      measurementResult: [],
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

  handleChangeReference = ({ value }) => {
    this.props.updateGlobalState('reference', value);
  };

  handleChangeDate(event) {
    this.setState({ [event.target.name]: event.target.value });
    const newDate = parseDate(event.target.value);
    if (newDate) {
      const observation_date_object =
        event.target.name === 'birth_date'
          ? parseDate(this.state.observation_date)
          : newDate;
      const birth_date_object =
        event.target.name === 'birth_date'
          ? newDate
          : parseDate(this.state.birth_date);
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
      } else if (timeInterval > 631139040000) {
        this.setState({
          [`${event.target.name}_error`]:
            'No centile data exists over 20 years of age.',
        });
      } else {
        this.setState({ birth_date_error: '', observation_date_error: '' });
      }
    } else {
      this.setState({
        [`${event.target.name}_error`]: 'Please enter a valid date.',
      });
    }
  }

  handleObservationChange = (observation, data) => {
    // this is updating an observation value
    const observation_value = data.value;
    let { measurement, observation_value_error } = this.state;
    measurement.observation_value = observation_value;
    measurement.units = this.changeUnits(this.props.globalState.measurementMethod);
    observation_value_error = this.validateObservationValue(
      this.props.globalState.measurementMethod,
      observation_value
    );
    this.setState({
      measurement: measurement,
      observation_value_error: observation_value_error,
    });
  };

  validateObservationValue(measurement_method, observation_value) {
    if (observation_value === '') {
      return 'empty';
    }
    if (Number.isNaN(Number(observation_value))) {
      return 'Please enter a valid number.';
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
      if (observation_value < 25) {
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
      this.state.birth_date_error === '' &&
      this.state.observation_date_error === '' &&
      this.state.observation_value_error === ''
    ) {
      return true;
    }
  }

  handleSubmit() {
    // passes the form data back to the parent (measurement segment)
    const formData = {
      birth_date: this.state.birth_date,
      observation_date: this.state.observation_date,
      measurement_method: this.props.globalState.measurementMethod,
      observation_value: this.state.measurement.observation_value,
      gestation_weeks: this.state.gestation_weeks,
      gestation_days: this.state.gestation_days,
      sex: this.props.globalState.sex,
    };
    this.props.handleMeasurementResult(formData);
  }

  handleChangeMeasurementMethod(newMeasurementMethod) {
    this.props.updateGlobalState('measurementMethod', newMeasurementMethod);
    this.props.updateGlobalState('units', this.changeUnits(newMeasurementMethod));
  }

  handleChangeGestation(data) {
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

  handleChangeSex(val) {
    this.props.updateGlobalState('sex', val.value);
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
    this.props.updateGlobalState('resetCurrent', true);
  }

  handleUndoLast() {
    this.props.updateGlobalState('undoLast', true);
  }

  componentDidUpdate() {
    if (this.state.form_valid !== this.formIsValid()) {
      this.setState({ form_valid: this.formIsValid() });
    }
    if (this.props.globalState.clearMeasurement) {
      const newMeasurement = { ...this.state.measurement };
      newMeasurement.observation_value = '';
      this.setState({
        measurement: newMeasurement,
        observation_value_error: 'empty',
        form_valid: false,
      });
      this.props.updateGlobalState('clearMeasurement', false);
    }
  }

  render() {
    const makeDynamic = (option) => {
      const newDisabled = this.props.globalState.disabled[option.key];
      return { ...option, disabled: newDisabled };
    };
    const dynamicMeasurementOptions = measurementOptions.map(makeDynamic);

    const dynamicSexOptions = sexOptions.map(makeDynamic);

    return (
      <Container>
        <Segment textAlign={'center'}>
          <Form onSubmit={this.handleSubmit}>
            <Form.Field>
              <Header as="h5" textAlign="left">
                Reference
              </Header>
              <ReferenceSelect
                reference={this.props.globalState.reference}
                handleChangeReference={this.handleChangeReference}
                referenceOptions={referenceOptions}
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
                <MeasurementMethodSelect
                  measurementMethod={this.props.globalState.measurementMethod}
                  handleChangeMeasurementMethod={
                    this.handleChangeMeasurementMethod
                  }
                  measurementOptions={dynamicMeasurementOptions}
                />
              </Form.Field>
              <Form.Field required width={8}>
                <Input
                  type="decimal"
                  name="observation_value"
                  placeholder="Measurement"
                  value={this.state.measurement.observation_value}
                  label={{
                    content: this.props.globalState.units.toString(),
                    basic: true,
                    color: 'blue',
                  }}
                  labelPosition="right"
                  onChange={this.handleObservationChange}
                />
              </Form.Field>
            </Form.Group>
            {this.state.observation_value_error &&
              this.state.observation_value_error !== 'empty' && (
                <Message color="red">
                  {this.state.observation_value_error}
                </Message>
              )}
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
              <SexSelect
                sex={this.props.globalState.sex}
                handleSexChange={this.handleChangeSex}
                sexOptions={dynamicSexOptions}
              />
            </Form.Field>
            <Form.Group>
              <Form.Field>
                <Header as="h5" textAlign="left">
                  Gestation
                </Header>
                <GestationSelect
                  name="gestation_select"
                  weeks={this.state.gestation_weeks}
                  days={this.state.gestation_days}
                  handleGestationChange={this.handleChangeGestation}
                />
              </Form.Field>
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
          {this.props.globalState.isDataPresent && (
            <Segment>
              <Button
                content="Reset Chart"
                icon="power off"
                onClick={this.handleResetCurrentGraph}
              />
              <Button
                content="Remove Last"
                icon="undo"
                onClick={this.handleUndoLast}
              />
            </Segment>
          )}
        </Segment>
      </Container>
    );
  }
}

export default MeasurementForm;
