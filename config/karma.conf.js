module.exports = function (config) {
  config.set({

    basePath: '../',

    frameworks: ['jasmine', 'requirejs'],

    files: [
      'public/js/test.js',
      { pattern: 'public/js/**/*.js', included: false },
      { pattern: 'public/js/**/*.html', included: false },
      { pattern: 'public/img/**/*', included: false },
      { pattern: 'public/fonts/*', included: false },
      { pattern: 'public/libs/**/*.js', included: false },
      { pattern: 'public/var/*.css', included: false },
      { pattern: 'public/var/*.map', included: false }
    ],

    proxies: {
      '/img/': '/base/public/img/',
      '/fonts/': '/base/public/fonts/'
    },

    exclude: [
      'public/libs/**/*spec.js'
    ],

    reporters: ['mocha'],

    // web server port
    // CLI --port 9876
    port: 9876,

    // cli runner port
    // CLI --runner-port 9100
    runnerPort: 9100,

    // enable / disable colors in the output (reporters and logs)
    // CLI --colors --no-colors
    colors: true,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    // CLI --log-level debug
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    // CLI --auto-watch --no-auto-watch
    autoWatch: true,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    // CLI --browsers Chrome,Firefox,Safari
    browsers: [],

    browserNoActivityTimeout: 20 * 1000,

    // If browser does not capture in given timeout [ms], kill it
    // CLI --capture-timeout 5000
    captureTimeout: 60000,

    // Auto run tests on start (when browsers are captured) and exit
    // CLI --single-run --no-single-run
    //singleRun: true,

    // report which specs are slower than 500ms
    // CLI --report-slower-than 500
    reportSlowerThan: 10000
  });
};
