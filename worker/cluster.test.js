var expect = require('chai').expect;
var cluster = require('./cluster')({ timeout: 1000 });

describe('cluster', function() {

  describe('run()', function() {
    it('works', function(done) {
      cluster.run('notify("ok")', function(output, notifMess, err) {
        expect(output).to.equal('');
        expect(notifMess).to.equal('ok');
        expect(err).to.equal(undefined);
        done();
      });
    });

    it('timeouts', function(done) {
      var run = 0

      cluster.run('setTimeout(function() { done() }, 1200)', function(output, notifMess, err) {
        run++
        expect(output).to.equal('');
        expect(err.name).to.equal('Error');
        expect(notifMess).to.equal(null);
        expect(err.message).to.contain('timeout of 1000ms exceeded');

        setTimeout(function() {
          expect(run).to.equal(1)
          done();
        }, 1500)
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
      cluster.run(code, function(output, notifMess, err) {
        expect(output).to.equal('log')
        expect(notifMess).to.equal(null);
        expect(err.name).to.equal('Error')
        done()
      })
    })
  });
});
