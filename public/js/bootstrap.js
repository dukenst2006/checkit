console.time('bootstrap')

console.log = console.log.bind(console)

require.config({

  paths: {
    fb: "https://cdn.firebase.com/js/client/2.4.1/firebase",
    vue: "https://cdnjs.cloudflare.com/ajax/libs/vue/1.0.18/vue",
    //vue: "../libs/vue/dist/vue",
    es6: "https://cdnjs.cloudflare.com/ajax/libs/es6-shim/0.35.0/es6-shim.min",

    text:     '../libs/requirejs-text/text',
    behave:   '../libs/behave/behave',
    rainbow:  '../libs/rainbow/js/rainbow',
    rainbowGeneric: '../libs/rainbow/js/language/generic',
    rainbowJavascript: '../libs/rainbow/js/language/javascript'
  },

  deps: ['es6', 'vue'],

  shim: {
    rainbowGeneric: { deps: ['rainbow'] },
    rainbowJavascript: { deps: ['rainbow'] },
    rainbow: { init: function() {
      require(['rainbowGeneric', 'rainbowJavascript'])

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
  'services/auth'
], function (Auth) {

  Auth.start()

  require([
    './modules/layout',
    './modules/auth',
    './modules/home',
    './modules/settings'
  ], function(Layout) {
    Layout.$mount(document.body)
  })
})
