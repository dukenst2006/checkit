define([
  'vue',
  'rainbow',
  'behave',
  'services/firebase',
  'services/test-helper',
  'text!./home.html'
], function(Vue, Rainbow, Behave, firebase, testHelper, template) {

  return Vue.component('dashboard_home', {

    layout: 'dashboard',

    inherit: true,

    template: template,

    data: function() {
      return {
        code: 'function sum(x, y) {\n return x + y;\n}',
        expanded: false,
        testHelper: testHelper,
        tests: firebase.collection(firebase.child('tests'))
      }
    },

    ready: function() {
      this.formEl = this.$el.querySelector('.expandable-content')
      this.codeEl = this.formEl.querySelector('pre')
      this.textareaEl = this.formEl.querySelector('textarea');

      this.editor = new Behave({
        textarea: this.textareaEl,
        tabSize: 2,
        softTabs: true,
        autoIndent: true
      })

      this.textareaEl.addEventListener('keydown', this.colorize.bind(this))
      this.textareaEl.addEventListener('keyup', this.colorize.bind(this))

      var evt = document.createEvent('HTMLEvents');
      evt.initEvent('input', false, true);

      this.codeEl.addEventListener('keypress', function(event) {
        event.preventDefault()
        this.textareaEl.value += String.fromCharCode(event.charCode)
        this.textareaEl.dispatchEvent(evt)
      }.bind(this))
    },

    methods: {

      colorize: function() {
        var codeEl = this.codeEl

        Rainbow.color(this.textareaEl.value, 'javascript', function(colorized) {
          codeEl.innerHTML = colorized
        })
      },

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
