define([
  'vue',
  'text!./home.html',
  'config'
], function(Vue, template, CONFIG) {

  return Vue.component('home', {

    template: template,

    layout: 'public',

    inherit: true
  })
})
