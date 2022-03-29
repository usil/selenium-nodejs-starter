const { defaults } = require("jest-config");
module.exports = {
  // ...
  moduleFileExtensions: [...defaults.moduleFileExtensions],
  testTimeout: 20000,
  // testResultsProcessor: "./node_modules/jest-html-reporter",
  // ...
};
