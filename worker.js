var starter = require('./worker/starter')

starter.start(function() {
  starter.startQueue()
  starter.startLoop()
})
