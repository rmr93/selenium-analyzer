const { Builder } = require('selenium-webdriver')
const { Options } = require('selenium-webdriver/chrome')

const build = () => {
  const chromeOptions = new Options().addArguments(['--start-maximized'])

  return new Builder()
    .forBrowser('chrome')
    .setChromeOptions(chromeOptions)
    .build()
}

module.exports = {
  build
}
