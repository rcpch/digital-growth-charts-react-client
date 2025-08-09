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
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  body: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  handleClose: PropTypes.func,
  handleCancel: PropTypes.func,
  visible: PropTypes.bool,
};

ErrorModal.defaultProps = {
  title: "",
  body: null,
  handleClose: () => {},
  handleCancel: null,
  visible: false,
};
