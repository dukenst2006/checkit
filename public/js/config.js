define({

  FIREBASE: (typeof isTesting !== 'undefined' && isTesting)
    ? 'https://checkit-test.firebaseio.com'
    : 'https://checkit-dev.firebaseio.com'
  ,

  PUSH_STATE: true,

  ROUTES: [
    { name: 'dashboard_home', url: 'dashboard/' },
    { name: 'home', url: '' },
    { name: 'notFound', url: '*404' }
  ]
})
