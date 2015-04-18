/*
 * @ Codepath pre-work: proxy server
 * 1 Build a proxy server and setup logging
 * 2 Develop a command-line interface (CLI) to configure the server
 * 3 Extend your proxy server with additional functions
 *
 * Run:
 * npm start //or nodemon --exec babel-node -- index.js
 *
 *
 * CLI:
 * nodemon --exec babel-node -- index.js
 * nodemon --exec babel-node -- index.js --url http://www.google.com
 * nodemon --exec babel-node -- index.js --logs=/tmp/proxy-server.log
 *
 * Test:
 * curl -v http://127.0.0.1:8001 -H "x-destination-url: http://www.google.com" -d "asdf"
 * curl -v http://127.0.0.1:8001 -H "x-asdf: test" -d "asdf"
 *
 * TODO:
 * - babel ?
 * - req.pipe(res)
 * req.pipe(request(options)).pipe(res)
 * - `http://${destinationUrl}${req.url}`
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

console.log(argv);

// Simple http server on 8000
http.createServer((req, res) => {
  logStream.write('\nEcho request:\n' + JSON.stringify(req.headers))
  // take request header and set to response header
  for (let header in req.headers) {
    res.setHeader(header, req.headers[header])
  }
  through(req, logStream, {autoDestroy: false})
  req.pipe(res)
}).listen(8000)
logStream.write('Listening at http://127.0.0.1:8000')

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
  logStream.write('\nProxy request:\n' + JSON.stringify(req.headers))
  through(req, logStream, {autoDestroy: false})
  let destinationResponse = req.pipe(request(options))
  logStream.write(JSON.stringify(destinationResponse.headers))
  destinationResponse.pipe(res)
  through(destinationResponse, logStream, {autoDestroy: false})
}).listen(8001)

logStream.write('Listening at http://127.0.0.1:8001')
