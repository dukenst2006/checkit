define([
  'services/test-utils',
  'services/firebase'
], function(Utils, firebase) {

  describe('dashboard.home', function() {
    var $tests, $newTest;

    beforeEach(function(done) {
      Utils.login(authUser, done);
    });

    beforeEach(function(done) {
      firebase.child('tests').child(authUser.uid).on('value', function() {
        $tests = document.querySelectorAll('.item.__saved')
        $newTest = document.querySelector('.check-something .btn')
        done()
      })
    })

    afterEach(function(done) {
      firebase.child('tests').child(authUser.uid).remove(function() {
        Utils.logout()
        done()
      })
    })

    describe('home()', function() {
      it('should show message if no test', function() {
        var tests = firebase.collection(firebase.child('tests').child(authUser.uid));
        expect(tests.length).toBe(0);
        expect($newTest).not.toBeNull();
      });

      it('should create a test', function(done) {
        Utils.triggerEvent('click', $newTest);

        Utils.waitForElementVisible('.editor.__show', function() {
          Utils.value(document.querySelector('.editor [test=test-name]'), 'test name');
          Utils.value(document.querySelector('.editor [test=test-code]'), 'done()');

          expect(document.querySelector('.__current')).not.toBeNull()

          Utils.triggerEvent('click', document.querySelector('.editor [test=save-button]'));
          Utils.waitForElementExists('.editor .editor-message.__pass', function() {
            expect(document.querySelector('.item.__saved')).toBeDefined();

            document.querySelector('.editor textarea').value = 'assert.ok(false); done()'

            Utils.triggerEvent('click', document.querySelector('.editor [test=save-button]'));
            Utils.waitForElementExists('.editor .editor-message.__fail', function() {
              done();
            })
          })
        });
      });

      it('should close a new test without saving', function(done) {
        Utils.triggerEvent('click', $newTest);

        Utils.waitForElementVisible('.editor.__show', function() {
          Utils.triggerEvent('click', document.querySelector('.editor .editor-close'));

          Utils.waitForElementVisible('.editor:not(.__show)', function() {
            done();
          });
        });
      });
    });
  });
});
