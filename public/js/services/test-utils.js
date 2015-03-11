define([
  'services/auth',
  'services/firebase',
  'services/router',
], function(Auth, firebase, Router) {

  return {

    createUser: function(user, cb) {
      var rand = this.random()

      _.extend(user, {
        name: 'foo-' + rand,
        email: 'foo-' + rand + '@bar.com',
        provider: user.provider || 'password',
        password: '****'
      })

      firebase.createUser(user, function(err, authData) {
        if (err) throw err
        user.uid = authData.uid
        firebase.child('users/' + authData.uid).set(user, cb)
      })
    },

    createAuthenticatedUser: function(user, cb) {
      this.createUser(user, function() {
        this.login(user, function() {
          Auth.listen(_.once(cb))
        })
      }.bind(this))
    },

    login: function(user, cb) {
      firebase.authWithPassword(user, cb)
    },

    logout: function() {
      firebase.unauth()
    },

    deleteUser: function(user, cb) {
      firebase.removeUser(user, cb)
    },

    waitForRoute: function(routeName, cb, timeout) {
      this.waitFor(function() {
        return Router.routeName === routeName
      }, cb, timeout)
    },

    waitForElementExists: function(selector, cb, timeout) {
      this.waitFor(function() {
        return document.querySelector(selector) !== null
      }, cb, timeout)
    },

    waitForElementVisible: function(selector, cb, timeout) {
      this.waitFor(function() {
        var el = document.querySelector(selector)
        return el && el.style.display !== 'none'
      }, cb, timeout)
    },

    // wait for a callback to return true
    waitFor: function(check, cb, timeout) {
      var done, interval = setInterval(function() {
        if (check()) {
          done = true
          clearInterval(interval)
          cb()
        }
      }, 50)
      setTimeout(function() {
        if (!done) {
          cb()
          clearInterval(interval)
        }
      }, timeout || jasmine.DEFAULT_TIMEOUT_INTERVAL)
    },

    random: function() {
      return Math.round(Math.random() * 1000000)
    },

    value: function(el, val) {
      el.value = val
      this.triggerEvent('input', el)
      this.triggerEvent('change', el)
    },

    triggerEvent: function(type, el) {
      var isMouseEvent = type.indexOf(['click', 'mousedown', 'mouseup', 'mousemove']) === -1
      var event = document.createEvent(isMouseEvent ? 'MouseEvents' : 'Events')
      event.initEvent(type, true, true)
      el.dispatchEvent(event)
    }
  }
})
