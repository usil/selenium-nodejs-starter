# Selenium Nodejs Starter v1.0.0

This library combines selenium with jest asserts to create a report.

## Requirements

- nodejs > 14

## Steps to run the tests

- [Set the webdriver to use](#supported-browsers)
- [Set the test parameters](#variables-table)
- [Set the browser parameters](#json-example)
- [Set the shell parameters](#configurations-shell)
- [Setting the test files](#json-example)
- [Run the test](#run-the-test)

## Running the eventhos system

You can either use docker using the [eventhos repository](https://github.com/usil/eventhos) or run each component of eventhos system (database, api and web) separately on your own.

## Supported Browsers

The test library only supports chrome and firebox.

### Geckodriver (firefox)

This library uses the `geckodriver` package, by default it will use the latest geckodriver. Use `npm install geckodriver --GECKODRIVER_VERSION=<specific-version>` if you want to install an specific version. For more info take a look at [geckodriver](https://www.npmjs.com/package/geckodriver/)

### Chromedriver

This library uses the `chromedriver` package, by default it will use the latest chromedriver. Use `npm install chromedriver --detect_chromedriver_version` if you want to detect and install the version of chrome that you have. For more info take a look at [chromedriver](https://www.npmjs.com/package/). Set an environment variable `BROWSER` to `chrome`.

- Linux:

```cmd
export BROWSER=chrome
```

- Windows:

```cmd
set BROWSER=chrome
```

- .env file:

```text
BROWSER=chrome
```

## Configurations: testOptions.json

You will have a `testOptions.json` file in the root of this project, you should only change the variables inside `virtualUserSuites`. You can also limit the files to test in the `files` arrays setting the name of the tests files that you want to test.

### Variables table

| name                  | Description                                                                                                                                         | Default Value          | Required |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- | -------- |
| files                 | The files or directory that you want to test, setting it to an empty array will test all files                                                      | []                     | false    |
| customColumns         | The name of the columns that will be related to the directory structure                                                                             | []                     | true     |
| virtualUserSuites     | The number of whole test suites you want to simulate and its specific configurations and variables, each test virtual user suite represents 1 user. | virtualUserSuite array | true     |
| virtualUserMultiplier | If you want to execute more users. It multiplies the virtualUserSuites.                                                                             | 1                      | false    |

A `virtualUserSuite` object has the following properties:

| name       | Description                                                                       | Default Value                             | Required |
| ---------- | --------------------------------------------------------------------------------- | ----------------------------------------- | -------- |
| identifier | An identifier for this test suite                                                 | Will default to the position in the array | true     |
| skip       | The app will skip this test suite                                                 | false                                     | false    |
| files      | If the length of the array is more than 0 will overwrite the global files options | []                                        | false    |
| variables  | Global variables for all of the test of this suite                                | null                                      | false    |

### Example of an empty `testOptions.json` file

```json
{
  "files": [],
  "virtualUserMultiplier": 1,
  "customColumns": ["enterprise", "department", "feature", "scenario"],
  "virtualUserSuites": [
    {
      "skip": false,
      "identifier": "first-test",
      "files": [],
      "variables": {
        "url": "https://www.usil.edu.pe/?verified=true",
        "searchText": "USIL"
      }
    },
    {
      "skip": false,
      "identifier": "second-test",
      "files": [],
      "variables": {
        "url": "https://coloringdreams.com/",
        "searchText": "${SECRET_SEARCH}"
      }
    }
  ]
}
```

## Configurations: browserOptions.json

You will have a `browserOptions.json` file in the root of this project. Where you can add or remove the options of the browser that selenium executes. Most of those variables should not be touched unless you know what you are doing. The `--headless` option can be removed to not run in it a non headless mode.

### Json example

```json
{
  "arguments": ["--log-level=1", "--headless", "--no-sandbox", "--disable-gpu"]
}
```

## Configurations Shell

You can overwrite the files option adding `FILTERED_FILES` to your environment variables, separating the files or directories by an space.

In an .env file:

```text
FILTERED_FILES = test1.test.js test2.test.js
```

In linux:

```cmd
export FILTERED_FILES="test1.test.js test2.test.js"
```

In windows:

```cmd
set FILTERED_FILES="test1.test.js test2.test.js"
```

## Usage

### Directory structure

You should follow a strict folder structure under the `test` directory:

    .
    ├── ...
    ├── enterprise                 # In the example USIL
    │   ├── department                # In the example marketing
    |       ├── feature               # In the example google-seo
    |           ├── scenario1         # In the example shouldAppearFirstFour
    |               ├── scenario1.js  # In the example shouldAppearFirstFour.test.js
    └── ...

### Setting the folders as columns

In the `testOptions.json` file:

```json
{
  "customColumns": ["enterprise", "department", "feature", "scenario"]
}
```

Then just create your tests using traditional jest and selenium. After that run `npm install` and `npm test`.

This is an example of the report that will be shown in the console.

![Result Example](https://i.ibb.co/gT7fwSR/testexample.jpg)

## Contributors

<table>
  <tbody>
    <td>
      <img src="https://i.ibb.co/88Tp6n5/Recurso-7.png" width="100px;"/>
      <br />
      <label><a href="https://github.com/TacEtarip">Luis Huertas</a></label>
      <br />
    </td>
    <td>
      <img src="https://avatars0.githubusercontent.com/u/3322836?s=460&v=4" width="100px;"/>
      <br />
      <label><a href="http://jrichardsz.github.io/">JRichardsz</a></label>
      <br />
    </td>
  </tbody>
</table>
