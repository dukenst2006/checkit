// TITLE Check when domain is not renewed

var apiKey = 'YOUR_API_KEY'; // don't forget to replace it
var domain = 'example.com';
var url = 'http://api.whoapi.com/?domain=' + domain + '&r=whois&apikey=' + apiKey;

//request whois API
request({ url: url, json: true }, function (err, resp, body) {
  // check if domain can be registered
  if (resp.statusCode == 200 && body.registered == false) {
    // send notification/email
    notify('domain "example.com" is now available');
  }
  done();
});
