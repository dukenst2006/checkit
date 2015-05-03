var util = require('util')
var cluster = require('./cluster')()

function runTest(testSnap) {
  var test = testSnap.val()

  if (!test || !test.code) return false

  testSnap.ref().update({
    error: '',
    output: '',
    status: 'pending'
  }, function() {

    cluster.run(test.code, function(pass, output, err) {
      util.log('run', testSnap.key(), pass)
      testSnap.ref().update({
        lastUpdated: +(new Date()),
        status: pass ? 'pass' : 'fail',
        output: output || null,
        error: err ? (err.name + ': ' + err.message) : null
      }, function(err) {
        if (err) throw err
      })
    })
  })
}

var firebase = require('./firebase')


// Authenticate
// ------------

function start(done) {
  const firebase_secret = process.env.CHECKIT_IS_TESTING
    ? process.env.CHECKIT_FIREBASE_SECRET_TEST
    : process.env.CHECKIT_FIREBASE_SECRET

  firebase.authWithCustomToken(firebase_secret, done)
}


// Events
// ------

function startLoop() {
  setInterval(runLoop, process.env.CHECKIT_POLL_INTERVAL)
}

function runLoop() {
  firebase.child('tests').once('value', function(snap) {
    snap.forEach(function(userSnap) {
      userSnap.forEach(runTest)
    })
  })
}


// Queue
// -----

function startQueue() {
  var queue = firebase.child('queue')

  queue.on('child_added', function(snap) {
    util.log('queue', snap.val())
    var userId = snap.val()[0]
    var testId = snap.val()[1]
    var testRef = firebase.child('tests').child(userId).child(testId)

    snap.ref().remove(function() {
      testRef.once('value', runTest)
    })
  })
}


module.exports = {
  start: start,
  runLoop: runLoop,
  startLoop: startLoop,
  startQueue: startQueue
}
