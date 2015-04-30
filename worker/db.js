var Firebase = require('firebase');
var _ = require('underscore');

var config = require('requirejs')(__dirname + '/../public/js/config.js');
var firebase = new Firebase(config.FIREBASE);

var testsRef = firebase.child('tests');
var tests = [];

testsRef.on('child_added', function(snap) {
  tests.push(_.extend(snap.val(), { id: snap.key() }));
});

testsRef.on('child_changed', function(snap) {
  tests = _.without(tests, _.findWhere(tests, { id: snap.key() }));
  tests.push(_.extend(snap.val(), { id: snap.key() }));
});

testsRef.on('child_removed', function(snap) {
  tests = _.without(tests, _.findWhere(tests, { id: snap.key() }));
});

module.exports = {
  firebase: firebase,
  testsRef: testsRef,
  tests: tests
};
