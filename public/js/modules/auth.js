define([
  'vue',
  'services/firebase',
  'services/auth',
  'text!./auth.html'
], function(Vue, firebase, Auth, template) {

  function formatFirebaseError(err) {
    return (err && err.message)
      ? err.message.replace('FirebaseSimpleLogin: ', '')
      : err
  }

  function formIndex(formName) {
    return ['resetPass', 'signIn', 'signUp'].indexOf(formName)
  }

  return Vue.component('auth', {

    template: template,

    data: function() {
      return {
        user: {
          email: '',
          password: ''
        },
        message: null,
        loading: false,
        formName: 'signIn'
      }
    },

    methods: {

      getFormClass: function(formName) {
        if (formIndex(this.$data.formName) > formIndex(formName)) return 'slide-left'
        if (formIndex(this.$data.formName) < formIndex(formName)) return 'slide-right'
        return 'current'
      },

      signIn: function() {
        this.$data.message = ''
        this.$data.loading = true

        firebase.authWithPassword(this.$data.user, function(err, authData) {
          this.$data.loading = false

          if (err) {
            this.$data.message = formatFirebaseError(err)
            return
          }
        }.bind(this))
      },

      signInWithProvider: function(provider) {
        this.$data.message = ''
        this.$data.loading = true

        firebase.authWithOAuthPopup(provider, function(err, authData) {
          this.$data.loading = false

          if (err) {
            this.$data.message = formatFirebaseError(err)
            return
          }

          // check if profile already exists
          firebase.child('users/' + authData.uid).once('value', function(snap) {

            if (snap.val() === null) {
              // save new user's profile
              firebase.child('users/' + authData.uid).set({
                name: authData[provider].displayName,
                provider: provider
              })

              this.saveDefaultCheck(authData)
            }
          }.bind(this))
        }.bind(this))
      },

      signUp: function() {
        this.$data.message = ''
        this.$data.loading = true

        firebase.createUser(this.$data.user, function(err) {
          this.$data.loading = false

          if (err) {
            this.$data.message = formatFirebaseError(err)
            return
          }

          this.$data.message = 'Your account has been created.'

          // finally, login
          firebase.authWithPassword(this.$data.user, function(err, authData) {
            delete this.$data.user.password
            this.$data.user.provider = 'password'

            // save new user's profile
            firebase.child('users/' + authData.uid).set(this.$data.user)

            this.saveDefaultCheck(authData)
          }.bind(this))
        }.bind(this))
      },

      saveDefaultCheck: function(authData) {
        firebase.child('checks/' + authData.uid).push({
          name: 'Check `example.com` is down',
          status: 'ok',
          output: 'domain "example.com" is up',
          ago: new Date().getTime(),
          pending: false,
          code: [
            '// send a request, see https://github.com/request/request',
            'request(\'http://example.com\', function (error, response, body) {',
            '',
            '  // if statusCode is non 200',
            '  if (!error && response.statusCode != 200) {',
            '    notify(\'domain "example.com" is down\');',
            '  }',
            '',
            '  // else everything is fine',
            '  else {',
            '    log(\'domain "example.com" is up\');',
            '  }',
            '',
            '  done();',
            '});'
          ].join('\n')
        })
      },

      resetPassword: function() {
        this.$data.message = ''

        firebase.resetPassword({ email: this.$data.user.email }, function(err) {
          if (err) {
            this.$data.message = formatFirebaseError(err)
            return
          }

          this.$data.message = 'An email has been sent with a temporary password.'
        }.bind(this))
      }
    }
  })
})
