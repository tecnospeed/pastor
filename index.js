const formidable = require('formidable')
const { JSDOM } = require('jsdom')
const winston = require('winston')
const request = require('request')
const iconv = require('iconv-lite')
const http = require('http')
const tmp = require('tmp')
const url = require('url')
const qs = require('qs')
const fs = require('fs')

const converter = require('./lib/converter')

const requestData = request =>
  new Promise((resolve, reject) => {
    let form = new formidable.IncomingForm()
    form.parse(request, (err, fields, files) => {
      if (err) return reject(err)

      let options = qs.parse(url.parse(request.url).query)

      resolve({ fields, files, options })
    })
  })

const uriToBuffer = uri =>
  new Promise((resolve, reject) =>
    request(
      { method: 'GET', url: uri, followAllRedirects: true, encoding: null },
      (err, response, body) => {
        if (err) return reject(err.message)
        return resolve(body)
      }
    )
  )

const stringToFile = string =>
  new Promise((resolve, reject) =>
    tmp.file((err, path) => {
      if (err) return reject(err.message)

      fs.writeFile(path, string, err => {
        if (err) return reject(err.message)

        return resolve(path)
      })
    })
  )

const uriFromData = ({ fields, files, options }) =>
  new Promise((resolve, reject) => {
    if (options.url) {
      options.uri = options.url

      return resolve(options)
    }

    if (options.custom_url) {
      return uriToBuffer(options.custom_url).then(buffer => {
        let string
        if (options.encoding) {
          string = iconv.decode(buffer, options.encoding)
        } else {
          string = buffer.toString()
        }

        if (options.delete) {
          let dom = new JSDOM(string)
          let node = dom.window.document.getElementById(options.delete)
          node.parentNode.removeChild(node)
          string = dom.serialize()
        }

        return stringToFile(string).then(path => {
          options.uri = `file://${path}`
          return resolve(options)
        })
      })
    }

    if (fields.url) {
      let formUrl = url.parse(fields.url)

      if (!formUrl) return reject()

      options.uri = formUrl.href

      return resolve(options)
    }

    if (fields.html) {
      return stringToFile(fields.html).then(path => {
        options.uri = `file://${path}`
        return resolve(options)
      })
    }

    if (files.html) {
      options.uri = `file://${files.html.path}`

      return resolve(options)
    }

    return reject('no url/html provided')
  }).then(options => {
    winston.info('requested', options)

    return options
  })

const handler = (request, response) => {
  switch (request.url) {
    case '/favicon.ico':
      response.writeHead(200, { 'Content-Type': 'image/x-icon' })
      response.end()
      break

    case '/status':
      response.writeHead(200)
      response.end()
      break

    default:
      requestData(request)
        .then(uriFromData)
        .then(converter.uriToPdf)
        .then(pdf => {
          response.writeHead(200, {
            'Content-Type': 'application/pdf',
            'Content-Length': pdf.byteLength
          })
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
