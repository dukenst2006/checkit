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
        $btn = document.querySelector('.new-check-btn');
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
        expect(document.querySelector('.new-check')).toBeNull();
        expect(document.querySelector('.saved-check')).toBeNull();
        Utils.triggerEvent('click', $btn);

        Utils.waitForElementVisible('.new-check', function() {
          var $newTest = document.querySelector('.new-check');
          expect($newTest).not.toBeNull();
          expect(document.querySelector('.saved-check')).toBeNull();

          Utils.value($newTest.querySelector('input'), 'test name');
          Utils.value($newTest.querySelector('textarea'), 'test code');
          Utils.triggerEvent('click', $newTest.querySelector('.__save-btn'));

          Utils.waitForElementVisible('.saved-check', function() {
            var $savedTest = document.querySelector('.saved-check');
            expect($savedTest).toBeDefined;
            done();
          });
        });
      });
    });

  });
});
