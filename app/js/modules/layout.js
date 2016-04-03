define([
  'vue',
  'services/auth',
  'services/firebase',
  'text!./layout.html'
], function(Vue, Auth, firebase, template) {

  return new Vue({

    template: template,

    replace: false,

    data: function() {
      return {
        component: null
      }
    },

    events: {
      'set-component': function(component) {
        this.component = component
      },
      'prevent-component-change': function() {
        this.preventComponentChange = true
      }
    },

    created: function() {
      log('--> auth.created')
      firebase.onAuth(function(authData) {
        if (!this.preventComponentChange) {
          log('--> set component')
          this.component = authData ? 'dashboard' : 'auth'
        } else {
          this.preventComponentChange = false
        }
      }.bind(this))
    },

    methods: {

      openSettingsModal: function() {
        // TODO fixme settingsmodal => settingsModal
        this.$refs.settingsmodal.open()
      }

    }
  })

})
