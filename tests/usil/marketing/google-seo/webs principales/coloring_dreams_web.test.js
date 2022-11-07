const seoHelpers = require("../../../../../src/helpers/seo.helpers");
const getBrowserDriver = require("../../../../../src/browsers/browserDriver");
const { getVarEnv } = require("../../../../../src/helpers/testHelpers");
const webdriver = require('selenium-webdriver');
const By = webdriver.By;
const Key = webdriver.Key;
const until = webdriver.until;

describe(`Webs publicas deben de tener la url correcta`, () => {
  let driver;

  beforeAll(async () => {
    driver = await getBrowserDriver();
    global.driver = driver;
  });

  beforeEach(async () => {
    await driver.get("http://www.google.com");
  });
  
  it(`f3df52d3f598 coloring dreams debe tener la url esperada`, async () => {
    var searchBox = driver.findElement(By.name('q'));
    await searchBox.sendKeys('coloring dream', Key.RETURN);

    const searchList = driver.findElement(By.id("rso"));
    await driver.wait(until.elementIsVisible(searchList), 3000);
    const linksContainers = await searchList.findElements(By.className("g"));

    var firstResult = await linksContainers[0].getText();
    var urlRegex = /(https?:\/\/[^ ]*)/;
    var url = firstResult.match(urlRegex)[1];
    expect(url.split("\n")[0]).toBe("https://www.coloringdreams.com");

  });

  afterAll(async () => {
    await driver.quit();
  });
});
