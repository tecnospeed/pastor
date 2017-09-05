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

const pageToPdf = uri => page =>
  page.goto(uri, { waitUntil: "networkidle" }).then(() => page.pdf(pdfOptions))

const browserToPdf = uri => browser =>
  browser
    .newPage()
    .then(pageToPdf(uri))
    .then(pdf => {
      browser.close()
      return pdf
    })

const uriToPdf = uri =>
  puppeteer
    .launch({ args: puppeteerArgs })
    .then(browserToPdf(uri))

module.exports = {
  uriToPdf
}
