const formidable = require("formidable")
const puppeteer = require("puppeteer")
const winston = require("winston")

// "singleton" instance of the browser
let instance

function browserInstance() {
  return new Promise((resolve, reject) => {
    if (instance) return resolve(instance)
    winston.info("Creating new browser instance")

    let args = ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"]

    instance = puppeteer.launch({ args })

    return resolve(instance)
  })
}

function pageToPdf(page, uri) {
  return new Promise((resolve, reject) => {
    let pdfOptions = {
      format: "A4"
    }

    page
      .goto(uri, { waitUntil: "networkidle" })
      .then(() => page.pdf(pdfOptions))
      .then(resolve)
      .catch(reject)
      .then(() => page.close())
      .catch(winston.warn)
  })
}

function uriToPdf(uri) {
  return new Promise((resolve, reject) => {
    if (!uri) return reject("no url/html provided")
    winston.info(`requested: ${uri}`)

    browserInstance()
      .then(browser => browser.newPage())
      .then(page => pageToPdf(page, uri))
      .then(resolve)
      .catch(reject)
  })
}

module.exports = {
  instance: browserInstance,
  uriToPdf
}
