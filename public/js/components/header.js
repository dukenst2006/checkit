define([
  'vue',
  'text!./header.html'
], function(Vue, template) {

  return Vue.component('header', {

    inherit: true,

    replace: true,

    template: template,

    data: function() {
      return {
        isMenuOpen: false
      }
    },

    methods: {
      showUserMenu: function() {
        this.$data.isMenuOpen = true
      },

      hideUserMenu: function() {
        this.$data.isMenuOpen = false
      }
    }
  })
})
