define([
  'services/test-utils',
  'services/firebase'
], function(Utils, firebase) {

  describe('dashboard.home', function() {
    var $checks, $newCheck

    beforeEach(function(done) {
      Utils.login(authUser, done)
    })

    beforeEach(function(done) {
      firebase.child('checks').child(authUser.uid).on('value', function() {
        $checks = document.querySelectorAll('.item.__saved')
        $newCheck = document.querySelector('.check-something .btn')
        done()
      })
    })

    afterEach(function(done) {
      firebase.child('checks').child(authUser.uid).remove(function() {
        Utils.logout()
        done()
      })
    })

    describe('home()', function() {
      it('should show message if no check', function() {
        var checks = firebase.collection(firebase.child('checks').child(authUser.uid))
        expect(checks.length).toBe(0)
        expect($newCheck).not.toBeNull()
      })

      it('should create/update/delete a check', function(done) {
        Utils.triggerEvent('click', $newCheck)

        Utils.waitForElementVisible('.editor.__show', function() {
          Utils.value(document.querySelector('.editor [check=check-name]'), 'check name')
          Utils.value(document.querySelector('.editor [check=check-code]'), 'if (false) notify()')

          expect(document.querySelector('.__current')).not.toBeNull()

          Utils.triggerEvent('click', document.querySelector('.editor [check=save-button]'))
          Utils.waitForElementExists('.editor .editor-message.__ok', function() {
            expect(document.querySelector('.item.__saved')).toBeDefined()

            document.querySelector('.editor textarea').value = 'throw new Error()'

            Utils.triggerEvent('click', document.querySelector('.editor [check=save-button]'))
            Utils.waitForElementExists('.editor .editor-message.__error', function() {

              window.confirm = function() { return true }
              Utils.triggerEvent('click', document.querySelector('.editor .btn.__delete'))
              Utils.waitForElementExists('.items .__empty', function() {
                expect(document.querySelector('.__current')).toBeNull()
                done()
              })
            })
          })
        })
      })

      it('should close a new check without saving', function(done) {
        Utils.triggerEvent('click', $newCheck)

        Utils.waitForElementVisible('.editor.__show', function() {
          Utils.triggerEvent('click', document.querySelector('.editor .editor-close'))

          Utils.waitForElementVisible('.editor:not(.__show)', function() {
            done()
          })
        })
      })
    })
  })
});
