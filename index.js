const formidable = require("formidable")
const converter = require("./lib/converter")
const winston = require("winston")
const http = require("http")
const url = require("url")

function requestData(request) {
  return new Promise((resolve, reject) => {
    let form = new formidable.IncomingForm()
    form.parse(request, (err, fields, files) => {
      if (err) return reject(err)

      let query = url.parse(request.url, true).query

      resolve({ fields, files, query })
    })
  })
}

function requestToUri(request) {
  return new Promise((resolve, reject) => {
    requestData(request).then(({ fields, files, query }) => {
      if (query.url) return resolve(query.url)

      if (fields.url) {
        let formUrl = url.parse(fields.url)
        if (formUrl) return resolve(formUrl.href)
        return reject()
      }

      if (files.html) return resolve(`file://${files.html.path}`)
    })
  })
}

function handler(request, response) {
  switch (request.url) {
    case "/favicon.ico":
      response.writeHead(200, { "Content-Type": "image/x-icon" })
      response.end()
      break

    case "/status":
      response.writeHead(200)
      response.end()
      break

    default:
      requestToUri(request)
        .then(converter.uriToPdf)
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

http.createServer(handler).listen(process.env.PORT)
winston.info(`Listening Port ${process.env.PORT}`)
