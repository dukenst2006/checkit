var expect = require('chai').expect;
var cluster = require('./cluster')({ timeout: 2000 });

describe('cluster', function() {

  describe('run()', function() {
    it('works', function(done) {
      cluster.run('notify("ok")', function(pass, output, notifMess, err) {
        expect(pass).to.equal(true);
        expect(output).to.equal('');
        expect(notifMess).to.equal('ok');
        expect(err).to.equal(undefined);
        done();
      });
    });

    it('timeouts', function(done) {
      cluster.run('setTimeout(function() { done() }, 10000)', function(pass, output, notifMess, err) {
        expect(pass).to.equal(false);
        expect(output).to.equal('');
        expect(err.name).to.equal('Error');
        expect(notifMess).to.equal(null);
        expect(err.message).to.contain('timeout of 2000ms exceeded');
        done();
      });
    });

    it('handle async errors', function(done) {
      var code = (
        'request("https://example.com", function(error, response, body) {' +
          'console.log("log");' +
          'throw new Error();' +
          'done()' +
        '});'
      )
      cluster.run(code, function(pass, output, notifMess, err) {
        expect(pass).to.equal(false)
        expect(output).to.equal('log')
        expect(notifMess).to.equal(null);
        expect(err.name).to.equal('Error')
        done()
      })
    })
  });
});
