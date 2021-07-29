import React from 'react';
import { Message } from 'semantic-ui-react';

export default function ErrorText({ errorText, showError }) {
  if (!errorText) {
    return null;
  }
  let makeErrorVisible = errorText ? true : false;
  if (showError === false) {
    makeErrorVisible = false;
  }
  return <>{makeErrorVisible && <Message color="red">{errorText}</Message>}</>;
}
