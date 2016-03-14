var vm = require('vm');
var util = require('util');
var domain = require('domain');
var request = require('request');

module.exports.run = function(code, callback) {
  var output = ''
  var notifMess = null
  var context = {
    console: {
      log: console.log
    },
    request: request,
    setTimeout: setTimeout,
    notify: function(message) {
      notifMess = message
    },
    done: function() {
      resetStdout();
      callback(output, notifMess);
    }
  };

  // Hook stdout: http://stackoverflow.com/questions/12805125/access-logs-from-console-log-in-node-js-vm-module
  var initialStdout = process.stdout.write;

  function resetStdout() {
    process.stdout.write = initialStdout;
    output = output.replace(/\n$/, ''); // remove last line-break
  }

  process.stdout.write = function(str) {
    output += str;
  };

  var vmDomain = domain.create();

  vmDomain.on('error', function(err) {
    resetStdout();

    // happens when done() is called after timeout
    if (err.message == 'channel closed') return

    callback(output, notifMess, {
      name: err.name,
      message: err.message
    });
  })

  if (code.search('done()') == -1) {
    code += ';done();'
  }

  vmDomain.run(function() {
    try {
      vm.runInNewContext(code, context, 'line');
    } catch(err) {
      resetStdout();
      callback(output, notifMess, {
        name: err.name,
        message: err.message
      });
    }
  })
}
