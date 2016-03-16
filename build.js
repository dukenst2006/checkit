({
  baseUrl: "public/js",
  out: "public/var/build.js",
  mainConfigFile: "public/js/bootstrap.js",
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
