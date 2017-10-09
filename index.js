const formidable = require("formidable")
const converter = require("./lib/converter")
const winston = require("winston")
const http = require("http")
const url = require("url")

const defaultMediaType = 'print'

const requestData = request =>
  new Promise((resolve, reject) => {
    let form = new formidable.IncomingForm()
    form.parse(request, (err, fields, files) => {
      if (err) return reject(err)

      let query = url.parse(request.url, true).query

      resolve({ fields, files, query })
    })
  })

const parseRequest = ({ fields, files, query }) =>
  Promise.all([
    uriFromData({ fields, files, query }),
    settingsFromData({ fields, query })
  ])

const uriFromData = ({ fields, files, query }) =>
  new Promise((resolve, reject) => {
    if (query.url) return resolve(query.url)

    if (fields.url) {
      let formUrl = url.parse(fields.url)
      if (formUrl) return resolve(formUrl.href)
      return reject()
    }

    if (files.html) return resolve(`file://${files.html.path}`)

    return reject("no url/html provided")
  }).then(uri => {
    winston.info(`requested: ${uri}`)
    return uri
  })

const settingsFromData = ({ fields, query }) =>
  new Promise((resolve, reject) => {
    let mediaType = query.mediaType || fields.mediaType || defaultMediaType
    resolve({ mediaType: mediaType })
  })

const handler = (request, response) => {
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
      requestData(request)
        .then(parseRequest)
        .then(([ uri, settings ]) => {
          return converter.uriToPdf(uri, settings)
        })
        .then(pdf => {
          response.writeHead(200, { "Content-Type": "application/pdf" })
          response.end(pdf)
        })
        .catch(reason => {
          response.writeHead(400)
          response.end()
          winston.warn(reason)
        })
  }
}

http.createServer(handler).listen(process.env.PORT)
winston.info(`Listening Port ${process.env.PORT}`)
