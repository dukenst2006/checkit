define([
  'vue',
  'services/notifier',
  'text!./notifications.html'
], function(Vue, Notifier, template) {

  return Vue.component('notifications', {

    replace: true,

    template: template,

    data: function() {
      return {
        notifications: Notifier.notifications
      }
    },

    methods: {
      remove: Notifier.remove
    }

  })
})
