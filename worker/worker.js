var util = require('util')
var cluster = require('./cluster')()

function runCheck(checkSnap) {
  var check = checkSnap.val()

  if (!check || check.code == undefined || check.disabled) return false

  checkSnap.ref().update({
    pending: true
  }, function() {

    // for tests, should be at least 0
    setTimeout(function() {

      cluster.run(check.code, function(output, notifMess, err) {
        util.log('update', checkSnap.key(), '"' + notifMess + '"', output, err)

        var notifs = check.notifs || []

        if (notifMess) {
          notifs.unshift([notifMess, new Date().toUTCString()])

          // TODO notify email
        }

        checkSnap.ref().update({
          ago: +(new Date()),
          status: err ? 'error' : (notifMess ? 'notification' : 'ok'),
          pending: false,
          output: output || null,
          notifs: notifs.slice(0, 20),
          error: err ? (err.name + ': ' + err.message) : null
        }, function(error) {
          if (error) throw error
        })
      })
    }, (process.env.CHECKIT_CHECK_SLEEP || 0) + 100) // at least 100ms for tests
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
  firebase.child('checks').once('value', function(snap) {
    snap.forEach(function(userSnap) {
      userSnap.forEach(runCheck)
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
    var checkId = snap.val()[1]
    var checkRef = firebase.child('checks').child(userId).child(checkId)

    snap.ref().remove(function() {
      checkRef.once('value', runCheck)
    })
  })
}


module.exports = {
  start: start,
  runLoop: runLoop,
  startLoop: startLoop,
  startQueue: startQueue
}
