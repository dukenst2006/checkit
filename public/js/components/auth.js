define([
  'vue',
  'services/firebase',
  'services/router',
  'text!./auth.html'
], function(Vue, firebase, Router, template) {

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
        user: {},
        message: null,
        isOpen: false,
        formName: 'signIn'
      }
    },

    ready: function() {
      this.$el.addEventListener('click', this.hide.bind(this))
    },

    methods: {

      open: function(formName) {
        if (formName && typeof formName === 'string') this.$data.formName = formName
        this.$data.isOpen = true
        this.$el.classList.add('active')
        this.$el.style.display = 'block'
      },

      hide: function(event) {
        if (event.target.classList.contains('overlay')) {
          this.$data.isOpen = false
          this.$el.classList.remove('active')

          // wait for css animation
          setTimeout(function() {
            this.$el.style.display = 'none'
          }.bind(this), 300)
        }
      },

      getFormClass: function(formName) {
        if (formIndex(this.$data.formName) > formIndex(formName)) return 'slide-left'
        if (formIndex(this.$data.formName) < formIndex(formName)) return 'slide-right'
        return 'current'
      },

      signIn: function(event) {
        event.preventDefault()
        this.$data.message = ''

        firebase.authWithPassword(this.$data.user, function(err, authData) {
          if (err) {
            this.$data.message = formatFirebaseError(err)
            return
          }

          Router.navigateTo('dashboard_home')
        }.bind(this))
      },

      signInWithProvider: function(provider) {
        this.$data.message = ''

        firebase.authWithOAuthPopup(provider, function(err, authData) {
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
              }, onSuccess)
            } else {
              onSuccess()
            }
          })
        }.bind(this))

        function onSuccess() {
          Router.navigateTo('dashboard_home')
        }
      },

      signUp: function(event) {
        event.preventDefault()
        this.$data.message = ''

        firebase.createUser(this.$data.user, function(err) {
          if (err) {
            this.$data.message = formatFirebaseError(err)
            return
          }

          // finally, login
          firebase.authWithPassword(this.$data.user, function(err, authData) {

            var userData = _.omit(this.$data.user, 'password')
            userData.provider = 'password'

            // save new user's profile
            firebase.child('users/' + authData.uid).set(userData, function() {
              this.$data.message = 'Your account has been created.'
              Router.navigateTo('dashboard_home')
            }.bind(this))
          }.bind(this))
        }.bind(this))
      },

      resetPassword: function(event) {
        event.preventDefault()
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
