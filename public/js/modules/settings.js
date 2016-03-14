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

    data: function() {
      return {
        user: Auth.user,
        passwordSuccess: null
      }
    },

    methods: {

      changePassword: function() {
        var oldPassword = prompt('Please enter old password:')
        if(!oldPassword) return
        var newPassword = prompt('Please enter new password:')
        if(!newPassword) return

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
        var password = prompt(
          'Please enter your password:\n\n' +
          '(It will permanently delete your account data)'
        )

        if (!password) return

        var user = this.$data.user

        firebase.removeUser({ email: user.email, password: password }, function(err) {
          if (err) alert('Error: ' + err.code)

          firebase.child('users/' + user.uid + 'j').remove(function(err) {
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
