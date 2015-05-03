var util = require('util')
var express = require('express')
var app = express()

util.log('starting on port ' + process.env.PORT)

app.use(express.static(__dirname + '/public'))
app.listen(process.env.PORT || 3000)
