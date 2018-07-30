const puppeteer = require('puppeteer')
const defaults = require('../configurations/defaults')

let activeBrowser

const puppeteerArgs = [
  '--no-sandbox',
  '--disable-setuid-sandbox',
  '--disable-gpu'
]

const allowedOptions = [
  'scale',
  'displayHeaderFooter',
  'headerTemplate',
  'footerTemplate',
  'printBackground',
  'format',
  'landscape',
  'pageRanges',
  'width',
  'height',
  'margin'
]

const formatOptions = options =>
  allowedOptions.reduce((filtered, key) => {
    if (options[key] == 'true') {
      filtered[key] = true
      return filtered
    }

    if (options[key] == 'false') {
      filtered[key] = false
      return filtered
    }

    if (!isNaN(options[key])) {
      filtered[key] = +options[key]
      return filtered
    }

    filtered[key] = options[key]
    return filtered
  }, {})

const pageToPdf = async (page, options) => {
  await page.goto(options.uri, { waitUntil: 'networkidle2' })

  const pdf = await page.pdf(Object.assign(defaults, formatOptions(options)))

  return pdf
}

const uriToPdf = async options => {
  const page = await activeBrowser.newPage()

  const pdf = await pageToPdf(page, options)

  page.close()

  return pdf
}

const launchChrome = async () => {
  activeBrowser = await puppeteer.launch({ args: puppeteerArgs })
}

module.exports = {
  uriToPdf,
  launchChrome
}
