var expect = require('chai').expect;
var runner = require('./runner');

describe('runner', function() {

  describe('run()', function() {

    it('pass synchronously', function(done) {
      runner.run('done(1 + 2 == 3, "ok")', function(pass, result, output) {
        expect(pass).to.equal(true);
        expect(result).to.equal('ok');
        expect(output).to.equal('');
        done();
      });
    });

    it('pass asynchronously', function(done) {
      runner.run('setTimeout(function() { done(1 + 2 == 3, "ok"); }, 20)', function(pass, result, output) {
        expect(pass).to.equal(true);
        expect(result).to.equal('ok');
        expect(output).to.equal('');
        done();
      });
    });

    it('fails', function(done) {
      runner.run('done(1 + 1 == 3, "error")', function(pass, result, output) {
        expect(pass).to.equal(false);
        expect(result).to.equal('error');
        expect(output).to.equal('');
        done();
      });
    });

    it('handles javascript error', function(done) {
      runner.run('console.log("foo"); done(a, "error")', function(pass, result, output) {
        expect(pass).to.equal(false);
        expect(result).to.be.instanceof(Error);
        expect(result.message).to.contain('a is not defined');
        expect(output).to.equal('foo');
        done();
      });
    });

    it('allows console.log()', function(done) {
      runner.run('console.log("foo"); console.log("bar"); done(1 + 1 == 2, "pass")', function(pass, result, output) {
        expect(pass).to.equal(true);
        expect(result).to.equal('pass');
        expect(output).to.equal('foo\nbar');
        done();
      });
    });

  });
});
