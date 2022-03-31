import { useEffect, useState, useCallback } from "react";
import axios from "axios";

import deepCopy from "../functions/deepCopy";

const fetchFromApi = async (inputParameters, reference, mode) => {
  /*
  This code snippet makes an API call direct to the digital growth charts server
  It uses a development API key stored in .env which is unsafe
  In due course this endpoint will be deprecated.
  */

  let url = `${process.env.REACT_APP_GROWTH_API_BASEURL}/${reference}/${mode}`;
  const headers = process.env.REACT_APP_API_KEY
    ? {
        "Content-Type": "application/json",
        "Subscription-Key": process.env.REACT_APP_API_KEY,
      }
    : { "Content-Type": "application/json" };
  const response = await axios({
    url: url,
    data: inputParameters,
    method: "POST",
    headers,
  });

  /*
  This code snippet directs the form data to a node server which holds the API key and makes the 
  call to the digital growth chart server.
  Cors is used to constrain accepted domains to the react demo client
  */
  // const nodeURL = 'http://localhost:8001/rcpchgrowth';
  // const nodeURL = `http://localhost:8000/${reference}/${mode}`

  // const options = {
  //     // reference: reference,
  //     // mode: mode,
  //     formdata: inputParameters,
  // };

  // const headers = { 'Content-Type': 'application/json' };
  // const response = await axios({
  //     url: nodeURL,
  //     data: options,
  //     method: 'POST',
  //     headers: headers,
  // });

  return response.data;
};

const makeInitialState = () => {
  const midParentalHeights = {
    mid_parental_height: null,
    mid_parental_height_sds: null,
    mid_parental_height_centile: null,
    mid_parental_height_centile_data: null,
    mid_parental_height_lower_centile_data: null,
    mid_parental_height_upper_centile_data: null,
    mid_parental_height_lower_value: null,
    mid_parental_height_upper_value: null,
  };

  const measurements = {
    turner: {
      height: [],
      weight: [],
      bmi: [],
      ofc: [],
    },
    "trisomy-21": {
      height: [],
      weight: [],
      bmi: [],
      ofc: [],
    },
    "uk-who": {
      height: [],
      weight: [],
      bmi: [],
      ofc: [],
      parentalHeights: {
        height_maternal: null,
        height_paternal: null,
        sex: null,
      },
      midParentalHeights: midParentalHeights,
    },
  };

  return {
    calculation: {
      input: measurements,
      output: measurements,
    },
    "fictional-child-data": {
      input: measurements,
      output: measurements,
    },
    errors: { errors: false, message: "" },
    isLoading: false,
    isMidparentalCalculation: false,
  };
};

const useRcpchApi = (measurementMethod, reference, mode = "calculation") => {
  const [apiState, setApiState] = useState(makeInitialState);
  const fetchResult = useCallback(
    (newInput) => {
      setApiState((old) => {
        let mutable = deepCopy(old);
        if (newInput.height_maternal && newInput.height_paternal) {
          mutable[mode].input[reference]["parentalHeights"] = newInput;
          mutable.isMidparentalCalculation = true;
        } else {
          mutable[mode].input[reference][measurementMethod].push(newInput);
        }
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
      mutable.errors = { errors: false, message: "" };
      return mutable;
    });
  }, []);

  useEffect(() => {
    let ignore = false;
    if (apiState.isLoading) {
      let relevantArray;
      let latestInput;

      if (apiState["isMidparentalCalculation"]) {
        latestInput = apiState[mode].input[reference]["parentalHeights"];
      } else {
        relevantArray = apiState[mode].input[reference][measurementMethod];
        latestInput = deepCopy(relevantArray[relevantArray.length - 1]);
      }

      fetchFromApi(
        latestInput,
        reference,
        apiState["isMidparentalCalculation"] ? "mid-parental-height" : mode
      )
        .then((result) => {
          if (!ignore) {
            setApiState((old) => {
              const mutable = deepCopy(old);
              let measurementError = "";
              let resultAsArray = null;
              if (mutable.isMidparentalCalculation) {
                mutable.errors = {
                  errors: false,
                  message: "success",
                };
                mutable[mode].input[reference]["parentalheights"] = latestInput;
                mutable[mode].output[reference]["midParentalHeights"] = result;
                mutable.isLoading = false;
                mutable.isMidparentalCalculation = false;
                return mutable;
              }
              if (mode === "fictional-child-data") {
                resultAsArray = result;
              }
              if (mode === "calculation") {
                resultAsArray = mutable[mode].output[reference][
                  measurementMethod
                ].concat([result]);
              }
              for (const singleResult of resultAsArray) {
                if (resultAsArray.length < 2) {
                  // only register errors for individual measurements
                  measurementError =
                    singleResult.measurement_calculated_values
                      .corrected_measurement_error ||
                    singleResult.measurement_calculated_values
                      .chronological_measurement_error;
                }
                if (measurementError) {
                  if (mode === "fictional-child-data") {
                    mutable[mode].input[reference][measurementMethod] = [];
                  } else {
                    const { newInput } = removeLastFromArrays(old);
                    mutable[mode].input[reference][measurementMethod] =
                      newInput;
                  }
                  mutable.errors = {
                    errors: true,
                    message: `The server could not process the measurements. Details: ${measurementError}`,
                  };
                  mutable.isLoading = false;
                  return mutable;
                }
              }
              mutable[mode].output[reference][measurementMethod] =
                resultAsArray;
              mutable.errors = {
                errors: false,
                message: "success",
              };
              mutable.isLoading = false;
              return mutable;
            });
          }
        })
        .catch((error) => {
          setApiState((old) => {
            const mutable = deepCopy(old);
            const { newInput } = removeLastFromArrays(old);
            mutable[mode].input[reference][measurementMethod] = newInput;
            const errorForUser = `There has been a problem fetching the result from the server. Error details: ${error.message}`;
            mutable.errors = {
              errors: true,
              message: errorForUser,
            };
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
