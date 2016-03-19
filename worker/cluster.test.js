var expect = require('chai').expect
var cluster = require('./cluster')({ timeout: 1000 })

describe('cluster', function() {

  describe('run()', function() {
    it('works', function(done) {
      cluster.run('notify("ok")', [], function(output, notifMess, storage, err) {
        expect(output).to.equal('')
        expect(notifMess).to.equal('ok')
        expect(storage.length).to.equal(0)
        expect(err).to.equal(undefined)
        done()
      })
    })

    it('updates storage', function(done) {
      var store = []
      cluster.run('once(1, function() { log(1) })', store, function(output, notifMess, storage, err) {
        expect(output).to.equal('1')
        expect(notifMess).to.equal(null)
        expect(storage.length).to.equal(1)
        expect(err).to.equal(undefined)
        done()
      })
    })

    it('timeouts', function(done) {
      var run = 0

      cluster.run('setTimeout(function() { done() }, 1200)', [], function(output, notifMess, storage, err) {
        run++
        expect(output).to.equal('')
        expect(err.name).to.equal('Error')
        expect(notifMess).to.equal(null)
        expect(storage.length).to.equal(0)
        expect(err.message).to.contain('timeout of 1000ms exceeded')

        setTimeout(function() {
          expect(run).to.equal(1)
          done()
        }, 1500)
      })
    })

    it('handle async errors', function(done) {
      var code = (
        'request("https://example.com", function(error, response, body) {' +
          'log("log");' +
          'throw new Error();' +
          'done()' +
        '})'
      )
      cluster.run(code, [], function(output, notifMess, storage, err) {
        expect(output).to.equal('log')
        expect(notifMess).to.equal(null)
        expect(storage.length).to.equal(0)
        expect(err.name).to.equal('Error')
        done()
      })
    })
  })
})
