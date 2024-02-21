import { useEffect } from 'react';

const useDataCheckForData = (results, reference, measurementMethod, updateGlobalState) => {
  useEffect(() => {
    updateGlobalState("isDataPresent", results[reference][measurementMethod].length > 0);
  }, [results, reference, measurementMethod, updateGlobalState]);
};

export default useDataCheckForData;
