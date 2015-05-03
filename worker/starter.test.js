var starter = require('./starter');
var firebase = require('./firebase');
var expect = require('chai').expect;

describe('starter', function() {
  var testId
  var testUserRef = firebase.child('tests').child('test_user')

  beforeEach(starter.start)

  beforeEach(function(done) {
    testUserRef.once('child_added', function(snap) {
      testId = snap.key()
    });
    testUserRef.push({
      name: 'foo',
      code: 'done()'
    }, done)
  });

  afterEach(function(done) {
    testUserRef.remove(done);
  });

  describe('events', function() {
    it('run all tests', function(done) {
      testUserRef.once('child_changed', function(testSnap) {
        var test = testSnap.val()
        expect(test.status).to.equal('pending')

        testUserRef.once('child_changed', function(testSnap) {
          var test = testSnap.val()
          expect(test.status).to.equal('pass')
          done()
        })
      })
      starter.runLoop()
    })
  })

  describe('queue', function() {
    it('run test when child is added', function(done) {
      testUserRef.once('child_changed', function(snap) {
        expect(snap.val().status).to.equal('pending')

        testUserRef.once('child_changed', function(snap) {
          expect(snap.val().status).to.equal('pass')

          firebase.child('queue').once('value', function(snap) {
            expect(snap.val()).to.equal(null)
            done()
          })
        })
      })

      firebase.child('queue').once('value', function(snap) {
        expect(snap.val()).to.equal(null)
        firebase.child('queue').push(['test_user', testId])
      })

      starter.startQueue()
    })
  })
});
