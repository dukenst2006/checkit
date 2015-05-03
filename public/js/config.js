define({
  FIREBASE: window.isTesting
    ? 'https://checkit-testing.firebaseio.com'
    : 'https://checkit-dev.firebaseio.com'
})
