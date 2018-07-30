const formidable = require('formidable')
const { JSDOM } = require('jsdom')
const winston = require('winston')
const request = require('request-promise-native')
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
    form.keepExtensions = true
    form.parse(request, (err, fields, files) => {
      if (err) return reject(err)

      let options = qs.parse(url.parse(request.url).query)

      resolve({ fields, files, options })
    })
  })

const stringToFile = string =>
  new Promise((resolve, reject) =>
    tmp.file({ postfix: '.html' }, (err, path) => {
      if (err) return reject(err.message)

      fs.writeFile(path, string, err => {
        if (err) return reject(err.message)

        return resolve(path)
      })
    })
  )

const uriFromData = async ({ fields, files, options }) => {
  if (options.url) {
    options.uri = options.url

    return options
  }

  if (options.custom_url) {
    const body = await request({
      method: 'GET',
      url: options.custom_url,
      followAllRedirects: true,
      encoding: null
    })

    let string
    if (options.encoding) {
      string = iconv.decode(body, options.encoding)
    } else {
      string = body.toString()
    }

    if (options.delete) {
      let dom = new JSDOM(string)
      let node = dom.window.document.getElementById(options.delete)
      node.parentNode.removeChild(node)
      string = dom.serialize()
    }

    const path = await stringToFile(string)

    options.uri = `file://${path}`

    return options
  }

  if (fields.url) {
    let formUrl = url.parse(fields.url)

    if (!formUrl) return reject()

    options.uri = formUrl.href

    return options
  }

  if (fields.html) {
    const path = await stringToFile(fields.html)

    options.uri = `file://${path}`

    return options
  }

  if (files.html) {
    options.uri = `file://${files.html.path}`

    return options
  }

  throw new Error('no url/html provided')
}

const handler = async (request, response) => {
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
      try {
        const data = await requestData(request)

        const options = await uriFromData(data)

        winston.info('requested', options)

        const pdf = await converter.uriToPdf(options)

        response.writeHead(200, {
          'Content-Type': 'application/pdf',
          'Content-Length': pdf.byteLength
        })

        response.end(pdf)
      } catch (e) {
        response.writeHead(400)
        response.end()

        winston.warn(e)
      }
  }
}
;(async () => {
  await converter.launchChrome()

  const server = http.createServer(handler)

  server.listen(process.env.PORT)

  winston.info(`Listening Port ${process.env.PORT}`)
})()
