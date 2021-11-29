const { By, Key, until } = require("selenium-webdriver");
require("chromedriver");

const seoHelpers = {
  getSearchPosition: async (driver, findStringDreams, urlColoringDreams) => {
    try {
      const searchBox = driver.findElement(By.name("q"));
      await searchBox.sendKeys(findStringDreams, Key.RETURN);
      await driver.wait(() => {
        return until.elementLocated(By.id("rso"));
      }, 3000);
      const searchList = driver.findElement(By.id("rso"));
      const linksContainers = await searchList.findElements(By.className("g"));
      const links = [];
      for (const linkContainer of linksContainers) {
        const aLink = await linkContainer.findElement(By.css("a"));
        const href = await aLink.getAttribute("href");
        links.push({ aLink, href });
      }
      const linkIndex = links.findIndex(
        (link) => link.href === urlColoringDreams
      );
      return linkIndex;
    } catch (error) {
      console.log(error);
    }
  },
};

module.exports = seoHelpers;
