define({
  FIREBASE: window.isTesting
    ? 'https://checkit-test.firebaseio.com'
    : 'https://checkit-dev.firebaseio.com'
})
