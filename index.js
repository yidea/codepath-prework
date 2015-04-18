/*
 * @ Codepath pre-work: proxy server
 */
let http = require('http')
let fs = require('fs')
let request = require('request')
let through = require('through')
let argv = require('yargs')
  .default('host', '127.0.0.1')
  .argv
let scheme = 'http://'
let port = argv.port || argv.host === '127.0.0.1' ? 8000 : 80
let destinationUrl = argv.url || scheme + argv.host + ':' + port
let logStream = argv.logs ? fs.createWriteStream(argv.logs) : process.stdout

// Simple http server on 8000
http.createServer((req, res) => {
  logStream.write('\nEcho request: \n' + JSON.stringify(req.headers))
  for (let header in req.headers) {
    res.setHeader(header, req.headers[header])
  }
  through(req, logStream, {autoDestroy: false})
  req.pipe(res)
}).listen(8000)

logStream.write('Listening at http://127.0.0.1:8000\n')

// Proxy http server on 8081
http.createServer((req, res) => {
  let url = destinationUrl
  if (req.headers['x-destination-url']) {
    url = req.headers['x-destination-url']
  }
  let options = {
    headers: req.headers,
    url: url + req.url
  }

  logStream.write('\nProxy request: \n' + JSON.stringify(req.headers))
  through(req, logStream, {autoDestroy: false})

  let destinationResponse = req.pipe(request(options))
  logStream.write(JSON.stringify(destinationResponse.headers))
  destinationResponse.pipe(res)
  through(destinationResponse, logStream, {autoDestroy: false})
}).listen(8001)

logStream.write('Listening at http://127.0.0.1:8001')
