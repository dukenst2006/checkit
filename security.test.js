require('dotenv').load({ path: 'config/env' })

var expect = require('chai').expect
var firebase = require('./worker/firebase')


function createUser(user, cb) {
  var rand = Math.round(Math.random() * 1000000)
  user.email = 'foo-' + rand + '@bar.com'
  user.provider = user.provider || 'password'
  user.password = '****'

  firebase.createUser(user, function(err, authData) {
    if (err) throw err
    user.uid = authData.uid
    firebase.child('users/' + authData.uid).set(user, cb)
  })
}

function createAuthenticatedUser(user, cb) {
  createUser(user, function() {
    firebase.authWithPassword(user, cb)
  })
}

function deleteUser(user, cb) {
  firebase.child('users/' + user.uid).remove(function(err) {
    if (err) throw err
    firebase.removeUser(user, cb)
  })
}


describe('security', function() {
  var authUser = {}, authUser2 = {};

  beforeEach(function(done) {
    createUser(authUser2);
    createAuthenticatedUser(authUser, done);
  });

  afterEach(function(done) {
    firebase.child('users').off()
    firebase.child('users').child(authUser.uid).remove(done);
  })

  afterEach(function(done) {
    deleteUser(authUser, function() {
      firebase.authWithPassword(authUser2, function() {
        deleteUser(authUser2, done)
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
      expect(fetchUsers).not.to.throw()
      setTimeout(done, 800)
    });

    it('can NOT read other user', function(done) {
      function fetchUser() {
        firebase.child('users').child(authUser2.uid).once('value', function(snap) {
          throw new Error('should not fetch')
        })
      }
      expect(fetchUser).not.to.throw()
      setTimeout(done, 800)
    });

    it('can read himself', function(done) {
      firebase.child('users').child(authUser.uid).once('value', function(snap) {
        expect(typeof snap.val()).to.equal('object')
        done()
      })
    });

    it('can NOT update other user', function(done) {
      firebase.child('users').child(authUser2.uid).set({ prop: 'value' }, function(err) {
        expect(err.code).to.equal('PERMISSION_DENIED')
        done()
      })
    });

    it('can update himself', function(done) {
      firebase.child('users').child(authUser.uid).set({ prop: 'value'}, function(err) {
        expect(err).to.equal(null)
        done()
      })
    });

    it('can NOT delete other user', function(done) {
      firebase.child('users').child(authUser2.uid).remove(function(err) {
        expect(err.code).to.equal('PERMISSION_DENIED')
        done()
      })
    });

    it('can delete himself', function(done) {
      firebase.child('users').child(authUser.uid).remove(function(err) {
        expect(err).to.equal(null)
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
      expect(fetchTests).not.to.throw()
      setTimeout(done, 800)
    })

    it('can read own tests', function(done) {
      firebase.child('tests').child(authUser.uid).once('value', function(snap) {
        expect(Object.keys(snap.val()).length).to.equal(1)
        done()
      })
    })

    it('can NOT create other tests', function(done) {
      firebase.child('tests').child(authUser2.uid).set({ name: 'test', code: 'code' }, function(err) {
        expect(err.code).to.equal('PERMISSION_DENIED')
        done()
      })
    })

    it('can NOT update other tests', function(done) {
      firebase.child('tests').set({ prop: 'value' }, function(err) {
        expect(err.code).to.equal('PERMISSION_DENIED')
        done()
      })
    })

    it('can create own tests', function(done) {
      firebase.child('tests').child(authUser.uid).push({ name: 'test', code: 'code' }, function(err) {
        expect(err).to.equal(null)
        done()
      })
    })

    it('can update own tests', function(done) {
      firebase.child('tests').child(authUser.uid).set({ prop: 'value' }, function(err) {
        expect(err).to.equal(null)
        done()
      })
    })
  })
})
