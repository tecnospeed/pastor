const url = require("url")
const http = require("http")
const winston = require("winston")
const puppeteer = require("puppeteer")
const formidable = require("formidable")

function printUri(uri) {
  return new Promise((resolve, reject) => {
    if (!uri) return reject("no url/html provided")
    winston.info(`requested: ${uri}`)

    let args = ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"]

    puppeteer
      .launch({ args })
      .then(async browser => {
        let page = await browser.newPage()

        await page.goto(uri, { waitUntil: "networkidle" })

        resolve(
          await page.pdf({
            format: "A4"
          })
        )

        browser.close()
      })
      .catch(reject)
  })
}

function pickUri(request) {
  return new Promise((resolve, reject) => {
    let query = url.parse(request.url, true).query
    if (query.url) return resolve(query.url)

    let form = new formidable.IncomingForm()
    form.parse(request, (err, fields, files) => {
      if (err) return reject(err)

      let formUrl = fields.url && url.parse(fields.url)
      if (formUrl) return resolve(formUrl.href)

      if (files.html) return resolve(`file://${files.html.path}`)

      return resolve()
    })
  })
}

function handler(request, response) {
  if (request.url === "/favicon.ico") {
    response.writeHead(200, { "Content-Type": "image/x-icon" })
    response.end()
    return
  }

  pickUri(request)
    .then(printUri)
    .then(pdf => {
      response.writeHead(200, { "Content-Type": "application/pdf" })
      response.end(pdf)
    })
    .catch(err => {
      response.writeHead(400, { "Content-Type": "text/plain" })
      response.end()
      winston.error(err)
    })
}

http.createServer(handler).listen(process.env.PORT)
winston.info(`Listening Port ${process.env.PORT}`)
