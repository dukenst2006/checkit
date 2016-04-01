var fs = require('fs')
var path = require('path')
var util = require('util')

var dir = process.argv.slice(2)[0];
var baseDir = path.resolve(__dirname) + '/../'

if (!dir) {
  throw new Error('Must provide directory argument (either app or www)');
}

fs.readdir(baseDir + '/examples/' + dir, function(err, files) {
  if (err) throw err

  var examples = files.map(function(file) {
    var content = fs.readFileSync(baseDir + 'examples/' + dir + '/' + file, 'utf8')

    return {
      name: content.match(/^\/\/ TITLE (.*)$/m, '')[1],
      code: content.replace(/^\/\/.*\n\n/, '')
    }
  })

  fs.writeFile(baseDir + dir + '/dist/examples.js', 'window.CHECKIT_EXAMPLES=' + JSON.stringify(examples), function(err) {
    if (err) throw err
  })
})
