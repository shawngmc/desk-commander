const { override, addWebpackAlias } = require('customize-cra');

// config-overrides.js
module.exports = override(
    addWebpackAlias({
      'react': 'preact/compat',
      'react-dom': 'preact/compat'
    })
);
