var worker = require('./worker')
var firebase = require('./firebase')
var expect = require('chai').expect

describe('worker', function() {
  var checkId, singleCheckRef
  var checkRef = firebase.child('checks').child('check_user')

  beforeEach(worker.start)

  beforeEach(function(done) {
    checkRef.once('child_added', function(snap) {
      checkId = snap.key()
    })
    singleCheckRef = checkRef.push({
      name: 'foo',
      status: 'notification',
      code: 'once(0, function() { log(1); notify(2); done() })'
    }, function(err) {
      if (err) throw err
      done()
    })
  })

  afterEach(function(done) {
    singleCheckRef.off('value')
    checkRef.remove(done)
  })

  describe('runCheck()', function() {
    it('works', function(done) {
      singleCheckRef.once('value', function(snap) {
        singleCheckRef.on('value', function(snap) {
          var check = snap.val()

          if (check.pending === false) {
            expect(check.ago).to.not.be.undefined
            expect(check.notifs.length).to.equal(1)
            expect(check.output).to.equal('1')
            expect(check.status).to.equal('notification')
            expect(check.storage.length).to.equal(1)
            done()
          }
        })

        worker.runCheck(snap)
      })
    })
  })

  describe('runLoop()', function() {
    it('run all checks', function(done) {
      checkRef.once('child_changed', function(checkSnap) {
        var check = checkSnap.val()
        expect(check.pending).to.equal(true)

        checkRef.once('child_changed', function(checkSnap) {
          var check = checkSnap.val()
          expect(check.status).to.equal('notification')
          done()
        })
      })
      worker.runLoop()
    })
  })

  describe('startQueue()', function() {
    it('run check when child is added', function(done) {

      checkRef.once('child_changed', function(snap) {
        expect(snap.val().pending).to.equal(true)

        checkRef.once('child_changed', function(snap) {
          var check = snap.val()
          expect(check.status).to.equal('notification')
          expect(check.ago).to.be.below(+(new Date()))
          expect(check.ago).to.be.above(+(new Date()) - 1000)
          expect(check.output).to.equal('1')
          expect(check.notifs.length).to.equal(1)
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
})
