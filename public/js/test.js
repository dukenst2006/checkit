var karma = window.__karma__

window.isTesting = true

// monkey patch to prevent "no timestamp" error
// https://github.com/karma-runner/karma-requirejs/issues/6#issuecomment-23037725
for (var file in karma.files) {
  var fileWithoutLeadingSlash = file.replace(/^\//, '')
  karma.files[fileWithoutLeadingSlash] = karma.files[file]
  delete karma.files[file]
}

// test specific config
require.config({
  baseUrl: 'base/public/js'
})

jasmine.DEFAULT_TIMEOUT_INTERVAL = 10 * 1000

// start app and run tests
require(['bootstrap'], function() {
  // wait for application to start
  // get all test files
  var tests = Object.keys(karma.files).filter(function(file) {
    return /(spec|e2e)\.js$/.test(file)
  })

  //tests = ['base/public/js/security.e2e.js']
  //tests = ['base/public/js/modules/settings.e2e.js']

  require(['services/test-utils'], function(Utils) {
    window.authUser = {}

    Utils.createUser(authUser, function() {
      require(tests, karma.start)
    })

    function onKarmaComplete(cb) {
      Utils.login(authUser, function() {
        Utils.deleteUser(authUser, function() {
          Utils.logout()
          cb()
        })
      })
    }

    var karmaComplete = karma.complete
    karma.complete = function(result) {
      onKarmaComplete(function() {
        karmaComplete(result)
      })
    }
  })
})

// include styles
var link = document.createElement('link')
link.rel = 'stylesheet'
link.href = '/base/public/var/styles.css'
document.head.appendChild(link)
