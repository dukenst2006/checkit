define([
  'config',
  'fb'
], function(Config) {

  // monkey patch for https://github.com/firebase/firebase-bower/issues/4
  fb.login.AuthenticationManager.prototype.createUser = function(params, opt_onComplete) {
    this.checkServerSettingsOrThrow()
    var path = '/users'
    var requestInfo = fb.login.RequestInfo.fromParams(params)
    requestInfo.serverParams['_method'] = 'POST'
    this.requestWithCredential(path, requestInfo, function(err, res) {
      fb.core.util.callUserCallback(opt_onComplete, err, res)
    })
  }

  var FIREBASE_URL = Config.FIREBASE.replace(/(\/)?$/, '/')

  var firebase = new Firebase(FIREBASE_URL)

  firebase.collection = function(ref) {
    var coll = []

    ref.on('value', function() {
      // TODO ajax loader
      // console.log('--', arguments, ref, coll)
    })

    ref.on('child_added', function(snap) {
      var child = snap.val()
      child.id = snap.key()
      coll.push(child)
    })

    ref.on('child_removed', function(snap) {
      var index = coll.findIndex(function(item) {
        return item.id === snap.key()
      })
      coll.splice(index, 1)
    })

    return coll
  }

  return firebase
})
