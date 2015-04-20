define([
  'vue',
  'services/auth',
  'services/router',
  'text!./layout.html'
], function(Vue, Auth, Router, template) {

  return Vue.component('dashboard', {

    inherit: true,

    template: template,

    ready: function() {
      if (!Auth.isAuthenticated()) {
        console.error('You must be authenticated to access this url')
        Router.navigateTo('home')
      }
    },

    methods: {
      openSettingsModal: function() {
        this.$.settingsModal.open()
      }
    }
  })
})
