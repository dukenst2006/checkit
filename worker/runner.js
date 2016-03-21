var vm = require('vm')
var util = require('util')
var domain = require('domain')
var request = require('request')
var moment = require('moment')
var xml2js = require('xml2js')

module.exports.run = function(code, storage, callback) {
  var output = ''
  var notifMess = null
  var context = {
    log: console.log,
    request: request,
    setTimeout: setTimeout,
    parseXml: xml2js.parseString,
    moment: moment,
    notify: function(message) {
      notifMess = message
    },
    once: function(key, cb) {
      if (storage.indexOf(key) == -1) {
        storage.push(key)
        cb(key)
      }
    },
    done: function() {
      resetStdout()
      callback(output, notifMess, storage)
    }
  }

  // Hook stdout: http://stackoverflow.com/questions/12805125/access-logs-from-console-log-in-node-js-vm-module
  var initialStdout = process.stdout.write

  function resetStdout() {
    process.stdout.write = initialStdout
    output = output.replace(/\n$/, '') // remove last line-break
  }

  process.stdout.write = function(str) {
    if (output.length > 1000) return
    if (str.length > 1000) str = str.slice(0, 999)

    output += str
  }

  var vmDomain = domain.create()

  vmDomain.on('error', function(err) {
    resetStdout()

    // happens when done() is called after timeout
    if (err.message == 'channel closed') return

    callback(output, notifMess, storage, {
      name: err.name,
      message: err.message
    })
  })

  if (code.search('done()') == -1) {
    code += ';done();'
  }

  vmDomain.run(function() {
    try {
      vm.runInNewContext(code, context, 'line')
    } catch(err) {
      resetStdout()
      callback(output, notifMess, storage, {
        name: err.name,
        message: err.message
      })
    }
  })
}
