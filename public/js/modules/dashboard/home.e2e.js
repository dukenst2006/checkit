define([
  'services/test-utils',
  'services/router',
  'services/firebase'
], function(Utils, Router, firebase) {

  describe('dashboard.home', function() {
    var authUser = {};
    var tests = firebase.collection(firebase.child('tests'));
    var $tests, $btn;

    beforeEach(function(done) {
      Utils.createAuthenticatedUser(authUser, done);
    });

    beforeEach(function(done) {
      Router.navigateTo('dashboard_home');

      Utils.waitForElementExists('.tests', function() {
        $tests = document.querySelector('.tests');
        $btn = document.querySelector('.__new-test-btn');
        done();
      });
    });

    beforeEach(function(done) {
      firebase.child('tests').remove(done);
    });

    afterEach(function(done) {
      firebase.child('tests').remove(done);
    });

    describe('home()', function() {
      it('should show message if no test', function() {
        expect(tests.length).toBe(0);
        expect(document.querySelector('.test.__no-result')).not.toBeNull();
      });

      it('should create a new test', function(done) {
        expect($btn).not.toBeNull();
        expect(document.querySelector('.__new-test')).toBeNull();
        expect(document.querySelector('.__saved-test')).toBeNull();
        Utils.triggerEvent('click', $btn);

        Utils.waitForElementVisible('.__new-test', function() {
          var $newTest = document.querySelector('.__new-test');
          expect($newTest).not.toBeNull();
          expect(document.querySelector('.__saved-test')).toBeNull();

          Utils.value($newTest.querySelector('input'), 'test name');
          Utils.value($newTest.querySelector('textarea'), 'test code');
          Utils.triggerEvent('click', $newTest.querySelector('.__save-btn'));

          Utils.waitForElementVisible('.__saved-test', function() {
            var $savedTest = document.querySelector('.__saved-test');
            expect($savedTest).toBeDefined;
            done();
          });
        });
      });
    });

  });
});
