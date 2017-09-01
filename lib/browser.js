const puppeteer = require("puppeteer")
const winston = require("winston")

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
  })
}

function browserToPdf(browser, uri) {
  return new Promise((resolve, reject) => {
    browser
      .newPage()
      .then(page => pageToPdf(page, uri))
      .then(resolve) // Return the PDF before closing the browser instance
      .then(() => browser.close())
      .catch(reject)
  })
}

function uriToPdf(uri) {
  return new Promise((resolve, reject) => {
    if (!uri) return reject("no url/html provided")
    winston.info(`requested: ${uri}`)

    let args = ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"]

    puppeteer
      .launch({ args })
      .then(browser => browserToPdf(browser, uri))
      .then(resolve)
      .catch(reject)
  })
}

module.exports = {
  uriToPdf
}
