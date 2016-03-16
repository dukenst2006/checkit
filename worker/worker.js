var util = require('util')
var cluster = require('./cluster')()
var firebase = require('./firebase')
var sendgrid  = require('sendgrid')(process.env.CHECKIT_SENDGRID_API_KEY)

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
          var once = false

          if (notifMess.indexOf('@once ') === 0) {
            once = true
            notifMess = notifMess.substr(6)
          }

          //sendMail(checkSnap, notifMess, once)
          notifs.unshift([notifMess, new Date().toUTCString()])
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

function sendMail(checkSnap, notifMess, once) {
  var check = checkSnap.val()
  var userId = checkSnap.ref().parent().key()

  firebase.child('users').child(userId).once('value', function(userSnap) {
    if (user.notifications && user.notifications.enabled) {
      sendgrid.send({
        to: user.notification.email,
        from: 'other@example.com', // TODO update me
        subject: '[notification] ' + check.name,
        text: 'New notification'
      }, function(err, json) {
        if (err) return console.error(err)
        console.log(json)
      })
    }
  })
}



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
