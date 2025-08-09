import { Button, Modal } from "semantic-ui-react";
import PropTypes from "prop-types";

export const ErrorModal = ({
  title,
  body,
  handleClose,
  visible,
  handleCancel,
}) => {
  const showCancel = handleCancel ? true : false;
  return (
    <Modal title={title} open={visible} size="small" closeOnEscape={true}>
      <Modal.Header>{title}</Modal.Header>
      <Modal.Content>{body}</Modal.Content>
      <Modal.Actions>
        <Button negative onClick={handleClose}>
          OK
        </Button>
        {showCancel && <Button onClick={handleCancel}>Cancel</Button>}
      </Modal.Actions>
    </Modal>
  );
};

ErrorModal.propTypes = {
  title: PropTypes.string.isRequired,
  body: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  handleClose: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
  handleCancel: PropTypes.func,
};
