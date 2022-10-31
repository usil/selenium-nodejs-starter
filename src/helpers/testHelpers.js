const os = require("os");
const fs = require("fs")
const path = require("path")

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
 * Run function : getVarEnv('lonneyTunes.character')
 * 
 * This returns : "coyote"
 * 
 */
const getVarEnv = (variable) => {
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
 * 
 * @description
 * Take a screenshot of the window that is being navigated with the driver, 
 * save this capture in screenshots grouped by the first column of the test
 */
const driverScreenshot = async (driver, filePath, runningTest) => {
  const SPLIT_PATH = os.type() === "Windows_NT" ? "\\" : "/";
  const DEFAULT_PATH = './screenshots';
  const TEST_UUID = getVarEnv('TEST_UUID');

  // Get the execution path of the test and add the folder for the test id
  let file_path = filePath.split(SPLIT_PATH);
  let tests_index = file_path.indexOf('tests');

  file_path = file_path.slice(tests_index + 1);
  file_path.unshift(TEST_UUID);

  // Take the screenshot
  const screenshot = await driver.takeScreenshot();

  // Create file name
  let date = new Date();
  let screenshot_date =
    date.toLocaleDateString().replaceAll('/', '_') + '_' +
    date.toLocaleTimeString('en-US', { hour12: false }).replaceAll(':', '-');

  // Get id test 
  if (runningTest) {
    var running_test = runningTest.split('-')[0].trim()
  }

  /**
   * File name : ID Test + Scenario + Date
   */
  const file =
    `${running_test} - ${file_path.pop().split('.test')[0]} _ ${screenshot_date}.png`

  // Verify that the default folder for screenshots exists
  if (!fs.existsSync(DEFAULT_PATH))
    await fs.promises.mkdir(DEFAULT_PATH)

  // Build the screenshot path
  let screenshot_test_path = '';
  file_path.map(el => {
    screenshot_test_path += `${SPLIT_PATH}${el}`
  })

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

module.exports = {
  formatVarsEnv,
  getVarEnv,
  sortTestResults,
  driverScreenshot
}