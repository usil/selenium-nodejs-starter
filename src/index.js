require("colors");
require("dotenv").config();

const Table = require("cli-table");
const os = require("os");

const { EnvSettings } = require("advanced-settings");

const util = require("util");
const { formatVarsEnv, sortTestResults } = require("./helpers/testHelpers");

const exec = util.promisify(require("child_process").exec);

const envSettings = new EnvSettings();

const testOptions = envSettings.loadJsonFileSync("testOptions.json", "utf8");
const columnNames = testOptions.columnNames;
const reportMode = testOptions.reportMode;

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

  const tableHead = [];
  const colWidths = [];

  tableHead.push("#".blue);
  colWidths.push(5);

  columnNames.forEach((column, index) => {
    let columnWidth = 30;

    if (reportMode === "dynamicDeep")
      columnWidth = index !== 1 ? 25 : 50


    tableHead.push(`${column}`.blue);
    colWidths.push(columnWidth);
  });

  tableHead.push("Status".blue);
  colWidths.push(15);

  const table = new Table({
    head: [...tableHead],
    colWidths: [...colWidths],
    colors: true,
  }); //* Creates the table

  let testResultIndex = 0;

  let testResults = sortTestResults(jestOutput.testResults)

  for (const testResult of testResults) {
    const path =
      os.type() === "Windows_NT"
        ? testResult.name.split("\\")
        : testResult.name.split("/");

    const testIndex = path.indexOf("tests");

    if (testIndex === -1) {
      console.log(
        `${path[path.length - 1]} test is not inside the correct directory.`
          .yellow
      );
      testResultIndex++;
      continue;
    }

    let tableValues = path.slice(testIndex + 1, path.length);

    if (tableValues.length !== columnNames.length && reportMode !== 'dynamicDeep') {
      console.log(
        `${path[path.length - 1]} does not meet your columns definition.`.yellow
      );
    }

    /**
     * If the type of report is dynamic, adjust depth of folders in columns
     */
    if (reportMode === 'dynamicDeep') {
      let fixedColumns = [];

      /**
       * The first is always used for column 'C1'
       */
      fixedColumns.push(tableValues.shift());

      /**
       * Iterate and concatenate the folder to fixed
       */
      let dynamicColumn = ''
      for (let index = 0; index < tableValues.length - 1; index++) {
        index === 0 ? false : dynamicColumn += '/';
        dynamicColumn += `${tableValues[index]}`
      }

      /**
       * Add the fixed column 'C2'
       */
      fixedColumns.push(dynamicColumn)

      /**
       * Add the value of the last column 'C3'
       */
      fixedColumns.push(tableValues.pop())

      // Replace table value
      tableValues = fixedColumns
    }

    const contentToPush = [];

    contentToPush.push((testResultIndex + 1).toString());

    for (let index = 0; index < columnNames.length; index++) {
      if (tableValues[index]) {
        contentToPush.push(tableValues[index]);
      } else {
        contentToPush.push("null");
      }
    }

    contentToPush.push(
      testResult.status === "passed"
        ? testResult.status.green
        : testResult.status.red
    );

    table.push([...contentToPush]);
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
  const sysOS = os.type();

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

        console.log(testFiles.join(" "));

        // Format variables for environment variables
        let varToEnv = formatVarsEnv(suite.variables)

        /**
         * When not in windows, the path is added
         */
        if (sysOS !== 'Windows_NT') {
          varToEnv.PATH = process.env.PATH
        }

        //* Spawns the jest process
        exec(
          `npx jest --verbose --json --runInBand --outputFile=${suiteIdentifier}-jest-output.json ${testFiles.join(
            " "
          )}`,
          {
            env: { ...varToEnv },
          }
        )
          .then((result) => {
            console.info(result.stderr.blue); //* Print the jest result
            if (columnNames.length > 0) {
              createTable(suiteIdentifier, result.stderr.blue, index);
            }
          })
          .catch((err) => {
            if (!err.killed) {
              console.info(err.stderr.red); //* Print the jest result
              if (columnNames.length > 0) {
                createTable(suiteIdentifier, err.stderr.red, index);
              }
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
