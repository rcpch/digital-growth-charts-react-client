import React, { useState, useEffect } from 'react';

import { Form, Input, Header, Checkbox, Button } from 'semantic-ui-react';

import GestationSelect from './subcomponents/GestationSelect';
import IntervalTypeSelect from './subcomponents/IntervalSelect';
import MeasurementMethodSelect from './subcomponents/MeasurementMethodSelect';
import ReferenceSelect from './subcomponents/ReferenceSelect';
import SexSelect from './subcomponents/SexChoice';
import Slider from './subcomponents/Slider';

import referenceOptions from '../selectData/referenceOptions';
import sexOptions from '../selectData/sexOptions';
import measurementOptions from '../selectData/measurementOptions';
import intervalOptions from '../selectData/intervalOptions';
import ErrorText from './subcomponents/ErrorText';

const FictionalChildForm = (props) => {
  const [weeks, setWeeks] = useState(40);
  const [days, setDays] = useState(0);
  const [startingAge, setStartingAge] = useState('1');
  const [endingAge, setEndingAge] = useState('20');
  const [intervalType, setIntervalType] = useState('years');
  const [interval, setInterval] = useState('1');
  const [driftFlag, setDriftFlag] = useState(false);
  const [drift, setDrift] = useState(0.01);
  const [noiseFlag, setNoiseFlag] = useState(false);
  const [noise, setNoise] = useState(1.0); // note this is a percentage must be converted back to a decimal for the API
  const [startSDS, setStartSDS] = useState('0');
  const [errorMessage, setErrorMessage] = useState('');

  const handleBigButtonPress = ({ type }) => {
    if (type === 'submit') {
      const values = {
        measurement_method: props.globalState.measurementMethod,
        sex: props.globalState.sex,
        start_chronological_age: startingAge,
        end_age: endingAge,
        gestation_weeks: weeks,
        gestation_days: days,
        measurement_interval_type: intervalType,
        measurement_interval_number: interval,
        start_sds: startSDS,
        noise: noiseFlag,
        drift_range: drift,
        drift: driftFlag,
        noise_range: noise,
        reference: props.globalState.reference,
      };
      props.fictionalFormDataSubmit(values);
    } else {
      props.updateGlobalState('resetCurrent', true);
    }
  };

  const handleChangeReference = (val) => {
    props.updateGlobalState('reference', val.value);
  };

  const handleChangeMeasurementMethod = (val) => {
    props.updateGlobalState('measurementMethod', val);
  };

  const handleSexChange = (val) => {
    props.updateGlobalState('sex', val.value);
  };

  const handleGestationChange = ({ name, value }) => {
    if (name === 'gestation_weeks') {
      setWeeks(value);
      if (value === 42) {
        setDays(0);
      }
    } else if (name === 'gestation_days') {
      if (weeks === 42) {
        setDays(0);
      } else {
        setDays(value);
      }
    }
  };

  const handleObservationChange = (e, { name, value }) => {
    if (name === 'start_age') {
      setStartingAge(value);
    }
    if (name === 'end_age') {
      setEndingAge(value);
    }
    if (name === 'interval_value') {
      setInterval(value);
    }
    if (name === 'startSDS') {
      setStartSDS(value);
    }
  };

  const handleChangeIntervalType = (e, { value }) => {
    setIntervalType(value);
  };

  const handleSDSDriftChange = (e, { checked }) => {
    setDriftFlag(checked);
  };

  const handleDriftChange = (val) => {
    setDrift(val);
  };

  const handleNoiseChange = (val) => {
    setNoise(val);
  };

  const handleNoiseFlag = (e, { checked }) => {
    setNoiseFlag(checked);
  };

  const makeDynamic = (option) => {
    const newDisabled = props.globalState.disabled[option.key];
    return { ...option, disabled: newDisabled };
  };

  const dynamicMeasurementOptions = measurementOptions.map(makeDynamic);

  const dynamicSexOptions = sexOptions.map(makeDynamic);

  useEffect(() => {
    switch (true) {
      case Number(startingAge) < 0:
        setErrorMessage('Starting age must be above 0.');
        break;
      case Number(endingAge) > 20:
        setErrorMessage('Ending age must be under 20.');
        break;
      case Number.isNaN(Number(startingAge)):
      case Number.isNaN(Number(endingAge)):
      case Number.isNaN(Number(interval)):
      case Number.isNaN(Number(startSDS)):
        setErrorMessage('Please check that all entries have valid numbers.');
        break;
      case startingAge === '':
      case endingAge === '':
      case interval === '':
      case startSDS === '':
        setErrorMessage('Please check that all entries are filled in.');
        break;
      default:
        setErrorMessage('');
    }
  }, [startingAge, endingAge, interval, startSDS]);

  return (
    <Form onSubmit={handleBigButtonPress}>
      <Form.Field>
        <ReferenceSelect
          handleChangeReference={handleChangeReference}
          reference={props.globalState.reference}
          referenceOptions={referenceOptions}
        />
      </Form.Field>
      <Form.Field>
        <MeasurementMethodSelect
          handleChangeMeasurementMethod={handleChangeMeasurementMethod}
          measurementMethod={props.globalState.measurementMethod}
          measurementOptions={dynamicMeasurementOptions}
        />
      </Form.Field>
      <Form.Field>
        <SexSelect
          handleSexChange={handleSexChange}
          sex={props.globalState.sex}
          sexOptions={dynamicSexOptions}
        />
      </Form.Field>
      <Form.Field>
        <GestationSelect
          handleGestationChange={handleGestationChange}
          weeks={weeks}
          days={days}
        />
      </Form.Field>
      <Header as="h5" textAlign={'left'}>
        Ages
      </Header>
      <Form.Field>
        <Input
          type="decimal"
          name="start_age"
          placeholder="Starting Decimal Age"
          value={startingAge}
          label={{
            content: 'years',
            basic: true,
            color: 'blue',
          }}
          labelPosition="right"
          onChange={handleObservationChange}
        ></Input>
      </Form.Field>
      <Form.Field>
        <Input
          type="decimal"
          name="end_age"
          placeholder="Ending Decimal Age"
          value={endingAge}
          label={{
            content: 'years',
            basic: true,
            color: 'blue',
          }}
          labelPosition="right"
          onChange={handleObservationChange}
        ></Input>
      </Form.Field>
      <Header as="h5" textAlign={'left'}>
        Intervals
      </Header>
      <Form.Field>
        <IntervalTypeSelect
          handleChangeIntervalType={handleChangeIntervalType}
          intervalType={intervalType}
          intervalTypeOptions={intervalOptions}
        />
      </Form.Field>
      <Form.Field>
        <Input
          type="decimal"
          name="interval_value"
          placeholder="Interval amount"
          value={interval}
          onChange={handleObservationChange}
        />
      </Form.Field>
      <Header as="h5" textAlign={'left'}>
        SDS (Standard Deviation Score)
      </Header>
      <Form.Field>
        <Form.Input
          label="Starting SDS"
          type="decimal"
          name="startSDS"
          placeholder="SDS"
          value={startSDS}
          labelPosition="left"
          onChange={handleObservationChange}
        ></Form.Input>
      </Form.Field>
      <ErrorText errorText={errorMessage} />
      <Form.Field width={14} style={{ textAlign: 'left' }}>
        <Checkbox
          toggle
          label="Add SDS drift?"
          onChange={handleSDSDriftChange}
        />
      </Form.Field>
      {driftFlag && (
        <Form.Field width={14}>
          <Slider
            isPercentage={false}
            min={-3}
            max={3}
            value={drift}
            step={0.01}
            onChange={handleDriftChange}
            label="Drift"
          />
        </Form.Field>
      )}
      {/* </Form.Group> */}

      <Form.Field width={14} style={{ textAlign: 'left' }}>
        <Checkbox
          toggle
          label="Simulate Measurement Error?"
          onChange={handleNoiseFlag}
        />
      </Form.Field>
      {noiseFlag && (
        <Form.Field width={14}>
          <Slider
            isPercentage={true}
            min={0}
            max={10}
            value={noise}
            step={0.1}
            onChange={handleNoiseChange}
            label="Percentage Error"
          />
        </Form.Field>
      )}
      <Form.Field>
        <Button
          content="Generate Growth Data"
          type="submit"
          fluid
          color="pink"
          icon="line graph"
          labelPosition="right"
          disabled={errorMessage !== ''}
        />
      </Form.Field>
      {props.globalState.isDataPresent && (
        <Form.Field>
          <Button
            content="Reset Chart"
            icon="power off"
            onClick={handleBigButtonPress}
            style={{ width: '100%' }}
            type="reset"
          />
        </Form.Field>
      )}
    </Form>
  );
};

export default FictionalChildForm;
