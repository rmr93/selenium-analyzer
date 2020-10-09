const fs = require('fs')
const { logging } = require('selenium-webdriver')

const getLogFileName = () => {
  const date = new Date()
  const year = date.getFullYear()
  const month = date.getMonth().toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const seconds = date.getSeconds().toString().padStart(2, '0')
  
  return year + month + day + hours + minutes + seconds + '.txt'
}

const logFileName = getLogFileName()

const write = (entries, serialize) => {
  if (entries) {
    if (entries.length) {
      return entries.forEach(entrie => {
        const e = serialize ? JSON.stringify(entrie, null, 2) : entrie
        fs.appendFileSync(`${__dirname}/logs/${logFileName}`, e)
      })
    }

    const e = serialize ? JSON.stringify(entries, null, 2) : entries
    fs.appendFileSync(`${__dirname}/logs/${logFileName}`, e)
  }
}

const writeBrowserOutput = async (driver) => {
  const entries = await driver.manage().logs().get(logging.Type.BROWSER)
  write(entries, true)
}

module.exports = {
  log: {
    write,
    writeBrowserOutput,
    filename: logFileName
  }
}
