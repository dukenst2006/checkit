var util = require('util')
var firebase = require('./firebase')

var domain = process.env.CHECKIT_MAIL_DOMAIN
var apiKey = process.env.CHECKIT_MAIL_API_KEY
var mailgun = require('mailgun-js')({ apiKey: apiKey, domain: domain })

function sendMail(userSnap, check, notif) {
  var user = userSnap.val()
  if (user.notificationEnabled && user.notificationEmail) {
    rateLimitMail(userSnap.key(), function() {
      util.log('send mail', user.notificationEmail)
      mailgun.messages().send(formatMail(check, user, notif), function(err, body) {
        if (err) console.error('MAIL ERROR', err)
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

  return {
    from: process.env.CHECKIT_MAIL_SENDER,
    to: user.notificationEmail,
    subject: '[check-it notification] ' + check.name,
    html: (
      'You just received a notification from <a href="http://check-it.io">check-it.io</a> :<br>' +
      '<blockquote>' +
        '<h3>' + check.name + '</h3>' +
        '<pre>> ' + notifDate + '<br>' + notifMess + '</pre>' +
      '</blockquote>' +
      '<br>' +
      '<em>You received this mail because you have enabled <i>"Email Notifications"<i> in the application.</em><br>' +
      '<em>You can disable this setting to stop receiving these emails.</em><br><br>' +
      '<a href="%unsubscribe_url%">Unsubscribe</a>'
    ),
    text: (
      'You just received a notification from check-it.io : \n\n' +
      '> ' + check.name + '\n\n' +
      '> Date: ' + notif[1] + '\n\n' +
      '> Notification: ' + notif[0] + '\n\n' +
      '\n\n' +
      'You received this mail because you have enabled "Email Notifications" in the application.\n' +
      'You can disable this setting to stop receiving these emails.\n\n' +
      'Unsubscribe: %unsubscribe_url%'
    )
  }
}

module.exports = {
  sendMail: sendMail,
  rateLimitMail: rateLimitMail,
  formatMail: formatMail
}
