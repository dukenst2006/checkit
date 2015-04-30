var isTesting = false

if (typeof window !== 'undefined') {
  isTesting = window.isTesting
}

if (typeof process !== 'undefined') {
  isTesting = process.env.isTesting
}

define({
  FIREBASE: isTesting
    ? 'https://checkit-test.firebaseio.com'
    : 'https://checkit-dev.firebaseio.com'
})
