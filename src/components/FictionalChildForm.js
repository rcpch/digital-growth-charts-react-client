import React, { useState } from 'react';

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

const FictionalChildForm = (props) => {
  const [measurementMethod, setMeasurementMethod] = useState('height');
  const [sex, setSex] = useState('male');
  const [weeks, setWeeks] = useState(40);
  const [days, setDays] = useState(0);
  const [startingAge, setStartingAge] = useState(1.0);
  const [endingAge, setEndingAge] = useState(20.0);
  const [intervalType, setIntervalType] = useState('days');
  const [interval, setInterval] = useState(30);
  const [driftFlag, setDriftFlag] = useState(false);
  const [drift, setDrift] = useState(0.01);
  const [noiseFlag, setNoiseFlag] = useState(false);
  const [noise, setNoise] = useState(0.1);
  const [startSDS, setStartSDS] = useState(0);
  const [reference, setReference] = useState('uk-who');
  // const [formValid, setFormValid] = useState(false)

  const handleSubmit = ({ target }) => {
    const formData = Object.fromEntries(new FormData(target));
    const values = {
      measurement_method: measurementMethod,
      sex: sex,
      start_chronological_age: formData.start_age,
      end_age: formData.end_age,
      gestation_weeks: weeks,
      gestation_days: days,
      measurement_interval_type: intervalType,
      measurement_interval_number: formData.interval_value,
      start_sds: 0.2,
      noise: noiseFlag,
      drift_range: drift,
      drift: driftFlag,
      noise_range: noise,
      reference: reference,
    };
    props.fictionalFormDataSubmit(values);
  };

  const handleChangeReference = (val) => {
    setReference(val.value);
    if (val.value === 'turner') {
      measurementOptions[1].disabled = true;
      measurementOptions[2].disabled = true;
      measurementOptions[3].disabled = true;
      sexOptions[0].disabled = true;
      setMeasurementMethod('height');
      setSex('female');
    } else {
      measurementOptions[1].disabled = false;
      measurementOptions[2].disabled = false;
      measurementOptions[3].disabled = false;
      sexOptions[0].disabled = false;
    }
  };

  const handleChangeMeasurementMethod = (val) => {
    setMeasurementMethod(val);
  };

  const handleSexChange = (val) => {
    setSex(val.value);
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

  const handleObservationChange = ({ name, val }) => {
    if (name === 'start_age') {
      setStartingAge(val);
    }
    if (name === 'end_age') {
      setEndingAge(val);
    }
    if (name === 'interval_value') {
      setInterval(val);
    }
    if (name === 'startSDS') {
      setStartSDS(val);
    }
  };

  const handleChangeIntervalType = ({ value }) => {
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

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Field>
        <ReferenceSelect
          handleChangeReference={handleChangeReference}
          reference={reference}
          referenceOptions={referenceOptions}
        />
      </Form.Field>
      <Form.Field>
        <MeasurementMethodSelect
          handleChangeMeasurementMethod={handleChangeMeasurementMethod}
          measurementMethod={measurementMethod}
          measurementOptions={measurementOptions}
        />
      </Form.Field>
      <Form.Field>
        <SexSelect
          handleSexChange={handleSexChange}
          sex={sex}
          sexOptions={sexOptions}
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
            content: 'ys',
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
            content: 'ys',
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
          labelPosition="right"
          onChange={handleObservationChange}
        ></Input>
      </Form.Field>
      <Header as="h5" textAlign={'left'}>
        SDS
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
            min={0}
            max={2.0}
            value={noise}
            step={0.01}
            onChange={handleNoiseChange}
            label="SDS Error"
          />
        </Form.Field>
      )}
      <Form.Field>
        <Button
          content="Generate Growth Data"
          type="submit"
          fluid
          // disabled={!formValid}
          color="pink"
          icon="line graph"
          labelPosition="right"
        />
      </Form.Field>
    </Form>
  );
};

export default FictionalChildForm;
