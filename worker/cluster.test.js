var expect = require('chai').expect;
var cluster = require('./cluster')({ timeout: 2000 });

describe('cluster', function() {

  describe('run()', function() {
    it('sends and receive messages', function(done) {
      cluster.run('done(true, "pass")', function(pass, output, err) {
        expect(pass).to.equal(true);
        expect(output).to.equal('');
        expect(err).to.equal(undefined);
        done();
      });
    });

    it('timeouts', function(done) {
      cluster.run('var foo = 1', function(pass, output, err) {
        expect(pass).to.equal(false);
        expect(output).to.equal('');
        expect(err.name).to.equal('Error');
        expect(err.message).to.contain('done() never called in');
        done();
      });
    });

    it('handle async errors', function(done) {
      var code = (
        'request("https://example.com", function(error, response, body) {' +
          'console.log("log");' +
          'assert.ok(false); done()' +
        '});'
      )
      cluster.run(code, function(pass, out, err) {
        expect(pass).to.equal(false)
        expect(out).to.equal('log')
        expect(err.name).to.equal('AssertionError')
        done()
      })
    })
  });
});
