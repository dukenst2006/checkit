define([
  'services/test-utils',
  'services/firebase'
], function(Utils, firebase) {

  describe('dashboard.security', function() {
    var authUser = {}, authUser2 = {};

    beforeEach(function(done) {
      Utils.createUser(authUser2);
      Utils.createAuthenticatedUser(authUser, done);
    });

    afterEach(function(done) {
      firebase.child('users').off()
      firebase.child('users').child(authUser.uid).remove(done);
    })

    afterEach(function(done) {
      Utils.deleteUser(authUser, function() {
        Utils.login(authUser2, function() {
          Utils.deleteUser(authUser2, done)
        })
      })
    });

    describe('users', function() {

      it('can NOT read other users', function(done) {
        function fetchUsers() {
          firebase.child('users').once('value', function(snap) {
            throw new Error('should not fetch')
          })
        }
        expect(fetchUsers).not.toThrow()
        setTimeout(done, 800)
      });
    })
  })
})
