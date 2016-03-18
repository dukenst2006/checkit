define([
  'vue',
  'text!./layout.html',
  'services/auth',
  'services/firebase'
], function(Vue, template, Auth, firebase) {

  return new Vue({

    template: template,

    replace: false,

    data: function() {
      return {
        authUser: Auth.user,
        component: null
      }
    },

    created: function() {
      firebase.onAuth(function(authData) {
        this.component = authData ? 'dashboard' : 'auth'
      }.bind(this))
    },

    methods: {
      openSettingsModal: function() {
        this.$.settingsModal.open()
      }
    }
  })

})
