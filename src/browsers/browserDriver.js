const chrome = require("selenium-webdriver/chrome");
const firefox = require("selenium-webdriver/firefox");
const { Builder } = require("selenium-webdriver");

require("dotenv").config();

require("chromedriver");
require("geckodriver");

const browserOptions = require("../../browserOptions.json");

// * Required for headless
const screenSize = {
  width: 1080,
  height: 1080,
};

const browserDriver = {
  /**
   *
   * @returns WebDriver
   * @description Return the driver for chrome
   */
  chrome: async () => {
    const driver = await new Builder()
      .forBrowser("chrome")
      .setChromeOptions(
        new chrome.Options()
          .addArguments(...browserOptions.arguments)
          .windowSize(screenSize)
      )
      .build();
    return driver;
  },
  /**
   *
   * @returns WebDriver
   * @description Return the driver for firefox
   */
  firefox: async () => {
    const driver = await new Builder()
      .forBrowser("firefox")
      .setFirefoxOptions(
        new firefox.Options()
          .addArguments(...browserOptions.arguments)
          .windowSize(screenSize)
      )
      .build();
    return driver;
  },
};

const envBrowser = process.env.BROWSER;

const browser =
  envBrowser && (envBrowser === "chrome" || envBrowser === "firefox")
    ? envBrowser
    : "chrome";

const getBrowserDriver = browserDriver[browser];

module.exports = getBrowserDriver;
