define({
  FIREBASE: (typeof isTesting !== 'undefined' && isTesting)
    ? 'https://checkit-test.firebaseio.com'
    : 'https://checkit-dev.firebaseio.com'
})
