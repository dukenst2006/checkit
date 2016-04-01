define([
  'vue',
  'services/firebase',
  'services/auth',
  'text!./auth.html',
  '../../dist/examples'
], function(Vue, firebase, Auth, template) {

  function formatFirebaseError(err) {
    return (err && err.message)
      ? err.message.replace('FirebaseSimpleLogin: ', '')
      : err
  }

  return Vue.component('auth', {

    template: template,

    data: function() {
      return {
        user: {
          uid: null,
          notificationEnabled: false,
          notificationEmail: null
        },
        showLogin: true,
        loadSampleData: true,
        message: null
      }
    },

    methods: {

      login: function(provider) {
        this.$data.message = ''
        this.$dispatch('prevent-component-change')

        firebase.authWithOAuthPopup(provider, function(err, authData) {
          if (err) {
            this.$data.message = formatFirebaseError(err)
            return
          }

          // check if profile already exists
          firebase.child('users/' + authData.uid).once('value', function(snap) {
            if (snap.val() !== null) {
              this.$dispatch('set-component', 'dashboard')
              return
            }

            this.$data.showLogin = false
            this.$data.user.uid = authData.uid

            firebase.child('users/' + this.$data.user.uid).set({
              provider: provider,
              name: authData[provider].displayName,
            })
          }.bind(this))
        }.bind(this))
      },

      config: function() {
        firebase.child('users/' + this.$data.user.uid).update({
          notificationEnabled: this.$data.user.notificationEnabled,
          notificationEmail: this.$data.user.notificationEmail
        })

        if (this.$data.loadSampleData) {
          var checksRef = firebase.child('checks/' + this.$data.user.uid)
          var queueRef = firebase.child('queue')
          var checks = window.CHECKIT_EXAMPLES.slice(0, 3)

          for (var i = 0; i < checks.length; i++) {
            var check = Object.assign(checks[i], {
              ago: new Date().getTime(),
              pending: true,
              notifs: [],
              error: '',
              output: '',
              status: 'ok'
            })

            var checkRef = checksRef.push(check)
            queueRef.push([this.$data.user.uid, checkRef.key()])
          }
        }

        if (window.ga) {
          ga('send', 'event', 'App', 'create-account')
        }

        this.$dispatch('set-component', 'dashboard')
      }
    }
  })
})
