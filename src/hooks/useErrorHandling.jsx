import { useEffect } from 'react';

const useErrorHandling = (apiErrors, errors, setErrorModal, clearApiErrors, updateGlobalState, InitalErrorModalState) => {
  useEffect(() => {
    const handleApiErrors = () => {
      if (apiErrors.errors) {
        setErrorModal({
          visible: true,
          title: "Unable to plot",
          body: apiErrors.message,
          handleClose: () => {
            clearApiErrors();
            setErrorModal(InitalErrorModalState());
          },
        });
      } else if (apiErrors.message === "success") {
        updateGlobalState("clearMeasurement", true);
        clearApiErrors();
      }
    };

    const handleErrors = () => {
      if (errors.errors) {
        let body = "Only height data is available for Turner Syndrome.";
        if (errors.message === "Unable to change sex") {
          body =
            "Each chart can only display measurements from one patient at a time. Please reset the chart before entering measurements from a new patient.";
        }
        setErrorModal({
          visible: true,
          title: errors.message,
          body: body,
          handleClose: () => setErrorModal(InitalErrorModalState()),
        });
        updateGlobalState("errors", { errors: false, message: "" });
      }
    };

    handleApiErrors();
    handleErrors();
  }, [apiErrors, errors, clearApiErrors, setErrorModal, updateGlobalState, InitalErrorModalState]);
};

export default useErrorHandling;