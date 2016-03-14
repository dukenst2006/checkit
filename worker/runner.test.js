var expect = require('chai').expect;
var runner = require('./runner');

describe('runner', function() {

  describe('run()', function() {

    it('pass synchronously', function(done) {
      runner.run('', function(output, notifMess, err) {
        expect(output).to.equal('');
        expect(notifMess).to.equal(null);
        expect(err).to.equal(undefined);
        done();
      });
    });

    it('pass asynchronously', function(done) {
      runner.run('setTimeout(done, 20)', function(output, notifMess, err) {
        expect(output).to.equal('');
        expect(notifMess).to.equal(null);
        expect(err).to.equal(undefined);
        done();
      });
    });

    it('notify', function(done) {
      runner.run('notify("notify message")', function(output, notifMess, err) {
        expect(output).to.equal('');
        expect(notifMess).to.equal('notify message');
        expect(err).to.equal(undefined)
        done();
      });
    });

    it('fails', function(done) {
      runner.run('throw new Error()', function(output, notifMess, err) {
        expect(output).to.equal('');
        expect(notifMess).to.equal(null);
        expect(err.name).to.equal('Error')
        done();
      });
    });

    it('handles javascript error', function(done) {
      runner.run('unknowMethod()', function(output, notifMess, err) {
        expect(output).to.equal('');
        expect(notifMess).to.equal(null);
        expect(err.name).to.equal('ReferenceError');
        done();
      });
    });

    it('allows console.log()', function(done) {
      runner.run('console.log("foo"); console.log("bar");', function(output, notifMess, err) {
        expect(output).to.equal('foo\nbar');
        expect(notifMess).to.equal(null);
        expect(err).to.equal(undefined)
        done();
      });
    });

    it('limits output to 1000 chars', function(done) {
      runner.run('console.log(new Array(1000).join("abcdef"))', function(output, notifMess, err) {
        expect(output.length).to.be.below(1000);
        expect(notifMess).to.equal(null);
        expect(err).to.equal(undefined)
        done();
      });
    })
  });
});
