var expect = require('chai').expect;
var cluster = require('./cluster')({ timeout: 200 });

describe('cluster', function() {

  describe('run()', function() {

    it('sends and receive messages', function(done) {
      cluster.run('done(true, "pass")', function(pass, result, output) {
        expect(pass).to.equal(true);
        expect(result).to.equal('pass');
        expect(output).to.equal('');
        done();
      });
    });

    it('timeouts', function(done) {
      cluster.run('var foo = 1', function(pass, result, output) {
        expect(pass).to.equal(false);
        expect(result).to.be.instanceof(Error);
        expect(result.message).to.equal('Timeout');
        expect(output).to.equal(undefined);
        done();
      });
    });

  });
});
