import { useEffect, useState, useCallback } from "react";

import deepCopy from "../functions/deepCopy";
import { requestGrowthApi } from "../api/growthApiClient";
import { validateFictionalChildResponse } from "../api/growthApiContract";

const makeInitialState = () => {
  const makeMidParentalHeights = () => ({
    mid_parental_height: null,
    mid_parental_height_sds: null,
    mid_parental_height_centile: null,
    mid_parental_height_centile_data: null,
    mid_parental_height_lower_centile_data: null,
    mid_parental_height_upper_centile_data: null,
    mid_parental_height_lower_value: null,
    mid_parental_height_upper_value: null,
  });

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
      midParentalHeights: makeMidParentalHeights(),
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
      midParentalHeights: makeMidParentalHeights(),
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

// This is a special case for bundled example scenarios, which are not
// fetched from the API but loaded from local JSON files generated ahead of
// time by s/regenerate-example-scenarios. It simulates an API call using
// data shaped exactly like a fictional-child-data response.
// The files are stored in src/example-scenarios/{condition}/{reference}/{measurementMethod}/{sex}/data.json.
// The JSON files are imported using import.meta.glob to allow for dynamic imports.
// This allows for easy addition of new example scenarios without changing the code.
// The files contain lists of measurement objects that match the expected structure
// of the API response, so they can be used directly in the application.
// Preload all local example scenarios (Vite bundles JSON)
const exampleScenarioIndex = import.meta.glob(
  "/src/example-scenarios/**/*.json",
  { eager: true }
);

const fetchFromLocal = async (input, reference, measurementMethod, sex) => {
  const { condition } = input || {};
  if (!condition || !reference || !measurementMethod || !sex) {
    throw new Error(
      `Missing required keys for local dataset. Got condition=${condition}, reference=${reference}, measurementMethod=${measurementMethod}, sex=${sex}`
    );
  }

  // Required: measurements
  // Expected path: /src/example-scenarios/{condition}/{reference}/{measurementMethod}/{sex}/data.json
  const baseDir = `/src/example-scenarios/${condition}/${reference}/${measurementMethod}/${sex}`;
  const dataPath = `${baseDir}/data.json`;
  const dataMod = exampleScenarioIndex[dataPath];
  if (!dataMod) {
    throw new Error(`Example scenario dataset not found at ${dataPath}`);
  }
  const measurements = validateFictionalChildResponse(
    dataMod.default ?? dataMod,
    { reference, measurementMethod, sex }
  );

  // Optional: mid-parental height (only for certain conditions and height method)
  const needsMph =
    measurementMethod === "height" &&
    [
      "growth-hormone-deficiency",
      "short-stature",
      "tall-stature",
      "normal",
    ].includes(condition);

  let midParentalHeights = null;
  if (needsMph) {
    const mphPath = `${baseDir}/mid-parental-height.json`; // same folder as data.json
    const mphMod = exampleScenarioIndex[mphPath];
    if (mphMod) {
      midParentalHeights = mphMod.default ?? mphMod;
    }
    // If missing, treat as optional and continue without throwing
  }

  // Return a composite result so the caller can set both outputs
  return { measurements, midParentalHeights };
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
      if (measurementMethod === "height") {
        mutable[mode].input[reference].parentalHeights = {
          height_maternal: null,
          height_paternal: null,
          sex: null,
          reference,
        };
        mutable[mode].output[reference].midParentalHeights =
          makeInitialState()[mode].output[reference].midParentalHeights;
      }
      return mutable;
    });
  }, [measurementMethod, mode, reference]);

  const clearMidParentalHeight = useCallback(() => {
    setApiState((old) => {
      const mutable = deepCopy(old);
      mutable[mode].input[reference].parentalHeights = {
        height_maternal: null,
        height_paternal: null,
        sex: null,
        reference,
      };
      mutable[mode].output[reference].midParentalHeights =
        makeInitialState()[mode].output[reference].midParentalHeights;
      return mutable;
    });
  }, [mode, reference]);

  const clearApiErrors = useCallback(() => {
    setApiState((old) => {
      const mutable = deepCopy(old);
      mutable.errors = { errors: false, message: "" };
      mutable.rateLimitExceeded = false;
      delete mutable.retryAfter;
      return mutable;
    });
  }, []);

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
        ? (li) =>
            requestGrowthApi({
              inputParameters: li,
              reference,
              mode: "mid-parental-height",
            })
        : useLocal
        ? (li) => fetchFromLocal(li, reference, measurementMethod, sex)
        : (li) =>
            requestGrowthApi({ inputParameters: li, reference, mode });

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

            // Local calls may return { measurements, midParentalHeights }
            if (useLocal) {
              if (Array.isArray(result)) {
                resultAsArray = result;
              } else {
                resultAsArray = result?.measurements ?? [];
                if (result?.midParentalHeights) {
                  // Create container if missing (e.g., for references without default MPH)
                  if (!mutable[mode].output[reference].midParentalHeights) {
                    mutable[mode].output[reference].midParentalHeights = {};
                  }
                  mutable[mode].output[reference].midParentalHeights =
                    result.midParentalHeights;
                }
              }
            } else if (mode === "fictional-child-data") {
              // API returns an array for fictional-child-data
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
            mutable.rateLimitExceeded = error.statusCode === 429;
            mutable.retryAfter = error.retryAfter;
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
    clearMidParentalHeight,
    clearApiErrors,
    measurements: apiState[mode].input,
    results: apiState[mode].output,
    apiErrors: apiState.errors,
    rateLimitExceeded: apiState.rateLimitExceeded,
    retryAfter: apiState.retryAfter,
    isLoading: apiState.isLoading,
  };
};

export default useRcpchApi;
