var cluster = require('./cluster')();

function runTest(testSnap) {
  var test = testSnap.val()
  if (!test || !test.code) return false

  cluster.run(test.code, function(pass, output, error) {
    testSnap.ref().update({
      lastUpdated: +(new Date()),
      status: pass ? 'success' : 'fail',
      output: output || null,
      error: error || null
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
  setInterval(runLoop, config.POLL_INTERVAL)
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
  var userId = snap.val()[0]
  var testId = snap.val()[1]
  var testRef = firebase.child('tests').child(userId).child(testId)

  snap.ref().remove(function() {
    testRef.once('value', runTest)
  })
})


module.exports = {
  runLoop: runLoop,
  startLoop: startLoop
}
