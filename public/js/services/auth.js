define([
  'services/firebase'
], function(firebase) {

  return {
    user: {
      uid: null,
      email: null,
      provider: null
    },

    isAuthenticated: function() {
      return firebase.getAuth() !== null
    },

    /**
     * Listen to authentication state change
     */
    listen: function(callback) {
      var callbackCalled = false, self = this

      firebase.onAuth(function(authData) {
        // athenticated, fetch profile
        if (authData) {
          self.user.uid = authData.uid

          firebase.child('users/' + authData.uid).on('value', function(snap) {
            if (snap.val() !== null) {
              self.user.email = snap.val().email
              self.user.provider = snap.val().provider
            }
          })
        }

        // logout, clean user
        else {
          for (var k in self.user) self.user[k] = null
        }

        if (!callbackCalled) {
          callbackCalled = true
          callback()
        }
      })
    }
  }
})
