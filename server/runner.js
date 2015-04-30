var vm = require('vm');
var util = require('util');

function run(code, callback) {
  var output = '';

  var context = {
    console: {
      log: console.log
    },
    setTimeout: setTimeout,
    done: function(pass, result) {
      resetStdout();
      callback(!!pass, result, output);
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

  try {
    vm.runInNewContext(code, context, 'Line');
  } catch (e) {
    resetStdout();
    callback(false, new Error(e.message), output);
  }
}

module.exports = {
  run: run
};
