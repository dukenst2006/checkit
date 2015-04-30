var workerFarm = require('worker-farm');

var workers = workerFarm({
  maxCallsPerWorker: 100,
  maxCallTime: 100 *  1000
}, require.resolve('./runner'), ['run']);

module.exports = function(options) {

  return {

    run: function(code, callback) {
      var timer = setTimeout(function() {
        callback(false, new Error('Timeout'));
      }, (options && options.timeout) || 1000);

      workers.run(code, function() {
        clearTimeout(timer);
        callback.apply(callback, arguments);
      });
    }
  };
};
