import MeasurementForm from "../../MeasurementForm";
import FictionalChildForm from "../../FictionalChildForm";

import { Tab } from "semantic-ui-react";

const createFormPanes = (
  isLoading,
  measurements,
  reference,
  measurementMethod,
  setErrorModal,
  InitalErrorModalState,
  fetchResult,
  globalState,
  updateGlobalState,
  utilitiesFormDataSubmit,
  centileStyle,
  fictionalFormDataSubmit,
) => {

  const FormPanes = [
    {
      key: "measurements",
      menuItem: "Measurements",
      render: () => (
        <Tab.Pane attached={false} key="measurements">
          <MeasurementForm
            isLoading={isLoading}
            measurements={measurements}
            reference={reference}
            measurementMethod={measurementMethod}
            setErrorModal={setErrorModal}
            InitalErrorModalState={InitalErrorModalState}
            fetchResult={fetchResult}
            globalState={globalState}
            updateGlobalState={updateGlobalState}
            className="measurement-form"
            handleUtilitiesFormDataSubmit={utilitiesFormDataSubmit}
            themeColour={centileStyle.centileStroke}
          />
        </Tab.Pane>
      ),
    },
    {
      key: "examples",
      menuItem: "Examples",
      render: () => (
        <Tab.Pane key="examples">
          <FictionalChildForm
            fictionalFormDataSubmit={fictionalFormDataSubmit}
            globalState={globalState}
            updateGlobalState={updateGlobalState}
            handleUtilitiesFormDataSubmit={utilitiesFormDataSubmit}
          />
        </Tab.Pane>
      ),
    },
  ];

  return FormPanes;
};

export default createFormPanes
