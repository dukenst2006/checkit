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

      it('can NOT read other user', function(done) {
        function fetchUser() {
          firebase.child('users').child(authUser2.uid).once('value', function(snap) {
            throw new Error('should not fetch')
          })
        }
        expect(fetchUser).not.toThrow()
        setTimeout(done, 800)
      });

      it('can read himself', function(done) {
        firebase.child('users').child(authUser.uid).once('value', function(snap) {
          expect(typeof snap.val()).toEqual('object')
          done()
        })
      });

      it('can NOT update other user', function(done) {
        firebase.child('users').child(authUser2.uid).set({ prop: 'value' }, function(err) {
          expect(err.code).toEqual('PERMISSION_DENIED')
          done()
        })
      });

      it('can update himself', function(done) {
        firebase.child('users').child(authUser.uid).set({ prop: 'value'}, function(err) {
          expect(err).toBe(null)
          done()
        })
      });

      it('can NOT delete other user', function(done) {
        firebase.child('users').child(authUser2.uid).remove(function(err) {
          expect(err.code).toEqual('PERMISSION_DENIED')
          done()
        })
      });

      it('can delete himself', function(done) {
        firebase.child('users').child(authUser.uid).remove(function(err) {
          expect(err).toBe(null)
          done()
        })
      });
    });

    describe('tests', function() {
      beforeEach(function(done) {
        firebase.child('tests').child(authUser.uid).push({
          name: 'test',
          code: 'xxx'
        }, done)
      })

      afterEach(function(done) {
        firebase.child('tests').off()
        firebase.child('tests').child(authUser.uid).remove(done);
      });

      it('can NOT read other tests', function(done) {
        function fetchTests() {
          firebase.child('tests').once('value', function(snap) {
            throw new Error('should not fetch')
          })
        }
        expect(fetchTests).not.toThrow()
        setTimeout(done, 800)
      })

      it('can read own tests', function(done) {
        firebase.child('tests').child(authUser.uid).once('value', function(snap) {
          expect(Object.keys(snap.val()).length).toEqual(1)
          done()
        })
      })

      it('can NOT create other tests', function(done) {
        firebase.child('tests').child(authUser2.uid).set({ name: 'test', code: 'code' }, function(err) {
          expect(err.code).toEqual('PERMISSION_DENIED')
          done()
        })
      })

      it('can NOT update other tests', function(done) {
        firebase.child('tests').set({ prop: 'value' }, function(err) {
          expect(err.code).toEqual('PERMISSION_DENIED')
          done()
        })
      })

      it('can create own tests', function(done) {
        firebase.child('tests').child(authUser.uid).push({ name: 'test', code: 'code' }, function(err) {
          expect(err).toBe(null)
          done()
        })
      })

      it('can update own tests', function(done) {
        firebase.child('tests').child(authUser.uid).set({ prop: 'value' }, function(err) {
          expect(err).toBe(null)
          done()
        })
      })
    })
  })
})
