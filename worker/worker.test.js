var worker = require('./worker');
var firebase = require('./firebase');
var expect = require('chai').expect;

describe('worker', function() {
  var checkId
  var checkUserRef = firebase.child('checks').child('check_user')

  beforeEach(worker.start)

  beforeEach(function(done) {
    checkUserRef.once('child_added', function(snap) {
      checkId = snap.key()
    });
    checkUserRef.push({
      name: 'foo',
      code: ''
    }, function(err) {
      if (err) throw err
      done()
    })
  });

  afterEach(function(done) {
    checkUserRef.remove(done);
  });

  describe('events', function() {
    it('run all checks', function(done) {
      checkUserRef.once('child_changed', function(checkSnap) {
        var check = checkSnap.val()
        expect(check.pending).to.equal(true)

        checkUserRef.once('child_changed', function(checkSnap) {
          var check = checkSnap.val()
          expect(check.status).to.equal('ok')
          done()
        })
      })
      worker.runLoop()
    })
  })

  describe('queue', function() {
    it('run check when child is added', function(done) {

      checkUserRef.once('child_changed', function(snap) {
        expect(snap.val().pending).to.equal(true)

        checkUserRef.once('child_changed', function(snap) {
          var check = snap.val()
          expect(check.status).to.equal('ok')
          expect(check.lastUpdated).to.be.below(+(new Date()))
          expect(check.lastUpdated).to.be.above(+(new Date()) - 1000)
          expect(check.output).to.equal(undefined)
          expect(check.notifs).to.equal(undefined)
          expect(check.err).to.equal(undefined)

          firebase.child('queue').once('value', function(snap) {
            expect(snap.val()).to.equal(null)
            done()
          })
        })
      })

      firebase.child('queue').once('value', function(snap) {
        expect(snap.val()).to.equal(null)
        firebase.child('queue').push(['check_user', checkId])
      })

      worker.startQueue()
    })
  })
});
