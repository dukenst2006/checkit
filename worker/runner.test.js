var expect = require('chai').expect;
var runner = require('./runner');

describe('runner', function() {

  describe('run()', function() {

    it('pass synchronously', function(done) {
      runner.run('done()', function(pass, output, err) {
        expect(pass).to.equal(true);
        expect(output).to.equal('');
        expect(err).to.equal(undefined);
        done();
      });
    });

    it('pass asynchronously', function(done) {
      runner.run('setTimeout(done, 20)', function(pass, output, err) {
        expect(pass).to.equal(true);
        expect(output).to.equal('');
        expect(err).to.equal(undefined);
        done();
      });
    });

    it('passes', function(done) {
      runner.run('assert.ok(true, "success"); done()', function(pass, output, err) {
        expect(pass).to.equal(true);
        expect(output).to.equal('');
        expect(err).to.equal(undefined)
        done();
      });
    });

    it('fails', function(done) {
      runner.run('assert.ok(false, "error")', function(pass, output, err) {
        expect(pass).to.equal(false);
        expect(output).to.equal('');
        expect(err.name).to.equal('AssertionError')
        done();
      });
    });

    it('handles javascript error', function(done) {
      runner.run('unknowMethod()', function(pass, output, err) {
        expect(pass).to.equal(false);
        expect(output).to.equal('');
        expect(err.name).to.equal('ReferenceError');
        done();
      });
    });

    it('allows console.log()', function(done) {
      runner.run('console.log("foo"); console.log("bar"); done()', function(pass, output, err) {
        expect(pass).to.equal(true);
        expect(output).to.equal('foo\nbar');
        expect(err).to.equal(undefined)
        done();
      });
    });
  });
});
