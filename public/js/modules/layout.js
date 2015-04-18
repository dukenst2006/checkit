define([
  'vue',
  'text!./layout.html',
  'config',
  'services/auth',
  'services/router'
], function(Vue, template, Config, Auth, Router) {

  return new Vue({

    template: template,

    data: function() {
      return {
        user: Auth.user,
        layoutView: null,
        mainView: null
      }
    },

    created: function() {
      this.components = Vue.options.components

      this.$layout = document.body

      Router.on('route', this.$options._updateClass.bind(this))
      Router.on('route', this.$options._updateView.bind(this))
    },

    _updateClass: function(routeName) {
      this.$layout.id = routeName
    },

    _updateView: function(routeName) {
      if (routeName === 'notFound') {
        return document.write('Not found - 404')
      }

      // add 'layout' option for Vue.component(...)
      var layout = this.components[routeName].prototype.constructor.options.layout;

      if (layout) {
        this.layoutView = layout
        this.mainView = routeName
      } else {
        this.layouView = routeName
      }
    }
  })

})
