define([
  'vue',
  'mixins/modal',
  'services/auth',
  'services/firebase',
  'text!./settings.html'
], function(Vue, ModalMixin, Auth, firebase, template) {

  return Vue.component('settings', {

    template: template,

    inherit: true,

    mixins: [ModalMixin],

    watch: {
      'user.notificationEnabled': function(enabled) {
        if (enabled && !this.$data.user.notificationEmail) {
          this.$data.user.notificationEmail = this.$data.user.email
        }
      }
    },

    data: function() {
      return {
        user: Auth.user,
        loaderNotificationEnabled: false,
        loaderNotificationEmail: false,
        passwordSuccess: null
      }
    },

    methods: {

      updateNotificationEnabled: function() {
        this.$data.loaderNotificationEnabled = true

        firebase.child('users').child(this.$data.user.uid).update({
          notificationEnabled: this.$data.user.notificationEnabled
        }, function() {
          setTimeout(function() {
            this.$data.loaderNotificationEnabled = false
          }.bind(this), 400)
        }.bind(this))
      },

      updateNotificationEmail: function() {
        this.$data.loaderNotificationEmail = true

        firebase.child('users').child(this.$data.user.uid).update({
          notificationEmail: this.$data.user.notificationEmail
        }, function() {
          setTimeout(function() {
            this.$data.loaderNotificationEmail = false
          }.bind(this), 400)
        }.bind(this))
      },

      updatePassword: function() {
        var oldPassword = prompt('Please enter old password:')
        if (!oldPassword) return
        var newPassword = prompt('Please enter new password:')
        if (!newPassword) return

        firebase.changePassword({
          email: this.$data.user.email,
          oldPassword: oldPassword,
          newPassword: newPassword
        }, function(err) {
          if (err) {
            alert('Error: ' + err.message)
          } else {
            this.$data.passwordSuccess = 'Password successfully updated.'
          }
        }.bind(this))
      },

      deleteUser: function() {
        // for now this is not possible to achieve
        // if we call removeUser() the user is successfully removed
        // but then firebase.child('users/' + uid).remove() is not granted anymore
        // a solution would be to create a special API for this task
        // or wait to be able to remove a user without password
        // https://github.com/firebase/angularfire/issues/530
        return;

        var password = prompt(
          'Please enter your password:\n\n' +
          '(It will permanently delete your account data)'
        )

        if (!password) return

        var user = this.$data.user
        var uid = user.uid

        firebase.removeUser({ email: user.email, password: password }, function(err) {
          if (err) {
            return alert('Error: ' + err.code)
          }

          firebase.child('users/' + uid).remove(function(err) {
            if (err) {
              alert('Error: ' + err.message)
            } else {
              firebase.unauth()
              this.close()
            }
          }.bind(this))
        }.bind(this))
      },

      logout: function() {
        firebase.unauth()
        this.close()
      }
    }
  })
})
