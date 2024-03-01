const handleResetCurrent = (resetCurrent, setErrorModal, clearBothActiveArrays, updateGlobalState, InitalErrorModalState) => {
    if (resetCurrent) {
      setErrorModal({
        visible: true,
        title: "Are you sure you want to reset?",
        body: "This will remove all measurements from the current chart.",
        handleCancel: () => setErrorModal(InitalErrorModalState()),
        handleClose: () => {
          clearBothActiveArrays();
          setErrorModal(InitalErrorModalState());
          updateGlobalState("mid-parental-height", "empty");
        },
      });
      updateGlobalState("resetCurrent", false);
    }
  };
  
  export default handleResetCurrent;