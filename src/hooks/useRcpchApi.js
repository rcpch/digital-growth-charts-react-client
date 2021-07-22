import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

import deepCopy from '../functions/deepCopy';

const fetchFromApi = async (inputParameters, reference, mode) => {
  console.log(JSON.stringify(inputParameters));
  const url = `${process.env.REACT_APP_GROWTH_API_BASEURL}/${reference}/${mode}/`;
  const response = await axios({
    url: url,
    data: inputParameters,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

const makeInitialState = () => {
  const measurements = {
    turner: {
      height: [],
      weight: [],
      bmi: [],
      ofc: [],
    },
    'trisomy-21': {
      height: [],
      weight: [],
      bmi: [],
      ofc: [],
    },
    'uk-who': {
      height: [],
      weight: [],
      bmi: [],
      ofc: [],
    },
  };
  return {
    calculation: {
      input: measurements,
      output: measurements,
    },
    fictional_child_data: {
      input: measurements,
      output: measurements,
    },
    errors: { errors: false, message: '' },
    isLoading: false,
  };
};

const useRcpchApi = (measurementMethod, reference, mode = 'calculation') => {
  const [apiState, setApiState] = useState(makeInitialState);

  const fetchResult = useCallback(
    (newInput) => {
      setApiState((old) => {
        const mutable = deepCopy(old);
        mutable[mode].input[reference][measurementMethod].push(newInput);
        mutable.isLoading = true;
        return mutable;
      });
    },
    [measurementMethod, mode, reference]
  );

  /* 
  Remove last item from arrays. Defaults to removing last item from measurements array only. 
  If 'both' parameter is set to true, removes last item from measurements array and 
  results array.
  */
  const removeLastFromArrays = useCallback(
    (oldState, both = false) => {
      const newInput = deepCopy(
        oldState[mode].input[reference][measurementMethod]
      );
      newInput.pop();
      let newOutput = null;
      if (both) {
        newOutput = oldState[mode].output[reference][measurementMethod];
        newOutput.pop();
      }
      return { newInput, newOutput };
    },
    [measurementMethod, mode, reference]
  );

  // as above but updates state as well (used as a callback)
  const removeLastActiveItem = useCallback(
    (both) => {
      setApiState((old) => {
        const mutable = deepCopy(old);
        const { newInput, newOutput } = removeLastFromArrays(old, both);
        mutable[mode].input[reference][measurementMethod] = newInput;
        if (newOutput) {
          mutable[mode].output[reference][measurementMethod] = newOutput;
        }
        return mutable;
      });
    },
    [setApiState, removeLastFromArrays, mode, reference, measurementMethod]
  );

  const clearBothActiveArrays = useCallback(() => {
    setApiState((old) => {
      const mutable = deepCopy(old);
      mutable[mode].input[reference][measurementMethod] = [];
      mutable[mode].output[reference][measurementMethod] = [];
      return mutable;
    });
  }, [measurementMethod, mode, reference]);

  const clearApiErrors = useCallback(() => {
    setApiState((old) => {
      const mutable = deepCopy(old);
      mutable.errors = { errors: false, message: '' };
      return mutable;
    });
  }, []);

  useEffect(() => {
    let ignore = false;
    if (apiState.isLoading) {
      const relevantArray = apiState[mode].input[reference][measurementMethod];
      const latestInput = deepCopy(relevantArray[relevantArray.length - 1]);
      fetchFromApi(latestInput, reference, mode)
        .then((result) => {
          if (!ignore) {
            const measurementError =
              result.measurement_calculated_values
                .corrected_measurement_error ||
              result.measurement_calculated_values
                .chronological_measurement_error;
            if (!measurementError) {
              setApiState((old) => {
                const mutable = deepCopy(old);
                if (mode === 'fictional_child_data') {
                  console.log(JSON.stringify(result));
                } else {
                  mutable[mode].output[reference][measurementMethod].push(
                    result
                  );
                }
                mutable.isLoading = false;
                mutable.errors = { errors: false, message: 'success' };
                return mutable;
              });
            } else {
              setApiState((old) => {
                const mutable = deepCopy(old);
                const { newInput } = removeLastFromArrays(old);
                mutable[mode].input[reference][measurementMethod] = newInput;
                mutable.isLoading = false;
                mutable.errors = {
                  errors: true,
                  message: `The server could not process the measurements. Details: ${measurementError}`,
                };
                return mutable;
              });
            }
          }
        })
        .catch((error) => {
          setApiState((old) => {
            const mutable = deepCopy(old);
            const { newInput } = removeLastFromArrays(old);
            mutable[mode].input[reference][measurementMethod] = newInput;
            const errorForUser = `There has been a problem fetching the result from the server. Error details: ${error.message}`;
            mutable.errors = { errors: true, message: errorForUser };
            mutable.isLoading = false;
            return mutable;
          });
        });
    }
    return () => {
      ignore = true;
    };
  }, [apiState, measurementMethod, mode, reference, removeLastFromArrays]);

  return {
    fetchResult,
    removeLastActiveItem,
    clearBothActiveArrays,
    clearApiErrors,
    measurements: apiState[mode].input,
    results: apiState[mode].output,
    apiErrors: apiState.errors,
    isLoading: apiState.isLoading,
  };
};

export default useRcpchApi;
