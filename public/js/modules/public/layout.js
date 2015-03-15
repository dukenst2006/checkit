define([
  'vue',
  'text!./layout.html',
], function(Vue, template) {

  return Vue.component('public', {

    inherit: true,

    template: template,

    methods: {
      openAuthModal: function(formName) {
        this.$.authModal.open(formName)
      }
    }
  })
})
