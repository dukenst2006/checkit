var workerFarm = require('worker-farm');

var workers = workerFarm({
  maxCallsPerWorker: 100,
  //maxRetries: 1,
  maxCallTime: 10 * 1000
}, require.resolve('./runner'), ['run']);

module.exports = function(options) {
  return {
    run: function(code, callback) {
      var ended
      var timeout = (options && options.timeout) || process.env.CHECKIT_CHECK_TIMEOUT

      var timer = setTimeout(function() {
        ended = true
        callback('', null, new Error('timeout of ' + timeout + 'ms exceeded'));
      }, timeout);

      workers.run(code, function(err) {
        clearTimeout(timer);
        //if (err && err.type === 'TimeoutError') return
        if (!ended) callback.apply(callback, arguments);
      });
    }
  };
};
