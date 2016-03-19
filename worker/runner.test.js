var expect = require('chai').expect
var runner = require('./runner')

describe('runner', function() {

  describe('run()', function() {

    it('pass synchronously', function(done) {
      runner.run('', [], function(output, notifMess, storage, err) {
        expect(output).to.equal('')
        expect(notifMess).to.equal(null)
        expect(storage.length).to.equal(0)
        expect(err).to.equal(undefined)
        done()
      })
    })

    it('pass asynchronously', function(done) {
      runner.run('setTimeout(done, 20)', [], function(output, notifMess, storage, err) {
        expect(output).to.equal('')
        expect(notifMess).to.equal(null)
        expect(storage.length).to.equal(0)
        expect(err).to.equal(undefined)
        done()
      })
    })

    it('fails', function(done) {
      runner.run('throw new Error()', [], function(output, notifMess, storage, err) {
        expect(output).to.equal('')
        expect(notifMess).to.equal(null)
        expect(storage.length).to.equal(0)
        expect(err.name).to.equal('Error')
        done()
      })
    })

    it('handles javascript error', function(done) {
      runner.run('unknowMethod()', [], function(output, notifMess, storage, err) {
        expect(output).to.equal('')
        expect(notifMess).to.equal(null)
        expect(storage.length).to.equal(0)
        expect(err.name).to.equal('ReferenceError')
        done()
      })
    })

    it('limits output to 1000 chars', function(done) {
      runner.run('log(new Array(1000).join("abcdef"))', [], function(output, notifMess, storage, err) {
        expect(output.length).to.be.below(1000)
        expect(notifMess).to.equal(null)
        expect(storage.length).to.equal(0)
        expect(err).to.equal(undefined)
        done()
      })
    })

    it('allows notify()', function(done) {
      runner.run('notify("notify message")', [], function(output, notifMess, storage, err) {
        expect(output).to.equal('')
        expect(notifMess).to.equal('notify message')
        expect(storage.length).to.equal(0)
        expect(err).to.equal(undefined)
        done()
      })
    })

    it('allows log()', function(done) {
      runner.run('log("foo"); log("bar");', [], function(output, notifMess, storage, err) {
        expect(output).to.equal('foo\nbar')
        expect(notifMess).to.equal(null)
        expect(storage.length).to.equal(0)
        expect(err).to.equal(undefined)
        done()
      })
    })

    it('allows parseXml()', function(done) {
      runner.run(
        'var xml = "<?xml version=\'1.0\' encoding=\'UTF-8\'?><root><child foo=\'bar\'></child></root>";' +
        'parseXml(xml, function(err, result) { log(result.root.child[0].$.foo); done() })',
        [], function(output, notifMess, storage, err) {
        expect(output).to.equal('bar')
        expect(notifMess).to.equal(null)
        expect(storage.length).to.equal(0)
        expect(err).to.equal(undefined)
        done()
      })
    })

    it('allows once()', function(done) {
      runner.run('once(0, function() { log("ok") })', [], function(output, notifMess, storage, err) {
        expect(output).to.equal('ok')
        expect(notifMess).to.equal(null)
        expect(storage.length).to.equal(1)
        expect(storage[0]).to.equal(0)
        expect(err).to.equal(undefined)
        done()
      })
    })

    it('restricts with once()', function(done) {
      runner.run('once(0, function() { log("ok") })', [0], function(output, notifMess, storage, err) {
        expect(output).to.equal('')
        expect(notifMess).to.equal(null)
        expect(storage.length).to.equal(1)
        expect(storage[0]).to.equal(0)
        expect(err).to.equal(undefined)
        done()
      })
    })
  })
})
