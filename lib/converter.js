const puppeteer = require("puppeteer")

const puppeteerArgs = [
  "--no-sandbox",
  "--disable-setuid-sandbox",
  "--disable-gpu"
]

const pdfOptions = {
  printBackground: true,
  format: "A4"
}

const pageToPdf = (page, uri) =>
  page.goto(uri, { waitUntil: "networkidle" }).then(() => page.pdf(pdfOptions))

const browserToPdf = (browser, uri) =>
  browser
    .newPage()
    .then(page => pageToPdf(page, uri))
    .then(pdf => {
      browser.close()
      return pdf
    })

const uriToPdf = uri =>
  puppeteer
    .launch({ args: puppeteerArgs })
    .then(browser => browserToPdf(browser, uri))

module.exports = {
  uriToPdf
}
