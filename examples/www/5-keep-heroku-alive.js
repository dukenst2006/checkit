// TITLE Keep Heroku dyno alive

// ping heroku dyno to prevent it entering sleep mode
request('https://app.check-it.io/', function(err, resp, body) {
  done()
})
