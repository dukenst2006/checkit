// TITLE Check if it's freezing today

// using openWeatherMap api
var city = 'Paris,fr'
var appid = '84c2fc3de4e763a77f42d146a277021a'
var url ='http://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + appid + '&units=metric'

// request api for today's weather
request({ url: url, json: true }, function(err, resp, body) {
  // check if temperature below 0
  if (resp.statusCode == 200 && body.main.temp_min < 0) {
    // send notification/email
    notify('Today is freezing')
  }
  done()
})
