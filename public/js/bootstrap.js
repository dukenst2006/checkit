console.time('bootstrap')

console.log = console.log.bind(console)

require.config({

  paths: {
    fb:       '../libs/firebase/firebase-debug',
    text:     '../libs/requirejs-text/text',
    vue:      '../libs/vue/dist/vue',
    es6:      '../libs/es6-shim/es6-shim',
    behave:   '../libs/behave/behave',
    rainbow:  '../libs/rainbow/js/rainbow',
    dom4:     '../libs/dom4/build/dom4'
  },

  deps: ['es6', 'vue', 'dom4'],

  shim: {
    rainbow: { init: function() {
      require([
        '../libs/rainbow/js/language/generic',
        '../libs/rainbow/js/language/javascript'
      ])

      Rainbow.extend('javascript', [
        {
          name: 'newLine',
          pattern: /^\s*\n/
        }
      ])

      return Rainbow
    }}
  }

})

define([
  'modules/layout',
  'services/auth'
], function (Layout, Auth) {

  Auth.start()

  require([
    './modules/layout',
    './modules/auth',
    './modules/home',
    './modules/settings'
  ], function() {
    Layout.$mount(document.body)
  })
})
