var mail = require('./mail')
var firebase = require('./firebase')
var sendgrid  = require('sendgrid')(process.env.CHECKIT_SENDGRID_API_KEY)

var chai = require('chai')
var expect = chai.expect
var spies = spies = require('chai-spies')

chai.use(spies)

describe('mail', function() {
  var check, checkId
  var userId = 'check_user'
  var checkRef = firebase.child('checks').child(userId)
  var rateLimitRef = firebase.child('rate-limits').child(userId)

  beforeEach(function(done) {
    checkRef.once('child_added', function(snap) {
      check = snap.val()
      checkId = snap.key()
    })
    checkRef.push({
      name: 'foo',
      code: 'var a = 1'
    }, function(err) {
      if (err) throw err
      done()
    })
  })

  afterEach(function(done) {
    checkRef.remove(done)
  })

  afterEach(function(done) {
    rateLimitRef.remove(done)
  })

  describe('rateLimitMail', function() {

    it('set rateLimit if none saved', function(done) {
      var spy = chai.spy(function() {})

      mail.rateLimitMail(userId, spy)

      setTimeout(function() {
        rateLimitRef.once('value', function(snap) {
          var rateLimit = snap.val()
          expect(spy).to.have.been.called.once()
          expect(rateLimit.count).to.equal(1)
          expect(rateLimit.since).to.be.above(new Date().getTime() - 500)
          expect(rateLimit.since).to.be.below(new Date().getTime())
          done()
        })
      }, 300)
    })

    it('update rateLimit if "since" is too old', function(done) {
      var spy = chai.spy(function() {})

      rateLimitRef.set({
        count: 5,
        since: new Date().getTime() - (24 * 60 * 60 * 1000) - 10
      })

      rateLimitRef.parent().once('child_changed', function(snap) {
        var rateLimit = snap.val()
        expect(spy).to.have.been.called.once()
        expect(rateLimit.count).to.equal(1)
        expect(rateLimit.since).to.be.above(new Date().getTime() - 100)
        expect(rateLimit.since).to.be.below(new Date().getTime())
        done()
      })

      mail.rateLimitMail(userId, spy)
    })

    it('cancel if count is too big', function(done) {
      var spy = chai.spy(function() {})

      rateLimitRef.set({
        count: process.env.CHECKIT_MAIL_LIMIT,
        since: new Date().getTime()
      }, function() {
        mail.rateLimitMail(userId, function() {}, spy)

        setTimeout(function() {
          rateLimitRef.once('value', function(snap) {
            var rateLimit = snap.val()
            expect(spy).not.to.have.been.called()
            expect(rateLimit.count).to.equal(15)
            expect(rateLimit.since).to.be.above(new Date().getTime() - 2000)
            expect(rateLimit.since).to.be.below(new Date().getTime())
            done()
          })
        }, 1000)
      })
    })

    it('pass if everything is fine', function(done) {
      var spy = chai.spy(function() {})

      rateLimitRef.set({
        count: 5,
        since: new Date().getTime() - 10
      })

      rateLimitRef.parent().once('child_changed', function(snap) {
        var rateLimit = snap.val()
        expect(spy).to.have.been.called.once()
        expect(rateLimit.count).to.equal(6)
        expect(rateLimit.since).to.be.above(new Date().getTime() - 150)
        expect(rateLimit.since).to.be.below(new Date().getTime() - 10)
        done()
      })

      mail.rateLimitMail(userId, spy)
    })
  })

  describe('formatMail', function() {

    it('works', function() {
      var email = mail.formatMail(checkRef, { notificationEmail: 'test@mail.com'}, ['message', new Date().toUTCString()])
      expect(email).to.be.an.instanceof(sendgrid.Email)
    })

  })
})
