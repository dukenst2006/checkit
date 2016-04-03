// TITLE Check if today temperature is above 0°C (32°F)

// using openWeatherMap api
var city = 'Paris,fr';
var appid = '84c2fc3de4e763a77f42d146a277021a';
var unit = 'metric'; // or imperial
var url ='http://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + appid + '&units=' + unit;

// request api for today's weather
request({ url: url, json: true }, function(err, resp, body) {
  if (err) throw err;

  // check if temperature below 0
  if (resp.statusCode == 200 && body.main.temp_min > 0) {
    // send notification/email
    notify('Today temperature is above 0°C (32°F)');
  } else {
    log('It\'s freezing today');
  }
  done();
});
