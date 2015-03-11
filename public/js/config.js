define({

  FIREBASE: (typeof isTesting !== 'undefined' && isTesting)
    ? 'https://checkit-test.firebaseio.com'
    : 'https://checkit-dev.firebaseio.com'
  ,

  PUSH_STATE: true,

  MODULES: [
    './modules/dashboard/layout',
    './modules/dashboard/home',
    './modules/dashboard/settings',

    './modules/public/layout',
    './modules/public/home'
  ],

  ROUTES: [
    { name: 'dashboard_home', url: 'dashboard/' },
    { name: 'dashboard_settings', url: 'dashboard/settings' },

    { name: 'home', url: '' },
    { name: 'notFound', url: '*404' }
  ]
})
