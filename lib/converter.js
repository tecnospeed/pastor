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

const setupPage = mediaType => page =>
  new Promise((resolve, reject) => {
    page.emulateMedia(mediaType).then(
      () => resolve(page),
      cause => reject("cannot set media type " + mediaType + ": " + cause)
    )
  })

const browserToPdf = (uri, settings) => browser =>
  browser
    .newPage()
    .then(setupPage(settings.mediaType))
    .then(pageToPdf(uri))
    .then(pdf => {
      browser.close()
      return pdf
    })

const uriToPdf = (uri, settings) =>
  puppeteer
    .launch({ args: puppeteerArgs })
    .then(browserToPdf(uri, settings))

module.exports = {
  uriToPdf
}
