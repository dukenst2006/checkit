var expect = require('chai').expect;
var runner = require('./runner');

describe('runner', function() {

  describe('run()', function() {

    it('pass synchronously', function(done) {
      runner.run('', function(pass, output, notifMess, err) {
        expect(pass).to.equal(true);
        expect(output).to.equal('');
        expect(notifMess).to.equal(null);
        expect(err).to.equal(undefined);
        done();
      });
    });

    it('pass asynchronously', function(done) {
      runner.run('setTimeout(done, 20)', function(pass, output, notifMess, err) {
        expect(pass).to.equal(true);
        expect(output).to.equal('');
        expect(notifMess).to.equal(null);
        expect(err).to.equal(undefined);
        done();
      });
    });

    it('notify', function(done) {
      runner.run('notify("notify message")', function(pass, output, notifMess, err) {
        expect(pass).to.equal(true);
        expect(output).to.equal('');
        expect(notifMess).to.equal('notify message');
        expect(err).to.equal(undefined)
        done();
      });
    });

    it('fails', function(done) {
      runner.run('throw new Error()', function(pass, output, notifMess, err) {
        expect(pass).to.equal(false);
        expect(output).to.equal('');
        expect(notifMess).to.equal(null);
        expect(err.name).to.equal('Error')
        done();
      });
    });

    it('handles javascript error', function(done) {
      runner.run('unknowMethod()', function(pass, output, notifMess, err) {
        expect(pass).to.equal(false);
        expect(output).to.equal('');
        expect(notifMess).to.equal(null);
        expect(err.name).to.equal('ReferenceError');
        done();
      });
    });

    it('allows console.log()', function(done) {
      runner.run('console.log("foo"); console.log("bar");', function(pass, output, notifMess, err) {
        expect(pass).to.equal(true);
        expect(output).to.equal('foo\nbar');
        expect(notifMess).to.equal(null);
        expect(err).to.equal(undefined)
        done();
      });
    });
  });
});
