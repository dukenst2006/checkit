const firebase_url = process.env.CHECKIT_IS_TESTING
  ? process.env.CHECKIT_FIREBASE_URL_TEST
  : process.env.CHECKIT_FIREBASE_URL

module.exports = new (require('firebase'))(firebase_url)
