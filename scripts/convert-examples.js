#!/usr/bin/env node

var fs = require('fs')
var path = require('path')
var util = require('util')

var baseDir = path.resolve(__dirname) + '/../'

fs.readdir(baseDir + '/examples', function(err, files) {
  if (err) throw err

  var examples = files.map(function(file) {
    var content = fs.readFileSync(baseDir + 'examples/' + file, 'utf8')

    return {
      name: content.match(/^\/\/ TITLE (.*)$/m, '')[1],
      code: content.replace(/^\/\/.*\n\n/, '')
    }
  })

  fs.writeFile(baseDir + 'app/dist/examples.js', 'window.CHECKIT_EXAMPLES=' + JSON.stringify(examples), function(err) {
    if (err) throw err
  })

  fs.writeFile(baseDir + 'www/dist/examples.js', 'window.CHECKIT_EXAMPLES=' + JSON.stringify(examples), function(err) {
    if (err) throw err
  })
})
