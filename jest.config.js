const { defaults } = require("jest-config");
module.exports = {
  moduleFileExtensions: [...defaults.moduleFileExtensions],
  testTimeout: 20000,
  testEnvironment: './src/env/CustomNodeEnvironment.js',
};
