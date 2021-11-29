const { Builder, By, Key, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const seoHelpers = require("../../../../helpers/seo.helpers");
require("chromedriver");

const screen = {
  width: 640,
  height: 480,
};

const urlUsil = "https://www.usil.edu.pe/?verified=true";
const findStringUsil = "USIL";

const urlColoringDreams = "https://coloringdreams.com/";
const findStringDreams = "coloring dreams";

describe(`Link ${urlUsil} appears on the first 4 positions in the google search`, () => {
  let driver;

  beforeAll(async () => {
    driver = await new Builder()
      .forBrowser("chrome")
      .setChromeOptions(
        new chrome.Options()
          .addArguments("--log-level=1")
          .headless()
          .windowSize(screen)
      )
      .build();
  });

  beforeEach(async () => {
    await driver.get("http://www.google.com");
  });

  it(`Link for the ${findStringUsil} appears in the first 4 positions`, async () => {
    const linkIndex = await seoHelpers.getSearchPosition(
      driver,
      findStringUsil,
      urlUsil
    );
    expect(linkIndex).toBeGreaterThan(-1);
    expect(linkIndex).toBeLessThan(4);
  });

  it(`Link for the ${findStringDreams} appears in the first 4 positions`, async () => {
    const linkIndex = await seoHelpers.getSearchPosition(
      driver,
      findStringDreams,
      urlColoringDreams
    );
    expect(linkIndex).toBeGreaterThan(-1);
    expect(linkIndex).toBeLessThan(4);
  });

  afterAll(async () => {
    await driver.quit();
  });
});
