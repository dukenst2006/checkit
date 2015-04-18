console.time('bootstrap')
console.time('started')

require.config({

  paths: {
    _:        '../libs/underscore/underscore',
    fb:       '../libs/firebase/firebase-debug',
    text:     '../libs/requirejs-text/text',
    vue:      '../libs/vue/dist/vue',
    backbone: '../libs/backbone/backbone',
    es5:      '../libs/es5-shim/es5-shim',
    es6:      '../libs/es6-shim/es6-shim',
    md5:      '../libs/js-md5/js/md5',
    $:        '../libs/zepto/zepto',
    behave:   '../libs/behave/behave',
    rainbow:  '../libs/rainbow/js/rainbow',
    dom4:     '../libs/dom4/build/dom4'
  },

  deps: ['$', '_', 'es5', 'es6', 'vue', 'dom4'],

  shim: {
    $: { exports: '$' },
    _: { exports: '_' },
    backbone: { deps: ['_'] },
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
  'services/auth',
  'services/router'
], function (Layout, Auth, Router) {
  console.timeEnd('started')

  // wait for authentication state
  Auth.listen(_.once(function() {
    Router.start()
    Layout.$mount(document.body)
    console.timeEnd('bootstrap')
  }))

})


// ----
// Misc

define('underscore', function() {
  return _
})

define('jquery', ['$'], function() {
  return $
})

// (debug) fix for warn() not supporting stack traces
//console.warn = console.error;
