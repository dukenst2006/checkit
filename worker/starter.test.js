var config = require('./../config/server.js')
var starter = require('./starter');
var firebase = require('./firebase');

var expect = require('chai').expect;

describe('starter', function() {
  var testId
  var testUserRef = firebase.child('tests').child('test_user')

  beforeEach(function(done) {
    firebase.authWithCustomToken(config.FIREBASE_SECRET, done)
  })

  beforeEach(function(done) {
    testUserRef.push({
      name: 'foo',
      code: 'done()'
    })
    testUserRef.once('child_added', function(snap) {
      testId = snap.key()
      done()
    });
  });

  afterEach(function(done) {
    testUserRef.remove(done);
  });

  describe('events', function() {
    it('run all tests', function(done) {
      testUserRef.once('child_changed', function(testSnap) {
        var test = testSnap.val()
        expect(test.status).to.equal('success')
        done()
      })
      starter.runLoop()
    })
  })

  describe('queue', function() {
    it('run test when child is added', function(done) {
      testUserRef.once('child_changed', function(snap) {
        expect(snap.val().status).to.equal('success')

        firebase.child('queue').once('value', function(snap) {
          expect(snap.val()).to.equal(null)
          done()
        })
      })

      firebase.child('queue').push(['test_user ', testId])
    })
  })

  /*
  function sendRequest(path, cb) {
    http.get({
      host: 'localhost',
      port: config.port,
      path: path
    }, cb);
  }

  describe('events', function() {
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
  */

});
