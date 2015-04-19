define([
  'vue',
  'rainbow'
], function(Vue, Rainbow) {

  return Vue.directive('colorize', {

    update: function (code) {
      code && Rainbow.color(code, 'javascript', function(colorized) {
        this.el.innerHTML = colorized
      }.bind(this))
    }

  })
})
