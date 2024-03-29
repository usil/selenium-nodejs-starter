const os = require("os");
const fs = require("fs");
const path = require("path");

/**
 * 
 * @param {string} string String of text to clean
 * @returns {string}
 * @description
 * Clear the text string and return the clean string
 */
const getCleanedString = (string) => {
  // Characters we don't want to support
  var specialChars = "!@#$^&%*()+=-[]\/{}|:<>?,.";

  // Remove characters we don't support
  for (var i = 0; i < specialChars.length; i++) {
    string = string.replaceAll(new RegExp("\\" + specialChars[i], 'gi'), '');
  }

  // Convert to lowercase
  string = string.toLowerCase();

  // Replace spaces with "_"
  string = string.replace(/ /g, "_");

  // Replace special characters
  string = string.replace(/á/gi, "a");
  string = string.replace(/é/gi, "e");
  string = string.replace(/í/gi, "i");
  string = string.replace(/ó/gi, "o");
  string = string.replace(/ú/gi, "u");
  string = string.replace(/ñ/gi, "n");

  return string;
}

/**
 * 
 * @param {object} vars User-defined variables
 * @returns {object} Format for environment variables
 * 
 * @description
 * Converts sent variables to a specific format to store them in 
 * environment variables:
 * 
 * Example:
 * 
 * Defined Variables :
 *  "variables" : {
 *      "looneyTunes" : {
 *        "character": "coyote",
 *        "category" : "guns",
 *        "item": "bomb"
 *      },
 *     "cartoonNetwork" : {
 *        "character": "dexter",
 *        "category" : "laboratory",
 *        "item": "door"
 *      }
 *  }
 * 
 * Transforms them for use : 
 *  "variables" : {
 *    "lonneyTunes___character": "coyote",
 *    "lonneyTunes___category": "guns",
 *    "lonneyTunes___item": "bomb",
 *    "cartoonNetwork___character": "dexter",
 *    "cartoonNetwork___category": "laboratory",
 *    "cartoonNetwork___item": "door"
 *  }
 * 
 */
const formatVarsEnv = (vars) => {
  let vars_to_env = {};

  for (const propertyObject in vars) {
    /**
     * If the property does not have an object assigned, the property and its 
     * value are used for the vars_to_env
     */
    if (vars[propertyObject].length > 0) {
      let new_var = `
        {"${propertyObject}":"${vars[propertyObject]}"}
      `;

      new_var = JSON.parse(new_var)

      vars_to_env = { ...vars_to_env, ...new_var }
    }

    /**
     * If the property has an object assigned, the assigned object is iterated 
     * and the initial property is contacted with that of the contained object 
     * and assigning its value to this new property to add it to vars_to_env
     */
    else {
      for (const propertyValue in vars[propertyObject]) {
        let new_var = `
          {"${propertyObject}___${propertyValue}":"${vars[propertyObject][propertyValue]}"}
        `;

        new_var = JSON.parse(new_var)

        vars_to_env = { ...vars_to_env, ...new_var }
      }
    }
  }

  return vars_to_env;
}

/**
 * 
 * @param {string} variable Variable to get from environment variables
 * @returns {string | number} Variable obtained from environment variables
 * 
 * @description 
 * Gets the transformed environment variables
 * 
 * How to use:
 *  Para las propiedades definidas:
 *  "variables" : {
 *    "lonneyTunes___character": "coyote",
 *    "lonneyTunes___category": "guns",
 *    "lonneyTunes___item": "bomb",
 *    "cartoonNetwork___character": "dexter",
 *    "cartoonNetwork___category": "laboratory",
 *    "cartoonNetwork___item": "door"
 *  }
 * 
 * In case you want to get the "lonneyTunes___character" property:
 * 
 * Call the function with the format: object.key
 * 
 * Example :
 * 
 * Run function : getVariable('lonneyTunes.character')
 * 
 * This returns : "coyote"
 * 
 */
const getVariable = (variable) => {
  let var_search = variable.replace('.', '___');
  var_search = process.env[var_search];

  return var_search
}

/**
 * 
 * @param {array} results Test results array[object]
 * @returns {object} Order test results
 * 
 * @description
 * Sort the testResults alphabetically at the first level
 */
