# README

### Install
- npm install 
- npm start

### Content
1 Build a proxy server and setup logging
2 Develop a command-line interface (CLI) to configure the server
3 (TODO) Extend your proxy server with additional functions 

### Test
CLI:
* nodemon --exec babel-node -- index.js --url http://www.google.com
* nodemon --exec babel-node -- index.js
* nodemon --exec babel-node -- index.js --logs=/tmp/proxy-server.log
 
Test:
* curl -v http://127.0.0.1:8001 -H "x-destination-url: http://www.google.com" -d "asdf"
* curl -v http://127.0.0.1:8001 -H "x-asdf: test" -d "asdf"
* cat /tmp/proxy-server.log

### Reference 
http://courses.codepath.com/snippets/intro_to_nodejs/prework
