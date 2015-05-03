define([
  'services/test-utils',
  'services/firebase'
], function(Utils, firebase) {

  describe('dashboard.home', function() {
    var authUser = {};
    var $tests, $newTest;


    beforeEach(function(done) {
      Utils.logout()
      Utils.createAuthenticatedUser(authUser, done);
    });

    beforeEach(function(done) {
      Utils.waitForElementExists('.item', function() {
        $tests = document.querySelectorAll('.item.__saved');
        $newTest = document.querySelector('.item.__new');
        done();
      });
    });

    beforeEach(function(done) {
      firebase.child('tests').child(authUser.uid).remove(done);
    });

    afterEach(function(done) {
      firebase.child('tests').child(authUser.uid).remove(done);
    });

    describe('home()', function() {
      it('should show message if no test', function() {
        var tests = firebase.collection(firebase.child('tests').child(authUser.uid));
        console.log('ok')
        expect(tests.length).toBe(0);
        console.log('ok--')
        expect($newTest).not.toBeNull();
        console.log('ok----')
      });

      it('should create a new test', function(done) {
        Utils.triggerEvent('click', $newTest);

        Utils.waitForElementVisible('.editor', function() {
          Utils.value(document.querySelector('.editor [test=test-name]'), 'test name');
          Utils.value(document.querySelector('.editor [test=test-code]'), 'test code');
          Utils.triggerEvent('click', document.querySelector('.editor [test=test-button]'));

          Utils.waitForElementVisible('.item.__saved', function() {
            expect(document.querySelector('.item.__saved')).toBeDefined;

            Utils.waitForElementExists('.editor .editor-message.__fail', function() {
              done();
            })
          });
        });
      });
    });
  });
});
