require('dotenv').config({ path: 'config/env' })
require('dotenv').load()

var starter = require('./worker/starter')

starter.start(function() {
  starter.startQueue()
  starter.startLoop()
})
