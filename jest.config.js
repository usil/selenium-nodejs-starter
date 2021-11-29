const { defaults } = require("jest-config");
module.exports = {
  // ...
  moduleFileExtensions: [...defaults.moduleFileExtensions],
  testTimeout: 15000,
  // testResultsProcessor: "./node_modules/jest-html-reporter",
  // ...
};
