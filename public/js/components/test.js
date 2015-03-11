define([
  'vue',
  'services/test-helper',
  'text!./test.html'
], function(Vue, TestHelper, template) {

  return Vue.component('test', {

    template: template,

    attached: function() {
      this.$name = this.$el.querySelector('input');
      this.isOpen && this.$name.focus();
    },

    methods: {

      toggle: function() {
        this.isOpen = !this.isOpen;
        this.isOpen && this.$name.focus();
      },

      cancel: function() {
        this.toggle();

        if (!this.test.id) {
          TestHelper.testToCreate = null;
        }
      },

      save: function() {
        TestHelper.saveTest(this.test);
        this.toggle();
      },

      remove: function() {
        TestHelper.removeTest(this.test);
        this.$destroy();
      }

    }

  });
});
