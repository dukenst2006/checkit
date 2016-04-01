require('dotenv').load({ path: 'config/env' })

var worker = require('../worker/worker')

worker.start(function() {
  worker.startQueue()
  worker.startLoop()
})