const sortTestResults = (results) => {

  // Return result if it only has one content
  if (results.length === 1)
    return results

  // Get the result object
  let object = results.slice(0);

  // Define the type of separator according to the system
  const OS_SPLIT = os.type() === "Windows_NT" ? "\\" : "/";

  // Get the results in alphabetical order at the first level
  object.sort((firstElement, secondElement) => {
    let first = firstElement.name.split(OS_SPLIT)
    let second = secondElement.name.split(OS_SPLIT)

    const testsIndex = first.indexOf('tests')

    first = first.slice(testsIndex + 1)
    second = second.slice(testsIndex + 1)

    first = first[0].toLowerCase()
    second = second[0].toLowerCase()

    return first < second ? -1 : first > second ? 1 : 0
  })

  return object
}

/**
 * 
 * @param {object} driver Selenium driver
 * @param {string} filePath Path where the test is executed
 * @param {string} screenshotAlias
 * @param {string} error_screen
 * 
 * @description
 * Take a screenshot of the window that is being navigated with the driver, 
 * save this capture in screenshots grouped by the first column of the test
 */
const takeScreenshot = async ({ driver, filePath, screenshotAlias, error_screen = false }) => {
  const SPLIT_PATH = os.type() === 'Windows_NT' ? '\\' : '/';
  const TEST_UUID = getVariable('TEST_UUID');
  const EXECUTION_SUITE = getVariable('EXECUTION_SUITE');
  const DEFAULT_PATH =
    error_screen
      ? `.${SPLIT_PATH}report${SPLIT_PATH}${TEST_UUID}${SPLIT_PATH}${EXECUTION_SUITE}${SPLIT_PATH}screenshots`
      : '.${SPLIT_PATH}screenshots';

  // Get the execution path of the test and add the folder for the test id
  let file_path = filePath.split(SPLIT_PATH);
  let tests_index = file_path.indexOf('tests');

  file_path = file_path.slice(tests_index + 1);
  file_path.unshift(TEST_UUID);

  // Take the screenshot
  const screenshot = await driver.takeScreenshot();

  /**
   * File name : create a sanitized file name from screenshot alias
   */
  const file = `${getCleanedString(screenshotAlias)}.jpg`;

  // Verify that the default folder for screenshots exists
  if (!fs.existsSync(DEFAULT_PATH))
    await fs.promises.mkdir(DEFAULT_PATH, { recursive: true })

  // Build the screenshot path
  let screenshot_test_path = '';
  if (!error_screen) {
    file_path.map((el) => {
      screenshot_test_path += `${SPLIT_PATH}${el}`
    })
  } else {
    file_path.map((el, index) => {
      if (index > 0) {
        screenshot_test_path += `${SPLIT_PATH}${el}`
      }
    })
  }


  // Create the folders to save the screenshot
  await fs.promises.mkdir(path.join(DEFAULT_PATH, screenshot_test_path), { recursive: true })

  // Create the file in the defined path
  fs.writeFile(
    `${DEFAULT_PATH}${screenshot_test_path}${SPLIT_PATH}${file}`,
    await screenshot,
    { encoding: 'base64' },
    (err) => {
      if (err) {
        console.log(err)
      } else {
        console.log('File written successfully\n', `${file}`)
      }
    }
  )
}

/**
 * 
 * @param {string | number} suiteIdentifier Test Suite Identifier
 * @param {number} virtualUser Test run number
 * @param {string} testUuid Running test identifier
 * @description
 * Adapt the test results to three columns and then call the function 
 * to create the web report
 */
