const seoHelpers = require("../../../../../src/helpers/seo.helpers");
const getBrowserDriver = require("../../../../../src/browsers/browserDriver");

const url = process.env.url;
const findString = process.env.searchText;

describe(`Link ${url} appears on the first 4 positions in the google search`, () => {
  let driver;

  beforeAll(async () => {
    driver = await getBrowserDriver();
  });

  beforeEach(async () => {
    await driver.get("http://www.google.com");
  });

  it(`Link for the ${findString} appears in the first 4 positions`, async () => {
    const linkIndex = await seoHelpers.getSearchPosition(
      driver,
      findString,
      url
    );
    expect(linkIndex).toBeGreaterThan(-1);
    expect(linkIndex).toBeLessThan(4);
  });

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
