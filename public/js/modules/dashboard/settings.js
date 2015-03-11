define([
  'vue',
  'services/auth',
  'services/firebase',
  'services/router',
  'services/notifier',
  'text!./settings.html'
], function(Vue, Auth, firebase, Router, Notifier, template) {

  return Vue.component('dashboard_settings', {

    layout: 'dashboard',

    template: template,

    data: function() {
      return {
        user: Auth.user,
        toggleChangePassword: false
      }
    },

    methods: {

      updateUser: function() {
        firebase.child('users/' + this.$data.user.uid).set({
          name: this.$data.user.name,
          email: this.$data.user.email
        }, function() {
          Notifier.success('Profile successfully saved.')
        })
      },

      changePassword: function() {
        firebase.changePassword({
          email: this.$data.user.email,
          oldPassword: this.$data.changePasswordOld,
          newPassword: this.$data.changePasswordNew
        }, function(err) {
          if (err) {
            switch (err.code) {
              case 'INVALID_PASSWORD':
                Notifier.warning('Specified password is incorrect.')
                break
              case 'INVALID_USER':
                Notifier.warning('Specified user is incorrect (bug).')
                break
            }
          } else {
            Notifier.success('Password successfully updated.')
          }
        }.bind(this))
      },

      deleteUser: function() {
        var password = prompt(
          'Please enter your password:\n\n' +
          '(It will permanently delete your account data)'
        )

        if (!password) return

        firebase.removeUser({
          email: this.$data.user.email,
          password: password
        }, function(err) {
          if (err) {
            switch (err.code) {
              case 'INVALID_PASSWORD':
                Notifier.warning('Specified password is incorrect.')
                break
              case 'INVALID_USER':
                Notifier.warning('Specified user is incorrect (bug).')
                break
            }
          } else {
            Notifier.success('Account successfully deleted.')

            setTimeout(function() {
              Router.navigateTo('home')
              firebase.unauth()
            }, 100)
          }
        }.bind(this))
      }
    }
  })
})
