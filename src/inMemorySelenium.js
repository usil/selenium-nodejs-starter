const { Builder, By, Key, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const colors = require("colors");

require("chromedriver");

const screen = {
  width: 640,
  height: 480,
};

const searchForLinksOnFirstPage = async (toTestArray) => {
  try {
    const driver = await new Builder()
      .forBrowser("chrome")
      .setChromeOptions(
        new chrome.Options()
          .addArguments("--log-level=1")
          .headless()
          .windowSize(screen)
      )
      .build();

    for (const test of toTestArray) {
      console.log(
        colors.bold.white.bgBlue(
          `==============STARTING SEARCH ON ${test.searchParams}=============\n`
        )
      );
      await driver.get("http://www.google.com");
      await searchLinkInPlaceFromGoogleSearch(
        driver,
        test.searchParams,
        test.url,
        test.checkItLoads
      );
      console.log(
        colors.bold.white.bgBlue(`==============FINISHED=============\n`)
      );
    }
    // await searchList.findElements(
    //   By.xpath('//a[@href="' + url + '"]')
    // );
    await driver.quit();
  } catch (error) {
    console.log(error);
  }
};

const dtDriverGet = async (driver, url) => {
  try {
    await driver.get(url);
    return true;
  } catch (error) {
    return false;
  }
};

const searchLinkInPlaceFromGoogleSearch = async (
  driver,
  findString,
  url,
  checkItLoads = false
) => {
  try {
    const searchBox = driver.findElement(By.name("q"));
    await searchBox.sendKeys(findString, Key.RETURN);
    await driver.wait(() => {
      return until.elementLocated(By.id("rso"));
    }, 3000);
    const searchList = driver.findElement(By.id("rso"));
    const linksContainers = await searchList.findElements(By.className("g"));
    const links = [];
    for (const linkContainer of linksContainers) {
      const aLink = await linkContainer.findElement(By.css("a"));
      const href = await aLink.getAttribute("href");
      console.log(colors.white(`-> Link: ${href}`));
      links.push({ aLink, href });
    }
    const linkIndex = links.findIndex((link) => link.href === url);
    if (linkIndex === -1) {
      console.error(
        colors.bold.red(`\nThe link ${url} is not showing in the search\n`)
      );
    } else if (linkIndex > 3) {
      console.warn(
        colors.bold.yellow(
          `\nThe link ${url} is not between the first 4 results\n`
        )
      );
    } else {
      console.info(
        colors.bold.green(
          `\nThe link ${url} is at the ${linkIndex + 1} search position \n`
        )
      );
    }
    if (checkItLoads) {
      console.info(
        colors.bold.bgMagenta("The page loading will be verified\n")
      );
      const loadedHS = await dtDriverGet(driver, url);
      if (loadedHS) {
        console.info(colors.bold.green(`${url} loaded correctly\n`));
      } else {
        console.info(colors.bold.red(`${url} did not load\n`));
      }
    }
  } catch (error) {
    console.error(error);
  }
};

module.exports = { searchForLinksOnFirstPage };
