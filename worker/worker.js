var util = require('util')
var cluster = require('./cluster')()

function runTest(testSnap) {
  var test = testSnap.val()

  if (!test || !test.code || test.disabled) return false

  testSnap.ref().update({
    error: '',
    output: '',
    status: 'pending'
  }, function() {

    // mainly for tests, else it's too fast
    setTimeout(function() {

      cluster.run(test.code, function(pass, output, notifMess, err) {
        util.log('update', testSnap.key(), pass, '"' + notifMess + '"', output)

        var notifs = test.notifs || []

        if (notifMess) {
          notifs.unshift([notifMess, new Date().toUTCString()])

          // TODO notify email
        }

        testSnap.ref().update({
          lastUpdated: +(new Date()),
          status: notifMess ? 'notif' : (pass ? 'pass' : 'fail'),
          output: output || null,
          notifs: notifs.slice(0, 20),
          error: err ? (err.name + ': ' + err.message) : null
        }, function(error) {
          if (error) throw error
        })
      })
    }, 100)
  })
}

var firebase = require('./firebase')


// Authenticate
// ------------

function start(done) {
  firebase.authWithCustomToken(process.env.CHECKIT_FIREBASE_SECRET, done)
}


// Events
// ------

function startLoop() {
  setInterval(function() {
    util.log('loop')
    runLoop()
  }, process.env.CHECKIT_POLL_INTERVAL)
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
