
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
    $:        '../libs/zepto/zepto'
  },

  deps: ['$', '_', 'es5', 'es6', 'vue'],

  shim: {
    $: { exports: '$' },
    _: { exports: '_' },
    backbone: { deps: ['_'] }
  }

})

define([
  'modules/layout',
  'services/auth',
  'services/router',
  'services/notifier',
  'components/auth',
  'components/header',
  'components/notifications',
  'components/test',
  'directives/route',
  'filters/gravatar'
], function (Layout, Auth, Router) {

  // wait for authentication state
  Auth.listen(_.once(function() {
    Router.start()
    Layout.$mount(document.body)
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
