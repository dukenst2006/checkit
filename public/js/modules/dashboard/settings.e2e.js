define([
  'services/auth',
  'services/router',
  'services/test-utils'
], function(Auth, Router, Utils) {

  describe('dashboard.settings', function() {
    var authUser = {}

    beforeEach(function(done) {
      Utils.createAuthenticatedUser(authUser, done)
    })

    beforeEach(function(done) {
      Router.navigateTo('dashboard_home')

      Utils.waitForElementExists('.header .settings', function() {
        Utils.triggerEvent('click', document.querySelector('.header .settings'));
        done();
      });
    })

    afterEach(function(done) {
      Utils.logout()
      Utils.deleteUser(authUser, done)
    })

    describe('changePassword()', function() {
      it('shows an error for invalid password', function(done) {
        spyOn(window, 'alert')
        spyOn(window, 'prompt').and.returnValue('invalid pass')

        Utils.triggerEvent('click', document.querySelector('[test=change-password]'))

        Utils.waitFor(window.alert.calls.count, function() {
          expect(window.alert).toHaveBeenCalled()
          done()
        })
      })

      it('successfully change password', function(done) {
        spyOn(window, 'prompt').and.returnValue('****')

        Utils.triggerEvent('click', document.querySelector('[test=change-password]'))

        Utils.waitForElementExists('[test=password-success]', function() {
          expect(document.querySelector('[test=password-success]').textContent).toContain('Password successfully updated.')
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
        spyOn(window, 'alert')
        spyOn(window, 'prompt').and.returnValue('invalid pass')

        Utils.triggerEvent('click', document.querySelector('[test=delete-user]'))

        Utils.waitFor(window.alert.calls.count, function() {
          expect(window.alert).toHaveBeenCalled()
          done()
        })
      })

      it('successfully delete account', function(done) {
        spyOn(window, 'prompt').and.returnValue('****')

        Utils.triggerEvent('click', document.querySelector('[test=delete-user]'))

        Utils.waitForRoute('home', function() {
          expect(Auth.isAuthenticated()).toEqual(false)
          done()
        })
      })
    })
  })
})
