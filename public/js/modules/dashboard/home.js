define([
  'vue',
  'services/firebase',
  'services/test-helper',
  'text!./home.html'
], function(Vue, firebase, testHelper, template) {

  return Vue.component('dashboard_home', {

    layout: 'dashboard',

    inherit: true,

    template: template,

    data: function() {
      return {
        code: 'function sum(x, y) {\n  return x + y;\n}',
        expanded: false,
        testHelper: testHelper,
        tests: firebase.collection(firebase.child('tests'))
      }
    },

    ready: function() {
      this.formEl = this.$el.querySelector('.expandable-content')
    },

    methods: {

      expand: function(event) {
        var el = this.$el
        var formEl = this.formEl
        var containerEl = event.target.closest('.expandable')
        var triggerEl = containerEl.querySelector('.expandable-trigger')

        if (!containerEl.classList.contains('__expanded')) {
          requestAnimationFrame(function() {
            containerEl.prepend(formEl)
            formEl.classList.remove('hide')

            requestAnimationFrame(function() {
              containerEl.classList.add('__expanded')
            })
          })
        } else {
          requestAnimationFrame(function() {
            containerEl.classList.remove('__expanded')

            triggerEl.addEventListener('transitionend', function onTransitionEnd() {
              formEl.classList.add('hide')
              el.appendChild(formEl)
              triggerEl.removeEventListener('transitionend', onTransitionEnd)
            })
          })
        }
      },

      submit: function(event) {
        event.preventDefault()
        console.log('submit')
      }

    }
  })
})
