require("colors");
require("dotenv").config();

const Table = require("cli-table");
const os = require("os");

const { EnvSettings } = require("advanced-settings");

const util = require("util");

const exec = util.promisify(require("child_process").exec);

const envSettings = new EnvSettings();

const testOptions = envSettings.loadJsonFileSync("testOptions.json", "utf8");

/**
 *
 * @param {string | number} suiteIdentifier
 * @param {string} stderr
 * @param {number} virtualUser
 * @description Print the report table
 */
const createTable = (suiteIdentifier, stderr, virtualUser) => {
  const jestOutput = require(`../${suiteIdentifier}-jest-output.json`);

  console.info(
    `\n# ${virtualUser} Jest report table for the ${suiteIdentifier} suite\n`
      .yellow.bold
  );

  console.info(stderr); //* Print the jest result

  const table = new Table({
    head: [
      "#".blue,
      "Business Unit".blue,
      "Department".blue,
      "Feature".blue,
      "Scenario".blue,
      "Passed".blue,
    ],
    colWidths: [5, 20, 20, 20, 40, 20],
    colors: true,
  }); //* Creates the table

  let testResultIndex = 0;

  for (const testResult of jestOutput.testResults) {
    const path =
      os.type() === "Windows_NT"
        ? testResult.name.split("\\")
        : testResult.name.split("/");
    table.push([
      (testResultIndex + 1).toString(),
      path[path.length - 5],
      path[path.length - 4],
      path[path.length - 3],
      path[path.length - 2],
      testResult.status === "passed"
        ? testResult.status.green
        : testResult.status.red,
    ]);
    testResultIndex++;
  } //* Inserts data to the table

  console.info(
    `\n# ${virtualUser}Report table for the ${suiteIdentifier} suite\n`.yellow
      .bold
  );

  console.info(table.toString() + "\n"); //* Prints the table
};

/**
 * @description app entrypoint
 */
const main = () => {
  let suiteIndex = 0;
  for (
    let index = 0;
    index < (testOptions.virtualUserMultiplier || 1);
    index++
  ) {
    for (const suite of testOptions.virtualUserSuites) {
      if (!suite.skip) {
        const suiteIdentifier = suite.identifier
          ? suite.identifier
          : suiteIndex;

        console.info(
          `#${index} Starting test in ${suiteIdentifier} suite`.bgMagenta
        );

        const environmentTestFiles = process.env.FILTERED_FILES
          ? process.env.FILTERED_FILES.toString().split(" ")
          : [];

        const suiteTestFiles = suite.files || [];

        const globalTestFiles = testOptions.files || [];

        const testFiles =
          environmentTestFiles.length > 0
            ? environmentTestFiles
            : suiteTestFiles.length > 0
            ? suiteTestFiles
            : globalTestFiles;

        //* Spawns the jest process
        exec(
          `npx jest --verbose --json --outputFile=${suiteIdentifier}-jest-output.json ${testFiles.join(
            " "
          )}`,
          {
            env: { ...suite.variables },
          }
        )
          .then((result) => {
            createTable(suiteIdentifier, result.stderr.blue, index);
          })
          .catch((err) => {
            if (!err.killed) {
              createTable(suiteIdentifier, err.stderr.red, index);
            } else {
              console.error("error".red, err);
            }
          });
      }
      suiteIndex++;
    }
  }
};

main();
