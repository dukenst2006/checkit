var util = require('util')
var firebase = require('./firebase')
var sendgrid  = require('sendgrid')(process.env.CHECKIT_SENDGRID_API_KEY)

function sendMail(userSnap, check, notif) {
  var user = userSnap.val()
  if (user.notificationEnabled && user.notificationEmail) {
    rateLimitMail(userSnap.key(), function() {
      util.log('send mail', user.notificationEmail)
      sendgrid.send(formatMail(check, user, notif), function(err, json) {
        if (err) console.error(err)
      })
    })
  }
}

function rateLimitMail(userId, onComplete) {
  var rateLimitRef = firebase.child('rate-limits').child(userId)

  rateLimitRef.once('value', function(rateLimitSnap) {
    var rateLimit = rateLimitSnap.val() || {}
    var now = new Date().getTime()

    if (!rateLimit.since || rateLimit.since < (now - 24 * 60 * 60 * 1000)) {
      rateLimit.since = now
      rateLimit.count = 0
    }

    if (rateLimit.count < process.env.CHECKIT_MAIL_LIMIT) {
      rateLimit.count++
      onComplete()
      rateLimitRef.set(rateLimit)
    }
  })
}

function formatMail(check, user, notif) {
  var notifMess = notif[0]
  var notifDate = new Date(notif[1]).toLocaleString()

  return new sendgrid.Email({
    to: user.notificationEmail,
    from: process.env.CHECKIT_MAIL_SENDER,
    subject: '[check-it notification] ' + check.name,
    html: (
      'You just received a notification from <a href="http://check-it.io">check-it.io</a> :<br>' +
      '<blockquote>' +
        '<h3>' + check.name + '</h3>' +
        '<pre>> ' + notifDate + '<br>' + notifMess + '</pre>' +
      '</blockquote>' +
      '<br>' +
      '<em>You received this mail because you have enabled <i>"Email Notifications"<i> in the application.</em><br>' +
      '<em>You can disable this setting to stop receiving these emails.</em>'
    ),
    text: (
      'You just received a notification from check-it.io : \n\n' +
      '> ' + check.name + '\n\n' +
      '> Date: ' + notif[1] + '\n\n' +
      '> Notification: ' + notif[0] + '\n\n' +
      '\n\n' +
      'You received this mail because you have enabled "Email Notifications" in the application.\n' +
      'You can disable this setting to stop receiving these emails.'
    )
  })
}

module.exports = {
  sendMail: sendMail,
  rateLimitMail: rateLimitMail,
  formatMail: formatMail
}
