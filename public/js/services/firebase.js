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

    ref.on('child_added', function(snap) {
      coll.push(_.extend(snap.val(), { id: snap.key() }))
    })

    ref.on('child_removed', function(snap) {
      var index = _.findIndex(coll, function(item) { return item.id === snap.key() })
      coll.splice(index, 1)
    })

    return coll
  }

  return firebase
})
