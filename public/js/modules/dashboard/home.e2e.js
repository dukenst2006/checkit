define([
  'services/test-utils',
  'services/router',
  'services/firebase'
], function(Utils, Router, firebase) {

  describe('dashboard.home', function() {
    var authUser = {};
    var tests = firebase.collection(firebase.child('tests'));
    var $tests, $newTest;

    beforeEach(function(done) {
      Utils.createAuthenticatedUser(authUser, done);
    });

    beforeEach(function(done) {
      Router.navigateTo('dashboard_home');

      Utils.waitForElementExists('.item', function() {
        $tests = document.querySelectorAll('.item.__saved');
        $newTest = document.querySelector('.item.__new');
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
        expect($newTest).not.toBeNull();
      });

      it('should create a new test', function(done) {
        Utils.triggerEvent('click', $newTest);

        Utils.waitForElementVisible('.content', function() {
          Utils.value(document.querySelector('.content input'), 'test name');
          Utils.value(document.querySelector('.content textarea'), 'test code');
          Utils.triggerEvent('click', document.querySelector('.content [test=save-button]'));

          Utils.waitForElementVisible('.item.__saved', function() {
            expect(document.querySelector('.item.__saved')).toBeDefined;
            done();
          });
        });
      });
    });
  });
});
