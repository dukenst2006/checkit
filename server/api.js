var _ = require('underscore');
var util = require('util')
var cluster = require('./cluster')();
var db = require('./db');


// Socket
// ------

function runTests() {
  util.log(' - run', db.tests.length, 'test(s)');
  db.tests.forEach(runTest);
}

function runTest(test) {
  if (!test.code) {
    return;
  }

  cluster.run(test.code, function(pass, result, output) {

    db.testsRef.child(test.id).update({
      pass: pass,
      result: result || 'foo',
      output: output || 'baz',
      lastUpdated: +(new Date())
    }, function(err) {
      if (err) throw err;
    });

  });
}

util.log('>> starting loop');
setInterval(runTests, 3 * 1000);


// API
// ---

var config = require('./../config/server.js');
var http = require('http');
var app = require('express')();

app.get('/run/:testId', function (req, res) {
  var testId = req.params.testId;
  var test = _.findWhere(db.tests, { id: testId });

  if (!test) {
    res.writeHead(404);
    res.end('not found');
    return;
  }

  runTest(test);

  res.writeHead(200);
	res.end('ok fsfd');
});

util.log('Starting server on http://localhost:' + config.port);
var server = app.listen(config.port);

module.exports = {
  server: server
};
