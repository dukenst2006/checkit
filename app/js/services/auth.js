define([
  'services/firebase'
], function(firebase) {

  return {
    user: {
      uid: null,
      provider: null,
      notificationEnabled: null,
      notificationEmail: null
    },

    isAuthenticated: function() {
      return firebase.getAuth() !== null
    },

    /**
     * Listen to authentication state change
     */
    start: function() {
      var self = this

      firebase.onAuth(function(authData) {
        window.userUID = authData && authData.uid

        // authenticated, fetch profile
        if (authData) {
          self.user.uid = authData.uid

          firebase.child('users/' + authData.uid).on('value', function(snap) {
            var user = snap.val()
            if (user !== null) {
              for (var k in user) {
                self.user[k] = user[k]
              }
            }
          })
        }

        // logout, clean user
        else {
          for (var k in self.user) self.user[k] = null
        }
      })
    }
  }
})
