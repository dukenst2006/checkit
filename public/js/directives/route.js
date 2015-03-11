define([
  'vue',
  'services/router',
], function(Vue, Router) {

  return Vue.directive('route', {

    update: function () {
      this.el.href = Router.generateUrl(this.raw.replace(/'/g, ''))
    }

  })
})