const createReportHTML = async (suiteIdentifier, virtualUser, testOptions, testUuid) => {
  /**
   * @description
   * Receive the seconds and return in hh:mm:ss format
   * 
   * @returns {string}
   */
  function __secondsToDurationStr(seconds) {
    let hour = Math.floor(seconds / 3600);
    hour = (hour < 10) ? '0' + hour : hour;

    let minute = Math.floor((seconds / 60) % 60);
    minute = (minute < 10) ? '0' + minute : minute;

    let second = Math.floor(seconds % 60);
    second = (second < 10) ? '0' + second : second;

    return hour + ':' + minute + ':' + second;
  }

  const { reportWeb, columnNames } = testOptions;
  const SPLIT_PATH = os.type() === "Windows_NT" ? "\\" : "/";
  const report_data_json = {};
  let test_exec_time = 0;

  /**
   * Verify that the report is generated in HTML
   */
  if (!reportWeb)
    return;

  const jestOutput = require(`..${SPLIT_PATH}..${SPLIT_PATH}${suiteIdentifier}-jest-output.json`);
  let testResults = sortTestResults(jestOutput.testResults);

  const dataToReport = [];

  /**
   * Preparar los datos para el reporte web
   */
  for (const testResult of testResults) {
    const path = testResult.name.split(SPLIT_PATH)

    const testIndex = path.indexOf("tests");

    if (testIndex === -1) {
      console.log(
        `${path[path.length - 1]} test is not inside the correct directory.`
          .yellow
      );
      continue;
    }

    /**
     * Acumular la duración de ejecución de los test
     */
    test_exec_time += (testResult.endTime - testResult.startTime)

    let tableValues = path.slice(testIndex + 1, path.length);

    /**
     * Adjust the columns for the web report
     */
    let fixedColumns = [];

    /**
     * The first is always used for column 'C1'
     */
    fixedColumns.push(tableValues[0]);

    /**
     * Iterate and concatenate the folder to fixed
     */
    let dynamicColumn = '';
    for (let index = 0; index < tableValues.length - 1; index++) {
      index === 0 ? false : dynamicColumn += '/';
      dynamicColumn += `${tableValues[index]}`;
    }

    /**
     * Add the fixed column 'C2'
     */
    fixedColumns.push(dynamicColumn);

    /**
     * Add the value of the last column 'C3'
     */
    fixedColumns.push(tableValues[tableValues.length - 1].split('.test')[0]);

    if (fixedColumns) {
      /**
       * Build the array for the errors
       */
      let error_log = [];

      for (const assertionResult of testResult.assertionResults) {
        const {
          ancestorTitles,
          failureMessages,
          title
        } = assertionResult;

        let error_image_name = getCleanedString(`${ancestorTitles} - ${title}`)
        let error_image_path = 'screenshots';
        tableValues.map(el => {
          error_image_path += `/${el}`;
        })
        error_image_path += `/${error_image_name}.jpg`

        if (failureMessages.length > 0) {
          error_log.push({
            error_log: `${title}\n${failureMessages[0]}`,
            screenshot: error_image_path.replaceAll(' ', '%20')
          })
        }
      }

      let value = [
        ...fixedColumns,
        ...[
          testResult.status === "passed"
            ? testResult.status
            : testResult.status
        ],
        error_log
      ];
      dataToReport.push(value);
    }
  }

  /**
   * Create the web report
   */
  report_data_json.duration = __secondsToDurationStr(test_exec_time / 1000)
  report_data_json.columnsData = dataToReport;

  report_data_json.report_name = testUuid;
  report_data_json.passed = jestOutput.numPassedTests;
  report_data_json.failed = jestOutput.numFailedTests;
  report_data_json.total = jestOutput.numTotalTests;
  report_data_json.date = new Date(jestOutput.startTime).toString()

  try {
    const index =
      fs.readFileSync(
        `.${SPLIT_PATH}src${SPLIT_PATH}helpers${SPLIT_PATH}ReportTemplate${SPLIT_PATH}index.html`,
        { encoding: 'utf8' }
      );

    let result = index.replace(/#data_report/g, JSON.stringify(report_data_json));
    result = result.replace(/#columns_name/g, JSON.stringify(columnNames));
    result = result.replace(/#report_duration/g, report_data_json.duration);

    // Verify that the default folder for report exists
    if (!fs.existsSync(`.${SPLIT_PATH}report${SPLIT_PATH}${testUuid}${SPLIT_PATH}${virtualUser}${SPLIT_PATH}`)) {
      await fs.promises.mkdir(
        `.${SPLIT_PATH}report${SPLIT_PATH}${testUuid}${SPLIT_PATH}${virtualUser}${SPLIT_PATH}`,
        { recursive: true }
      );
    }

    fs.writeFileSync(
      `.${SPLIT_PATH}report${SPLIT_PATH}${testUuid}${SPLIT_PATH}${virtualUser}${SPLIT_PATH}index.html`,
      result,
      'utf-8'
    );
  } catch (err) {
    console.log(err)
  }
};

module.exports = {
  formatVarsEnv,
  getVariable,
  sortTestResults,
  takeScreenshot,
  createReportHTML
}
