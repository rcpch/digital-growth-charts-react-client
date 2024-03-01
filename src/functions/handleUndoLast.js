const handleUndoLast = (undoLast, setErrorModal, removeLastActiveItem, updateGlobalState, InitalErrorModalState) => {
    if (undoLast) {
      setErrorModal({
        visible: true,
        title: "Are you sure you want to remove the last measurement?",
        body: "This will remove the last measurement entered on the chart.",
        handleCancel: () => setErrorModal(InitalErrorModalState()),
        handleClose: () => {
          removeLastActiveItem(true);
          setErrorModal(InitalErrorModalState());
        },
      });
      updateGlobalState("undoLast", false);
    }
  };
  
  export default handleUndoLast;