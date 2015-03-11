
//
// This file is not used, it's here as an example.
//
// $ nodemon server.js
//

var port = 8080;
var http = require('http');
var router = require('router');
var route = router();

var Firebase = require('firebase');
var config = require('requirejs')('../public/js/config');
var firebase = new Firebase(config.FIREBASE);

route.get('/', function (req, res) {
  res.writeHead(200);
	res.end('hello from /');
});

console.log('Starting server on http://localhost:' + port);

http.createServer(route).listen(port);
