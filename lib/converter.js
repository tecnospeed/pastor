const puppeteer = require("puppeteer")
const defaults = require("../configurations/defaults")

let activeBrowser

const puppeteerArgs = [
  "--no-sandbox",
  "--disable-setuid-sandbox",
  "--disable-gpu"
];


const allowedOptions = [
  "scale",
  "displayHeaderFooter",
  "headerTemplate",
  "footerTemplate",
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

const pageToPdf = (page, options) =>
  page
    .goto(options.uri, { waitUntil: "networkidle2", timeout: process.env.TIMEOUT })
    .then(() => page.pdf(Object.assign(defaults, formatOptions(options))))

const uriToPdf = (options) => {
  let activePage
  return activeBrowser
    .newPage()
    .then(page => {
      activePage = page
      return pageToPdf(page, options)
    })
    .then(pdf => {
      activePage.close()
      return pdf
    })
}

const launchChrome = () => 
  puppeteer
    .launch({ args: puppeteerArgs})
    .then((browser) => {
      activeBrowser = browser
    })

module.exports = {
  uriToPdf,
  launchChrome
}
