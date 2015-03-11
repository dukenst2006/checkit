define([
  'services/auth',
  'services/notifier',
  'services/router',
  'services/test-utils'
], function(Auth, Notifier, Router, Utils) {

  describe('modules/dashboard/settings', function() {
    var authUser = {}

    beforeEach(function(done) {
      Utils.createAuthenticatedUser(authUser, done)
    })

    beforeEach(function() {
      Router.navigateTo('dashboard_settings')
    })

    afterEach(function(done) {
      Notifier.reset()
      Utils.logout()
      Utils.deleteUser(authUser, done)
    })

    describe('updateUser()', function() {
      var $name, $submit

      beforeEach(function(done) {
        Utils.waitForElementExists('.settings', function() {
          $name = document.querySelector('.settings [type=text]')
          $submit = document.querySelector('.settings [type=submit]')
          done()
        })
      })

      it('successfully save user infos', function(done) {
        Utils.value($name, 'Johnny')

        Utils.waitForElementExists('.notification', function() {
          expect(document.querySelector('.notification').textContent).toContain('Profile successfully saved.')
          expect(Auth.user.name).toEqual('Johnny')
          done()
        })
      })
    })

    describe('changePassword()', function() {
      var $btn, $oldPass, $newPass, $submit

      beforeEach(function(done) {
        Utils.waitForElementExists('.settings', function() {
          Utils.triggerEvent('click', document.querySelector('.js-change-password-toggle'))
          $oldPass = document.querySelectorAll('.settings_password [type=password]')[0]
          $newPass = document.querySelectorAll('.settings_password [type=password]')[1]
          $submit =  document.querySelector('.js-change-password-submit')
          done()
        })
      })

      it('shows an error for invalid password', function(done) {
        Utils.value($oldPass, 'invalid pass')
        Utils.value($newPass, Math.random().toString())
        Utils.triggerEvent('click', $submit)

        Utils.waitForElementExists('.notification', function() {
          expect(document.querySelector('.notification').textContent).toContain('Specified password is incorrect.')
          done()
        })
      })

      it('successfully change password', function(done) {
        Utils.value($oldPass, '****')
        Utils.value($newPass, Math.random().toString())
        Utils.triggerEvent('click', $submit)

        Utils.waitForElementExists('.notification', function() {
          expect(document.querySelector('.notification').textContent).toContain('Password successfully updated.')
          done()
        })
      })
    })

    describe('deleteUser()', function() {
      var $submit

      beforeEach(function(done) {
        Utils.waitForElementExists('.settings', function() {
          $submit = document.querySelector('.settings .js-delete-user-btn')
          done()
        })
      })

      it('shows an error for invalid password', function(done) {
        spyOn(window, 'prompt').and.returnValue('invalid pass')
        Utils.triggerEvent('click', $submit)

        Utils.waitForElementExists('.notification', function() {
          expect(document.querySelector('.notification').textContent).toContain('Specified password is incorrect.')
          done()
        })
      })

      it('successfully delete account', function(done) {
        spyOn(window, 'prompt').and.returnValue('****')
        Utils.triggerEvent('click', $submit)

        Utils.waitForElementExists('.notification', function() {
          expect(document.querySelector('.notification').textContent).toContain('Account successfully deleted.')
          done()
        })
      })
    })
  })
})
