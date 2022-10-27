const os = require("os");

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
 *        "character":"coyote",
 *        "category" : "guns",
 *        item":"bomb"
 *      },
 *     "cartoonNetwork" : {
 *        "character":"dexter",
 *        "category" : "laboratory",
 *        item":"door"
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
  let varsToEnv = {};

  for (const propertyObject in vars) {
    /**
     * If the property does not have an object assigned, the property and its 
     * value are used for the varsToEnv
     */
    if (vars[propertyObject].length > 0) {
      let newVar = `
        {"${propertyObject}":"${vars[propertyObject]}"}
      `;

      newVar = JSON.parse(newVar)

      varsToEnv = { ...varsToEnv, ...newVar }
    }

    /**
     * If the property has an object assigned, the assigned object is iterated 
     * and the initial property is contacted with that of the contained object 
     * and assigning its value to this new property to add it to varsToEnv
     */
    else {
      for (const propertyValue in vars[propertyObject]) {
        let newVar = `
          {"${propertyObject}___${propertyValue}":"${vars[propertyObject][propertyValue]}"}
        `;

        newVar = JSON.parse(newVar)

        varsToEnv = { ...varsToEnv, ...newVar }
      }
    }
  }

  return varsToEnv;
}

/**
 * 
 * @param {string} variable Variable to get from environment variables
 * @returns {string | number} Variable obtained from environment variables
 * 
 * @description 
 * Gets the transformed environment variables
 * 
 */
const getVarEnv = (variable) => {
  let varsSearch = variable.replace('.', '___');
  varsSearch = process.env[varsSearch];

  return varsSearch
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
  let osSplit = os.type() === "Windows_NT" ? "\\" : "/";

  // Get the results in alphabetical order at the first level
  object.sort((firstElement, secondElement) => {
    let first = firstElement.name.split(osSplit)
    let second = secondElement.name.split(osSplit)

    const testsIndex = first.indexOf('tests')

    first = first.slice(testsIndex + 1)
    second = second.slice(testsIndex + 1)

    first = first[0].toLowerCase()
    second = second[0].toLowerCase()

    return first < second ? -1 : first > second ? 1 : 0
  })

  return object
}

module.exports = { formatVarsEnv, getVarEnv, sortTestResults }