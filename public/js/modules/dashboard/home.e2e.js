define([
  'services/test-utils',
  'services/db'
], function(Utils, Db) {

  describe('dashboard.home', function() {
    var authUser = {};
    var tests = Db.retrieveCollection(Db.tests());
    var $tests, $btn;

    beforeEach(function(done) {
      Utils.createUser(authUser, true, done);
    });

    beforeEach(function(done) {
      Utils
        .navigateTo('dashboard.home')
        .waitForElementExists('.tests', function() {
          $tests = $('.tests');
          $btn = $('.__new-test-btn');
          done();
        });
    });

    beforeEach(function(done) {
      Db.tests().remove(done);
    });

    afterEach(function(done) {
      Db.tests().remove(done);
    });

    describe('home()', function() {
      it('should show message if no test', function() {
        expect(tests.length).toBe(0);
        expect($('.test.__no-result').length).toBeGreaterThan(0);
      });

      it('should create a new test', function(done) {
        expect($btn.length).toBeGreaterThan(0);
        expect($('.__new-test').length).toBe(0);
        expect($('.__saved-test').length).toBe(0);
        $btn.trigger('click');

        Utils.waitForElementVisible('.__new-test', function() {
          var $newTest = $('.__new-test');
          expect($newTest.length).toBe(1);
          expect($('.__saved-test').length).toBe(0);

          Utils.value($newTest.find('input'), 'test name');
          Utils.value($newTest.find('textarea'), 'test code');
          $newTest.find('.__save-btn').trigger('click');

          Utils.waitForElementVisible('.__saved-test', function() {
            var $savedTest = $('.__saved-test');
            expect($savedTest.length).toEqual(1);
            done();
          });
        });
      });
    });

  });
});
