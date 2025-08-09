import { Message } from "semantic-ui-react";
import PropTypes from "prop-types";

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

ErrorText.propTypes = {
  errorText: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  showError: PropTypes.bool,
};
