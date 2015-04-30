var expect = require('chai').expect;
var runner = require('./runner');

describe('runner', function() {

  describe('run()', function() {

    it('pass synchronously', function(done) {
      runner.run('assert.ok(true, "pass"); done()', function(pass, output, err) {
        expect(pass).to.equal(true);
        expect(output).to.equal('');
        done();
      });
    });

    it('pass asynchronously', function(done) {
      runner.run('setTimeout(function() { assert.ok(true, "pass"); done() }, 20)', function(pass, output) {
        expect(pass).to.equal(true);
        expect(output).to.equal('');
        done();
      });
    });

    it('fails', function(done) {
      runner.run('assert.ok(false, "error"); done()', function(pass, output, err) {
        expect(pass).to.equal(false);
        expect(output).to.equal('');
        expect(err.name).to.equal('AssertionError')
        done();
      });
    });

    it('handles javascript error', function(done) {
      runner.run('console.log("foo"); unknowMethod(); done()', function(pass, output) {
        expect(pass).to.equal(false);
        expect(output).to.equal('foo');
        done();
      });
    });

    it('allows console.log()', function(done) {
      runner.run('console.log("foo"); console.log("bar"); assert.ok(true, "pass"); done()', function(pass, output) {
        expect(pass).to.equal(true);
        expect(output).to.equal('foo\nbar');
        done();
      });
    });

  });
});
