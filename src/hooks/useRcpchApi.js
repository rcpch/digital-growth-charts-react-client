import { useEffect, useState, useCallback } from "react";

import deepCopy from "../functions/deepCopy";

const fetchFromApi = async (inputParameters, reference, mode) => {
  /*
  This code snippet makes an API call direct to the digital growth charts server
  It uses a development API key stored in .env which is unsafe
  In due course this endpoint will be deprecated.
  */
  //  For this to work in development use http://127.0.0.1:8000 rather than localhost
  // const prod_url = import.meta.env.VITE_APP_GROWTH_API_BASEURL;
  const prod_url = "http://127.0.0.1:8000";

  let url = `${prod_url}/${reference}/${mode}`;
  if (mode === "mid-parental-height") {
    url = `${prod_url}/utilities/${mode}`;
  }

  const headers = import.meta.env.VITE_APP_API_KEY
    ? {
        "Content-Type": "application/json",
        "Subscription-Key": import.meta.env.VITE_APP_API_KEY,
      }
    : { "Content-Type": "application/json" };

  const response = await fetch(url, {
    body: JSON.stringify(inputParameters),
    method: "POST",
    headers,
  });

  const data = await response.json();

  return data;
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
    "trisomy-21-aap": {
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
        reference: "uk-who",
      },
      midParentalHeights: midParentalHeights,
    },
    who: {
      height: [],
      weight: [],
      bmi: [],
      ofc: [],
      parentalHeights: {
        height_maternal: null,
        height_paternal: null,
        sex: null,
        reference: "who",
      },
      midParentalHeights: midParentalHeights,
    },
    cdc: {
      height: [],
      weight: [],
      bmi: [],
      ofc: [],
      parentalHeights: {
        height_maternal: null,
        height_paternal: null,
        sex: null,
        reference: "cdc",
      },
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

  // This is a special case for fictional child data, which is not fetched from the API
  // but from local JSON files.
  // It is used to simulate an API call for fictional data.
  // The files are stored in src/fictional-children/{reference}/{measurementMethod}/data.json
  // or in src/fictional-children/{key}.json if the first path is not found.
  // The JSON files are imported using import.meta.glob to allow for dynamic imports.
  // This allows for easy addition of new fictional datasets without changing the code.
  // The files contain lists of measurement objects that match the expected structure
  // of the API response, so they can be used directly in the application.
  // Preload all local fictional datasets (Vite bundles JSON)
  const fictionalIndex = import.meta.glob("/src/fictional-children/**/*.json", {
    eager: true,
  });

  const fetchFromLocal = async (input, reference, measurementMethod, sex) => {
    const { condition } = input || {};
    if (!condition || !reference || !measurementMethod || !sex) {
      throw new Error(
        `Missing required keys for local dataset. Got condition=${condition}, reference=${reference}, measurementMethod=${measurementMethod}, sex=${sex}`
      );
    }

    // Expected path: /src/fictional-children/{condition}/{reference}/{measurementMethod}/data.json
    const expectedPath = `/src/fictional-children/${condition}/${reference}/${measurementMethod}/${sex}/data.json`;
    const mod = fictionalIndex[expectedPath];

    if (!mod) {
      throw new Error(`Fictional dataset not found at ${expectedPath}`);
    }

    return mod.default ?? mod;
  };

  useEffect(() => {
    let ignore = false;
    if (apiState.isLoading) {
      let relevantArray;
      let latestInput;
      let sex;

      if (apiState["isMidparentalCalculation"]) {
        latestInput = apiState[mode].input[reference]["parentalHeights"];
      } else {
        relevantArray = apiState[mode].input[reference][measurementMethod];
        latestInput = deepCopy(relevantArray[relevantArray.length - 1]);
        sex = latestInput?.sex;
      }

      // Decide API vs Local:
      // - mid-parental-height always API
      // - calculation and fictional-child-data default to API
      // - any other mode OR explicit latestInput.source === 'local' => local JSON
      const explicitLocal = latestInput?.source === "local";
      const isStandardEndpoint =
        mode === "calculation" || mode === "fictional-child-data";
      const useLocal = !isStandardEndpoint || explicitLocal;

      const fetcher = apiState["isMidparentalCalculation"]
        ? (li) => fetchFromApi(li, reference, "mid-parental-height")
        : useLocal
        ? (li) => fetchFromLocal(li, reference, measurementMethod, sex)
        : (li) => fetchFromApi(li, reference, mode);

      fetcher(latestInput)
        .then((result) => {
          if (ignore) return;
          setApiState((old) => {
            const mutable = deepCopy(old);
            let measurementError = "";
            let resultAsArray = null;

            if (mutable.isMidparentalCalculation) {
              mutable.errors = { errors: false, message: "success" };
              mutable[mode].input[reference]["parentalHeights"] = latestInput; // fix casing
              mutable[mode].output[reference]["midParentalHeights"] = result;
              mutable.isLoading = false;
              mutable.isMidparentalCalculation = false;
              return mutable;
            }

            // For fictional-child-data (API or local), result is an array; for calculation, append single item
            if (mode === "fictional-child-data" || useLocal) {
              resultAsArray = result;
            } else if (mode === "calculation") {
              resultAsArray = mutable[mode].output[reference][
                measurementMethod
              ].concat([result]);
            }

            for (const singleResult of resultAsArray) {
              if (resultAsArray.length < 2) {
                measurementError =
                  singleResult?.measurement_calculated_values
                    ?.corrected_measurement_error ||
                  singleResult?.measurement_calculated_values
                    ?.chronological_measurement_error;
              }
              if (measurementError) {
                if (useLocal) {
                  mutable[mode].input[reference][measurementMethod] = [];
                } else {
                  const { newInput } = removeLastFromArrays(old);
                  mutable[mode].input[reference][measurementMethod] = newInput;
                }
                mutable.errors = {
                  errors: true,
                  message: useLocal
                    ? `Problem loading the local fictional dataset. Details: ${measurementError}`
                    : `The server could not process the measurements. Details: ${measurementError}`,
                };
                mutable.isLoading = false;
                return mutable;
              }
            }

            mutable[mode].output[reference][measurementMethod] = resultAsArray;
            mutable.errors = { errors: false, message: "success" };
            mutable.isLoading = false;
            return mutable;
          });
        })
        .catch((error) => {
          setApiState((old) => {
            const mutable = deepCopy(old);
            const { newInput } = removeLastFromArrays(old);
            mutable[mode].input[reference][measurementMethod] = newInput;

            const errorForUser = useLocal
              ? `There has been a problem loading the local fictional dataset.\nError: ${error.message}`
              : `There has been a problem fetching the result from the server.\nError details: ${error.message}`;
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
