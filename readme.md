# Selenium Nodejs Starter v1.0.0

This library combines selenium with jest asserts to create a report.

## Requirements

- nodejs > 14

## Geckodriver (firefox)

This library uses the `geckodriver` package, by default it will use the latest geckodriver. Use `npm install geckodriver --GECKODRIVER_VERSION=<specific-version>` if you want to install an specific version. For more info take a look at [geckodriver](https://www.npmjs.com/package/geckodriver/).

## Chromedriver

This library uses the `chromedriver` package, by default it will use the latest chromedriver. Use `npm install chromedriver --detect_chromedriver_version` if you want to detect and install the version of chrome that you have. For more info take a look at [chromedriver](https://www.npmjs.com/package/).

## Test Configuration

The file `testOptions.json` will be read by the [advanced-settings](https://github.com/usil/advanced-settings.git) library. The options are:

| name                  | Description                                                                                                                                         | Default Value          | Required |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- | -------- |
| files                 | The files or directory that you want to test, stetting it to an empty array will test all files                                                     | []                     | false    |
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
  "virtualUserSuites": [
    {
      "identifier": "first-test"
    }
  ]
}
```

### Advanced

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

## Browser Configuration

Currently only firefox and chrome are supported. To indicate what to use set an env variable `BROWSER`, `BROWSER=firefox` for firefox and `BROWSER=chrome` for chrome, you can also create an .env file to set the variable. If you want to pass arguments to the browser modify the `browserOptions.json` file.

## Usage

You should follow a very strict folder structure:

    .
    ├── ...
    ├── business unit                 # In the example USIL
    │   ├── department                # In the example marketing
    |       ├── feature               # In the example google-seo
    |           ├── scenario1         # In the example shouldAppearFirstFour
    |               ├── scenario1.js  # In the example shouldAppearFirstFour.test.js
    └── ...

Then just create your tests using traditional jest and selenium. After that run `npm start`.

This is an example of the report that will be shown in the console.

![Result Example](https://i.ibb.co/xsP0xfw/report.png)

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
