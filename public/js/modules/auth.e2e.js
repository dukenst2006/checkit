define([
  'services/firebase',
  'services/auth',
  'services/test-utils'
], function(firebase, Auth, Utils) {

  describe('components/auth', function() {
    var $auth, $notif, existingUser = {}

    beforeEach(function(done) {
      Utils.logout()
      Utils.createUser(existingUser, done)
    })

    beforeEach(function(done) {
      Utils.waitForElementExists('.auth', function() {
        $auth = document.querySelector('.auth')
        $notif = $auth.querySelector('.notif')
        done()
      })
    })

    afterEach(function(done) {
      Utils.deleteUser(existingUser, done)
    })

    describe('signIn()', function() {
      var $email, $password, $submit

      beforeEach(function(done) {
        Utils.waitForElementVisible('form[name=signIn]', function() {
          $email =    $auth.querySelector('form[name=signIn] [type=email]')
          $password = $auth.querySelector('form[name=signIn] [type=password]')
          $submit =   $auth.querySelector('form[name=signIn] [type=submit]')
          done()
        })
      })

      it('show error for invalid email', function(done) {
        Utils.value($email, 'wrong_email@example.com')
        Utils.value($password, 'wrong password')
        Utils.triggerEvent('click', $submit)

        Utils.waitForElementVisible('.auth .notif', function() {
          expect($notif.textContent).toEqual('The specified user does not exist.')
          done()
        })
      })

      it('show error for invalid pass', function(done) {
        Utils.value($email, existingUser.email)
        Utils.value($password, 'wrong password')
        Utils.triggerEvent('click', $submit)

        Utils.waitForElementVisible('.auth .notif', function() {
          expect($notif.textContent).toEqual('The specified password is incorrect.')
          done()
        })
      })

      it('shows a confirmation if successful', function(done) {
        Utils.value($email, existingUser.email)
        Utils.value($password, '****')
        Utils.triggerEvent('click', $submit)

        Utils.waitFor(function() {
          return Auth.user.email
        }, function() {
          expect(Auth.user.email).toEqual(existingUser.email)
          expect(Auth.user.uid).toBeDefined()
          done()
        })
      })
    })

    describe('signUp()', function() {
      var $email, $password, $submit

      beforeEach(function(done) {
        // open resetPass form
        Utils.triggerEvent('click', $auth.querySelector('.sign-up'))

        Utils
          .waitForElementVisible('form[name=signUp]', function() {
            $email =    $auth.querySelector('form[name=signUp] [type=email]')
            $password = $auth.querySelector('form[name=signUp] [type=password]')
            $submit =   $auth.querySelector('form[name=signUp] [type=submit]')
            done()
          })
      })

      it('show error for an already existing email', function(done) {
        Utils.value($email, existingUser.email)
        Utils.value($password, '****')
        Utils.triggerEvent('click', $submit)

        Utils.waitForElementVisible('.auth .notif', function() {
          expect($notif.textContent).toEqual('The specified email address is already in use.')
          done()
        })
      })

      it('shows a confirmation if successful', function(done) {
        var rand = Utils.random()
        var email = 'bob_' + rand + '@example.com'

        Utils.value($email, email)
        Utils.value($password, '****')
        Utils.triggerEvent('click', $submit)

        Utils.waitFor(function() {
          return Auth.isAuthenticated()
        }, function() {
          expect(Auth.user.email).toEqual(email)
          expect(Auth.user.uid).toBeDefined()
          done()
        })
      })
    })

    describe('resetPassword()', function() {
      var $email, $submit

      beforeEach(function(done) {
        // open resetPass form
        Utils.triggerEvent('click', $auth.querySelector('.reset-pass'))

        Utils
          .waitForElementVisible('form[name=resetPass]', function() {
            $email = $auth.querySelector('form[name=resetPass] [type=email]')
            $submit = $auth.querySelector('form[name=resetPass] [type=submit]')
            done()
          })
      })

      it('show a error message if user does not exists', function(done) {
        Utils.value($email, 'unknown@example.com')
        Utils.triggerEvent('click', $submit)

        Utils.waitForElementVisible('.auth .notif', function() {
          expect($notif.textContent).toEqual('The specified user does not exist.')
          done()
        })
      })

      it('show a success message if user exists', function(done) {
        Utils.value($email, existingUser.email)
        Utils.triggerEvent('click', $submit)

        Utils.waitForElementVisible('.auth .notif', function() {
          expect($notif.textContent).toEqual('An email has been sent with a temporary password.')
          done()
        })
      })
    })
  })
})
