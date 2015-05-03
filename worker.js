require('dotenv').config({ path: 'config/env' })
require('dotenv').load()

var util = require('util')
var starter = require('./worker/starter')

starter.start(function() {
  util.log('starting')
  starter.startQueue()
  starter.startLoop()
})
