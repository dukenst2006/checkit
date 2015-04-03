define([
  'vue',
  'services/auth',
  'services/router',
  'services/test-helper',
  'text!./layout.html'
], function(Vue, Auth, Router, testHelper, template) {

  return Vue.component('dashboard', {

    inherit: true,

    template: template,

    data: function() {
      return {
        isMenuOpen: false
      }
    },

    ready: function() {
      if (!Auth.isAuthenticated()) {
        console.error('You must be authenticated to access this url')
        Router.navigateTo('home')
      }
    },

    methods: {
      createTest: testHelper.createTest.bind(testHelper),

      showUserMenu: function() {
        this.$data.isMenuOpen = true
      },

      hideUserMenu: function() {
        this.$data.isMenuOpen = false
      }

    }
  })
})
