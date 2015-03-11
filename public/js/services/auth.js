define([
  'services/firebase'
], function(firebase) {

  return {

    user: {
      name: null,
      email: null
    },

    isAuthenticated: function() {
      return firebase.getAuth() !== null
    },

    /**
     * Listen to authentication state change
     */
    listen: function(callback) {
      var self = this

      firebase.onAuth(function(authData) {
        if (authData) {
          // if user not found
          var timeout = setTimeout(callback, 1200)

          // if there's a user authenticated, automatically fetch his profile
          firebase.child('users/' + authData.uid).on('value', function(snap) {
            // user already exists
            if (snap.val() !== null) {
              _.extend(self.user, snap.val(), { uid: snap.name() })
              clearTimeout(timeout)
              callback()
            }
          })

        } else {
          // clean user object
          for (var k in self.user) {
            self.user[k] = null
          }
          callback()
        }
      })
    }
  }
})
