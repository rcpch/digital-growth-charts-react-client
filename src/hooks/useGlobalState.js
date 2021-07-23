import { useState, useCallback } from 'react';
import deepCopy from '../functions/deepCopy';

const makeGlobalState = () => {
  return {
    mode: 'calculation',
    modeActiveIndex: 0,
    reference: 'uk-who',
    measurementMethod: 'height',
    units: "cm",
    measurementMethodActiveIndex: 0,
    sex: 'male',
    disabled: {
      height: false,
      weight: false,
      bmi: false,
      ofc: false,
      male: false,
      female: false,
    },
    errors: {
      errors: false,
      message: '',
    },
    clearMeasurement: false,
    resetCurrent: false,
    undoLast: false,
    isDataPresent: false,
  };
};

const measurementMethodActiveIndexLookup = ['height', 'weight', 'bmi', 'ofc'];

const useGlobalState = () => {
  const [globalState, setGlobalState] = useState(makeGlobalState);
  const makeGlobalStateUpdater = useCallback((results) => {
    return (name, newValue) => {
      setGlobalState((old) => {
        const mutable = deepCopy(old);
        switch (name) {
          case 'mode':
            mutable.mode = newValue;
            mutable.modeActiveIndex = newValue === 'calculation' ? 0 : 1;
            break;
          case 'modeActiveIndex':
            mutable.modeActiveIndex = newValue;
            mutable.mode =
              newValue === 0 ? 'calculation' : 'fictional-child-data';
            break;
          case 'reference':
            mutable.reference = newValue;
            if (newValue === 'turner') {
              mutable.disabled = {
                height: false,
                weight: true,
                bmi: true,
                ofc: true,
                male: true,
                female: false,
              };
              mutable.measurementMethod = 'height';
              mutable.measurementMethodActiveIndex = 0;
              mutable.sex = 'female';
            } else {
              if (
                results[newValue][mutable.measurementMethod].length > 0 &&
                results[newValue][mutable.measurementMethod][0].birth_data
                  .sex !== mutable.sex
              ) {
                mutable.sex =
                  results[newValue][
                    mutable.measurementMethod
                  ][0].birth_data.sex;
              }
              mutable.disabled = {
                height: false,
                weight: false,
                bmi: false,
                ofc: false,
                male: false,
                female: false,
              };
            }
            break;
          case 'measurementMethod':
            mutable.measurementMethod = newValue;
            for (
              let i = 0;
              i < measurementMethodActiveIndexLookup.length;
              i++
            ) {
              if (measurementMethodActiveIndexLookup[i] === newValue) {
                mutable.measurementMethodActiveIndex = i;
                break;
              }
            }
            break;
          case 'measurementMethodActiveIndex':
            const tempMeasurementMethod =
              measurementMethodActiveIndexLookup[newValue];
            if (
              mutable.reference === 'turner' &&
              tempMeasurementMethod !== 'height'
            ) {
              mutable.errors = {
                errors: true,
                message: 'Unable to change measurement type',
              };
            } else {
              mutable.measurementMethodActiveIndex = newValue;
              mutable.measurementMethod =
                measurementMethodActiveIndexLookup[newValue];
            }
            break;
          case 'sex':
            const existingResults = [
              ...results[mutable.reference][mutable.measurementMethod],
            ];
            if (existingResults.length > 0) {
              for (const oldResult of existingResults) {
                if (newValue !== oldResult.sex) {
                  mutable.errors = {
                    errors: true,
                    message: 'Unable to change sex',
                  };
                  break;
                }
              }
            }
            if (!mutable.errors.message) {
              mutable.sex = newValue;
            }
            break;
          default:
            mutable[name] = newValue;
        }
        return mutable;
      });
    };
  }, []);
  return {
    globalState,
    makeGlobalStateUpdater,
  };
};

export default useGlobalState;
