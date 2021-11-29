const jestOutput = require("./jest-output.json");
const Table = require("cli-table");
require("colors");

const table = new Table({
  head: [
    "#".blue,
    "Business Unit".blue,
    "Department".blue,
    "Web".blue,
    "Scenario".blue,
    "Passed".blue,
  ],
  colWidths: [5, 20, 20, 20, 40, 20],
  colors: true,
});

let index = 0;

for (const testResult of jestOutput.testResults) {
  const path = testResult.name.split("\\");

  table.push([
    (index + 1).toString(),
    path[path.length - 5],
    path[path.length - 4],
    path[path.length - 3],
    path[path.length - 2],
    testResult.status === "passed"
      ? testResult.status.green
      : testResult.status.red,
  ]);
}

console.log(table.toString());
