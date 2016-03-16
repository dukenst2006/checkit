var util = require('util')
var express = require('express')
var app = express()
var port = process.env.PORT || 3000

util.log('starting on port ' + port)

// do not serve
app.use('/', (req, res, next) => {
  if (req.url.match(/^\/(css|js|libs)\/.+$/) && !req.url.match(/^\/libs\/requirejs.+$/)) {
    return res.status(403).end('403 Forbidden')
  }
  next()
})

app.use(express.static(__dirname + '/public', { index: 'prod.html' }))
app.listen(port)
