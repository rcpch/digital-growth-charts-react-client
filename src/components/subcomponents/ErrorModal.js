import React from 'react';
import {
  Button,
  Modal,
} from 'semantic-ui-react';

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
