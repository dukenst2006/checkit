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

    ready: function() {
      if (!Auth.isAuthenticated()) {
        console.error('You must be authenticated to access this url')
        Router.navigateTo('home')
      }
    },

    methods: {
      createTest: testHelper.createTest.bind(testHelper),
      openAuthModal: _.noop
    }
  })
})
