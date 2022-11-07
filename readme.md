# Selenium Nodejs Starter

This framework combines selenium with jest asserts to create a report, takes screenshots, and other features

## Requirements

- nodejs >= 14
- chrome or firefox. More details here: https://github.com/usil/selenium-nodejs-starter/wiki/Supported-Browsers

## One click usage (chrome)

By default there are two test, to execute them, run this

```
npm uninstall chromedriver
npm install chromedriver --detect_chromedriver_version
npm install
npm run test
```

This will give a your a report like this

![image](https://user-images.githubusercontent.com/3322836/200095302-3f7c81d9-239e-41c7-bfd9-36ccdb5203dd.png)

Also you could simulate an error in some expect, run again and check the screenshots folder with the test uuid

`screenshots/99ede1f9-f2ef-45e7-baad-403f1abf76c5/usil/foo/bar/baz.test.js/describe-name-test-name.png`

## Usage

Just add your new test into the `./tests` folder using your own tree structure

## Advanced Configurations

### testOptions.json

You will have a `testOptions.json` file in the root of this project, you should only change the variables inside `virtualUserSuites`. You can also limit the files to test in the `files` arrays setting the name of the tests files that you want to test.

| name                  | Description                                                                                                                                         | Default Value          | Required |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- | -------- |
| files                 | The files or directory that you want to test, setting it to an empty array will test all files                                                      | []                     | false    |
| reportWeb             | Generate report on Web(HTML)                                                                                                                        | false                  | true     |
| reportMode            | Change the type of report keeping its default structure or adjusting the report columns                                                             | staticDeep             | true     |
| columnNames           | The name of the columns that will be related to the directory structure                                                                             | []                     | true     |
| virtualUserSuites     | The number of whole test suites you want to simulate and its specific configurations and variables, each test virtual user suite represents 1 user. | virtualUserSuite array | true     |
| virtualUserMultiplier | If you want to execute more users. It multiplies the virtualUserSuites.                                                                             | 1                      | false    |

A `virtualUserSuite` object has the following properties:

| name       | Description                                                                       | Default Value                             | Required |
| ---------- | --------------------------------------------------------------------------------- | ----------------------------------------- | -------- |
| identifier | An identifier for this test suite                                                 | Will default to the position in the array | true     |
| skip       | The app will skip this test suite                                                 | false                                     | false    |
| files      | If the length of the array is more than 0 will overwrite the global files options | []                                        | false    |
| variables  | Global variables for all of the test of this suite                                | null                                      | false    |

Example of an empty `testOptions.json` file

```json
{
  "files": [],
  "virtualUserMultiplier": 1,
  "reportWeb":true,
  "reportMode": "staticDeep",
  "columnNames": ["enterprise", "feature", "scenario"],
  "virtualUserSuites": [
    {
      "skip": false,
      "identifier": "first-test",
      "files": [],
      "variables": {
        "acmeBaseUrl": "https://acme.com"        
      }
    }
  ]
}
```

> In case sensitive data is required, it can be obtained directly from the environment variables

Example in `testOptions.json` file

```json
{
  "files": [],
  "virtualUserMultiplier": 1,
  "reportWeb":true,
  "reportMode": "staticDeep",
  "columnNames": ["enterprise", "feature", "scenario"],
  "virtualUserSuites": [
    {
      "skip": false,
      "identifier": "first-test",
      "files": [],
      "variables": {
        "acmeBaseUrl": "https://acme.com"        
        "acmeApiKey": "${API_KEY}"
      }
    }
  ]
}

```

Just expose or inject them before the test execution. Linux sample:

```
export API_KEY="changeme"
```

### browserOptions.json

You will have a `browserOptions.json` file in the root of this project. Where you can add or remove the options of the browser that selenium executes. Most of those variables should not be touched unless you know what you are doing. The `--headless` option can be removed to not run in it a non headless mode.

```json
{
  "arguments": ["--log-level=1", "--headless", "--no-sandbox", "--disable-gpu"]
}
```

### Shell variables

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

### Custom columns

By default this framework only prints 3 columns. If you need to have more columns visit [Settings Shell Report](https://github.com/usil/selenium-nodejs-starter/wiki/Settings---Shell--Report#how-to-use-reportmode) and use the **defaultMode** 

## Contributors

<table>
  <tbody>
    <td>
      <img src="https://avatars0.githubusercontent.com/u/3322836?s=460&v=4" width="100px;"/>
      <br />
      <label><a href="http://jrichardsz.github.io/">JRichardsz</a></label>
      <br />
    </td>  
    <td>
      <img src="https://i.ibb.co/88Tp6n5/Recurso-7.png" width="100px;"/>
      <br />
      <label><a href="https://github.com/TacEtarip">Luis Huertas</a></label>
      <br />
    </td>
    <td>
      <img src="https://avatars.githubusercontent.com/u/55628495?v=4" width="100px;"/>
      <br />
      <label><a href="https://aj-derteano.github.io/">AJ Derteano</a></label>
      <br />
    </td>
  </tbody>
</table>
