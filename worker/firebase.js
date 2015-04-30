var config = require('requirejs')(__dirname + '/../public/js/config.js')
var firebase = new (require('firebase'))(config.FIREBASE)

module.exports = firebase
