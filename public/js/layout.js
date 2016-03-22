define([
  'vue',
  'services/auth',
  'services/firebase'
], function(Vue, Auth, firebase) {

  return new Vue({

    template: '<component :is="component"></component>',

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
      firebase.onAuth(function(authData) {
        if (!this.preventComponentChange) {
          this.component = authData ? 'dashboard' : 'auth'
        } else {
          this.preventComponentChange = false
        }
      }.bind(this))
    }
  })

})
