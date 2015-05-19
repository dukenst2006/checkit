var workerFarm = require('worker-farm');

var workers = workerFarm({
  maxCallsPerWorker: 100,
  //maxRetries: 1,
  maxCallTime: 10 * 1000
}, require.resolve('./runner'), ['run']);

module.exports = function(options) {
  return {
    run: function(code, callback) {
      var timeout = (options && options.timeout) || 1000

      var timer = setTimeout(function() {
        callback(false, '', new Error('done() never called in ' + timeout + 'ms'));
      }, timeout);

      workers.run(code, function(err) {
        clearTimeout(timer);
        if (err && err.type === 'TimeoutError') return
        callback.apply(callback, arguments);
      });
    }
  };
};
