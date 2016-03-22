define([
  'services/firebase',
  'services/auth',
  'services/test-utils'
], function(firebase, Auth, Utils) {

  describe('components/auth', function() {
    var $auth, $notif

    beforeEach(function(done) {
      Utils.waitForElementExists('.auth', function() {
        $auth = document.querySelector('.auth')
        $notif = $auth.querySelector('.notif')
        done()
      })
    })

    afterEach(Utils.logout)
  })
})
