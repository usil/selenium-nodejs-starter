const seoHelpers = require("../../../../../src/helpers/seo.helpers");
const getBrowserDriver = require("../../../../../src/browsers/browserDriver");
const { getVarEnv, driverScreenshot } = require("../../../../../src/helpers/testHelpers");

const url = getVarEnv("url");
const findString = getVarEnv("searchText");

describe(`Link ${url} appears on the first 4 positions in the google search`, () => {
  let driver;
  let testStatus = false;
  const linkFirst = `Link for the ${findString} appears in the first 4 positions`;

  beforeAll(async () => {
    driver = await getBrowserDriver();
  });

  beforeEach(async () => {
    await driver.get("http://www.google.com");
    testStatus = false
  });

  it(linkFirst, async () => {
    const linkIndex = await seoHelpers.getSearchPosition(
      driver,
      findString,
      url
    );

    expect(linkIndex).toBeGreaterThan(-1);
    expect(linkIndex).toBeLessThan(4);
    testStatus = true;
  });

  afterEach(async () => {
    if (!testStatus) {
      console.log(`Screenshot for the failed test: ${linkFirst}`)
      driverScreenshot(driver, __filename)
    }
  })

  // it(`Link for the ${findStringDreams} appears in the first 4 positions`, async () => {
  //   const linkIndex = await seoHelpers.getSearchPosition(
  //     driver,
  //     findStringDreams,
  //     urlColoringDreams
  //   );
  //   expect(linkIndex).toBeGreaterThan(-1);
  //   expect(linkIndex).toBeLessThan(4);
  // });

  afterAll(async () => {
    await driver.quit();
  });
});
