const linksToTest = require("./linksToTest.json");
const seleniumTest = require("./src/inMemorySelenium.js");

seleniumTest.searchForLinksOnFirstPage(linksToTest);
