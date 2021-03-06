var workerFarm = require('worker-farm');

var workers = workerFarm({
  maxCallsPerWorker: 100,
  //maxRetries: 1,
  maxCallTime: 10 * 1000
}, require.resolve('./runner'), ['run']);

module.exports = function(options) {
  return {
    run: function(code, storage, callback) {
      var ended
      var timeout = ((options && options.timeout) || process.env.CHECKIT_CHECK_TIMEOUT) * 1000

      var timer = setTimeout(function() {
        ended = true
        callback('', null, storage, new Error('timeout of ' + timeout + 'ms exceeded'));
      }, timeout);

      workers.run(code, storage, function(err) {
        clearTimeout(timer);
        //if (err && err.type === 'TimeoutError') return
        if (!ended) callback.apply(callback, arguments);
      });
    }
  };
};
