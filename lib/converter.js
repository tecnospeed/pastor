const puppeteer = require("puppeteer")
const defaults = require("../configurations/defaults")

const puppeteerArgs = [
  "--no-sandbox",
  "--disable-setuid-sandbox",
  "--disable-gpu"
]


const allowedOptions = [
  "scale",
  "displayHeaderFooter",
  "printBackground",
  "format",
  "landscape",
  "pageRanges",
  "width",
  "height",
  "margin"
]

const formatOptions = options => allowedOptions.reduce((filtered, key) => {
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

const pageToPdf = options => page =>
  page
    .goto(options.uri, { waitUntil: "networkidle" })
    .then(() => page.pdf(Object.assign(defaults, formatOptions(options))))

const browserToPdf = options => browser =>
  browser
    .newPage()
    .then(pageToPdf(options))
    .then(pdf => {
      browser.close()
      return pdf
    })

const uriToPdf = options =>
  puppeteer
    .launch({ args: puppeteerArgs })
    .then(browserToPdf(options))

module.exports = {
  uriToPdf
}
