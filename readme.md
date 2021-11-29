# SELENIUM NODEJS STARTER v1.0.0

This library combines selenium with jest asserts to create a report.

## REQUIREMENTS

- nodejs > 14

## Chromedriver

This library uses the `chromedriver` package, by default it will use the latest chromedriver. Use `npm install chromedriver --detect_chromedriver_version` if you want to detect and install the version of chrome that you have. For more info take a look at [chromedriver](https://www.npmjs.com/package/).

## USAGE

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

![Result Example](https://i.ibb.co/6m1GBNV/test.jpg)

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
