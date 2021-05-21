function isES6() {
  try {
    Function('() => {};');
    return true;
  } catch (error) {
    return false;
  }
}

if (!isES6()) {
  var errorContainer = document.createElement('div');

  errorContainer.style = 'margin: auto; height: 100vh; width: 100vh;';

  var heading = document.createElement('h2');

  heading.style = 'position: relative; top: 50%; transform: translateY(-50%);';

  errorContainer.appendChild(heading);

  var errorText = document.createTextNode(
    'The RCPCH growth app does not support legacy browsers such as Internet Explorer. Please visit on a more modern browser such as Edge or Chrome.'
  );

  heading.appendChild(errorText);

  var app = document.getElementById('root');

  app.style.display = 'none';

  document.body.insertBefore(errorContainer, app);
}
