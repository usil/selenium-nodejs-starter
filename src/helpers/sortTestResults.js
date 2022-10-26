const os = require("os");

/**
 * 
 * @param {array} results Test results
 * @returns {object}
 */
const sortTestResults = (results) => {

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

module.exports = sortTestResults