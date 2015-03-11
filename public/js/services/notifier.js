define([], function() {

  var SHOW_DURATION = 4 * 1000

  var notifications = []

  function notify(type) {
    return function(msg) {
      var notif = {
        uid: Math.random().toString(36).substr(2,9),
        msg: msg,
        type: type || 'success'
      }

      notifications.unshift(notif)

      setTimeout(function() {
        remove(notif)
      }, SHOW_DURATION)
    }
  }

  function remove(notif) {
    var index = notifications.indexOf(notif)
    notifications.splice(index, 1)
  }

  function reset() {
    notifications.splice(0, notifications.length)
  }

  return {
    success: notify('success'),
    info: notify('info'),
    warning: notify('warning'),

    remove: remove,
    notifications: notifications,
    reset: reset
  }
})
