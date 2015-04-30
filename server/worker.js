var cluster = require('./cluster')();

function runTest(testSnap) {
  var test = testSnap.val()
  if (!test.code) return false

  cluster.run(test.code, function(pass, result, output) {
    testSnap.ref().update({
      status: pass ? 'success' : 'fail',
      result: result || 'foo',
      output: output || 'baz',
      lastUpdated: +(new Date())
    }, function(err) {
      if (err) throw err;
    });
  });
}

var config = require('./../config/server.js')
var firebase = require('./firebase')

// Events
// ------

function startLoop() {
  setInterval(loopTests, config.POLL_INTERVAL)
}

function runLoop() {
  firebase.child('tests').on('value', function(snap) {
    snap.forEach(function(userSnap) {
      userSnap.forEach(runTest)
    })
  })
}


// Queue
// -----

var queue = firebase.child('queue')

queue.on('child_added', function(snap) {
  var parts = snap.val().split(' ')
  var userId = parts[0], testId = parts[1]
  var testRef = firebase.child('tests').child(userId).child(testId)

  snap.ref().remove(function() {
    testRef.once('value', runTest)
  })
})


module.exports = {
  runLoop: runLoop,
  startLoop: startLoop
}
