const webdriver = require('./webdriver')
const navigator = require('./navigator')
const files = require('./files')

const run = async () => {
  const driver = await webdriver.build()

  try {
    await navigator.login(driver)
    await navigator.tour(driver)
  } catch (err) {
    files.log.write(err)
    driver.quit()
  } finally {
    await files.log.writeBrowserOutput(driver)
    driver.quit()
  }
}

run()
