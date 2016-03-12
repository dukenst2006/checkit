define([
  'config',
  'fb'
], function(Config) {

  var FIREBASE_URL = Config.FIREBASE.replace(/(\/)?$/, '/')

  var firebase = new Firebase(FIREBASE_URL)

  firebase.__proto__.collection = function(ref) {
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

    ref.on('child_changed', function(snap) {
      var newChild = snap.val()
      var child = coll.find(function(c) {
        return c.id === snap.key()
      })
      for (var key in newChild) {
        child[key] = newChild[key]
      }
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
