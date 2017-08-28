const browser = require("./lib/browser")
const winston = require("winston")
const http = require("http")
const url = require("url")

function requestToUri(request) {
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
  switch (request.url) {
    case "/favicon.ico":
      response.writeHead(200, { "Content-Type": "image/x-icon" })
      response.end()
      break

    default:
      requestToUri(request)
        .then(browser.uriToPdf)
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
}

browser.instance().then(() => {
  http.createServer(handler).listen(process.env.PORT)
  winston.info(`Listening Port ${process.env.PORT}`)
})
