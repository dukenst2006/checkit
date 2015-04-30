var expect = require('chai').expect;
var config = require('./../config/server.js')
var api = require('./api');
var db = require('./db');
var http = require('http');

describe('api', function() {

  function sendRequest(path, cb) {
    http.get({
      host: 'localhost',
      port: config.port,
      path: path
    }, cb);
  }

  describe('run/{testId}', function() {

    beforeEach(function(done) {
      db.firebase.authWithCustomToken(config.firebase_secret, done)
    })

    beforeEach(function(done) {
      db.testsRef.push({
        name: 'foo',
        code: 'done(true)'
      }, done);
    });

    afterEach(function() {
      db.testsRef.remove();
    });

    it('sends a 404 if test is not found', function(done) {
      sendRequest('/run/1234', function(resp) {
        expect(resp.statusCode).to.equal(404);
        done();
      });
    });

    it('sends a 200 if test exists', function(done) {
      expect(db.tests.length).to.equal(1);
      expect(db.tests[0].lastUpdate).to.equal(undefined);

      sendRequest('/run/' + db.tests[0].id, function(resp) {
        expect(resp.statusCode).to.equal(200);
      });

      db.testsRef.on('value', function(snap) {
        if (snap.val()) {
          var test = snap.val()[db.tests[0].id];
          if (test && test.lastUpdated) {
            expect(test.lastUpdated).not.to.equal(undefined);
            done();
          }
        }
      });
    });

  });
});
