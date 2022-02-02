const { ESLINT_MODES } = require('@craco/craco');


module.exports = {
  plugins: [
    { 
      plugin: require("@semantic-ui-react/craco-less"),
      options: {
        lessLoaderOptions: {
          lessOptions: {
            math: "always",
            javascriptEnabled: true,
          },
        },
      },
  },
],
  eslint: {
    mode: ESLINT_MODES.file,
  }
};
