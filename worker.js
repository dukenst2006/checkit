require('dotenv').load({ path: 'config/env' })

var starter = require('./worker/starter')

starter.start(function() {
  starter.startQueue()
  starter.startLoop()
})
