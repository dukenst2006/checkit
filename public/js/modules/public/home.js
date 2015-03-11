define([
  'vue',
  'text!./home.html',
  'config'
], function(Vue, template, CONFIG) {

  return Vue.component('home', {

    template: template,

    layout: 'public',

    data: function() {
      return {
        CONFIG: CONFIG,

        TOOLS: [
          {
            name: 'firebase',
            colors: ['sun-flower', 'orange'],
            url: 'firebase.com'
          },
          {
            name: 'requirejs',
            colors: ['peter-river', 'belize-hole'],
            url: 'requirejs.org'
          },
          {
            name: 'vuejs',
            colors: ['emerald', 'nephritis'],
            url: 'vuejs.org'
          },
          {
            name: 'backbone',
            colors: ['wet-asphalt', 'midnight-blue'],
            url: 'backbonejs.org'
          }
        ]
      }
    }
  })
})
