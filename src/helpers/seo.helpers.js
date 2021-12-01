const { By, Key, until } = require("selenium-webdriver");

const seoHelpers = {
  getSearchPosition: async (driver, findStringDreams, urlColoringDreams) => {
    try {
      const searchBox = driver.findElement(By.name("q"));
      await searchBox.sendKeys(findStringDreams, Key.RETURN);
      const searchList = await driver.wait(
        until.elementLocated(By.id("rso")),
        5 * 1000
      );
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
