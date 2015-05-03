require('dotenv').config({ path: 'config/env' })

var util = require('util')
var starter = require('./worker/starter')

starter.start(function() {
  util.log('starting')
  starter.startQueue()
  starter.startLoop()
})
