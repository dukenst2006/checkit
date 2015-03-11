define([
  'services/router',
  'services/firebase'
], function(Router, firebase) {

  return {

    testToCreate: null,

    createTest: function() {
      return this.testToCreate = {
        name: 'New Test',
        code: '... code ...'
      };
    },

    saveTest: function(test) {
      if (test.id) {
        firebase.child('tests').child(test.id).update({
          name: test.name,
          code: test.code
        });
      } else {
        delete test.id;

        // remove undefined values
        for (var key in test) {
          if (test[key] === undefined) {
            delete test[key];
          }
        }

        firebase.child('tests').push(test);
        this.testToCreate = null;
      }
    },

    removeTest: function(test) {
      firebase.child('tests').child(test.id).remove();
    }

  };

});
