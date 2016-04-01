({
  baseUrl: "../app/js",
  out: "../app/dist/build.js",
  mainConfigFile: "../app/js/bootstrap.js",
  generateSourceMaps: true,
  optimize: "uglify2",
  preserveLicenseComments: false,
  paths: {
    fb: "empty:",
    es6: "empty:",
    vue: "empty:"
  },
  wrap: { end: 'require(["bootstrap"])' },
  findNestedDependencies: true,
  name: "bootstrap"
})
